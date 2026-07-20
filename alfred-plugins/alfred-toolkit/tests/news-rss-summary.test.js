import { describe, it, expect } from 'vitest';
import path from 'node:path';
import os from 'node:os';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';

import {
  defaultFeedsPath,
  parseInput,
  validateInput,
  filterRecentArticles,
  deduplicateArticles,
  buildSummaryRequest,
  renderReport,
  fetchFeeds,
  summarizeArticles,
  generateReport,
  loadEnvironment,
} from '../tools/news-rss-summary.js';

const missingPath = path.join(os.tmpdir(), 'missing-news-feeds.json');
const articles = [{
  source: 'Example',
  title: 'A useful release',
  link: 'https://example.com/a',
  summary: 'A short summary',
  publishedAt: '2026-07-20T10:00:00Z',
}];

describe('news-rss-summary pure logic', () => {
  it('loads New API variables from an explicit dotenv file', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'news-env-'));
    const envPath = path.join(tempDir, '.env');
    await writeFile(envPath, 'NEW_API_BASE_URL=https://dotenv.example/v1\nNEW_API_MODEL=dotenv-model\n');
    const env = loadEnvironment({ envPath, target: {} });
    expect(env.NEW_API_BASE_URL).toBe('https://dotenv.example/v1');
    expect(env.NEW_API_MODEL).toBe('dotenv-model');
    await rm(tempDir, { recursive: true, force: true });
  });

  it('parses default input as the default feed file and 24 hours', () => {
    expect(parseInput('')).toEqual({ feedsPath: defaultFeedsPath, hours: 24 });
  });

  it('rejects non-positive hours and missing feed files', () => {
    expect(validateInput('hours=0')).toMatchObject({ ok: false });
    expect(validateInput(`feeds=${missingPath}`)).toMatchObject({ ok: false });
  });

  it('accepts the default configuration when New API environment is complete', () => {
    expect(validateInput('', {
      env: {
        NEW_API_BASE_URL: 'https://api.example/v1',
        NEW_API_KEY: 'secret',
        NEW_API_MODEL: 'news-model',
      },
    })).toMatchObject({ ok: true, hours: 24 });
  });

  it('keeps only dated articles inside the requested window', () => {
    const items = [
      { title: 'inside', publishedAt: '2026-07-20T10:00:00Z' },
      { title: 'outside', publishedAt: '2026-07-19T10:00:00Z' },
      { title: 'unknown' },
    ];
    const result = filterRecentArticles(items, new Date('2026-07-20T12:00:00Z'), 24);
    expect(result.map(item => item.title)).toEqual(['inside']);
  });

  it('deduplicates by normalized link then normalized title', () => {
    const duplicates = [
      { title: 'Same', link: ' HTTPS://EXAMPLE.COM/A ' },
      { title: 'Different title', link: 'https://example.com/a' },
      { title: 'Same', link: '' },
      { title: 'Unique', link: '' },
    ];
    expect(deduplicateArticles(duplicates)).toEqual([duplicates[0], duplicates[3]]);
  });

  it('builds an OpenAI-compatible request with source links and category instructions', () => {
    const request = buildSummaryRequest(articles, { model: 'test-model' });
    expect(request.body.model).toBe('test-model');
    expect(request.body.messages[1].content).toContain('https://example.com/a');
    expect(request.body.messages[0].content).toContain('大模型与 AI 智能体');
    expect(request.body.messages[0].content).toContain('网络安全与隐私');
  });

  it('renders report metadata and model summary as markdown', () => {
    const report = renderReport({
      date: '2026-07-20', hours: 24, articles, summary: '## 摘要',
      succeededFeeds: 2, failedFeeds: [],
    });
    expect(report).toContain('# IT 行业热点情报与前沿分析 (2026-07-20)');
    expect(report).toContain('## 摘要');
    expect(report).toContain('https://example.com/a');
  });
});

describe('news-rss-summary network workflow', () => {
  it('continues fetching after one RSS source fails', async () => {
    const result = await fetchFeeds([
      { name: 'Good', url: 'https://good.example/rss' },
      { name: 'Bad', url: 'https://bad.example/rss' },
    ], {
      fetchImpl: async url => {
        if (url.includes('bad')) throw new Error('network down');
        return { ok: true, text: async () => '<rss>good</rss>' };
      },
      parserImpl: { parseString: async () => ({ items: [{
        title: 'Fresh item', link: 'https://good.example/item',
        contentSnippet: 'summary', isoDate: '2026-07-20T10:00:00Z',
      }] }) },
    });
    expect(result.articles).toHaveLength(1);
    expect(result.failedFeeds).toEqual([{ name: 'Bad', error: 'network down' }]);
    expect(result.succeededFeeds).toBe(1);
  });

  it('calls the OpenAI-compatible New API with authentication and article data', async () => {
    let requestUrl;
    let requestOptions;
    const summary = await summarizeArticles(articles, {
      env: {
        NEW_API_BASE_URL: 'https://api.example/v1/',
        NEW_API_KEY: 'secret',
        NEW_API_MODEL: 'news-model',
      },
      fetchImpl: async (url, options) => {
        requestUrl = url;
        requestOptions = options;
        return { ok: true, json: async () => ({ choices: [{ message: { content: '## 结果' } }] }) };
      },
    });
    expect(summary).toBe('## 结果');
    expect(requestUrl).toBe('https://api.example/v1/chat/completions');
    expect(requestOptions.headers.Authorization).toBe('Bearer secret');
    expect(JSON.parse(requestOptions.body).model).toBe('news-model');
    expect(requestOptions.body).toContain('https://example.com/a');
  });

  it('writes an empty report without calling the API when there are no recent articles', async () => {
    const outputDir = await mkdtemp(path.join(os.tmpdir(), 'news-report-'));
    let apiCalled = false;
    const result = await generateReport('', {
      outputDir,
      now: new Date('2026-07-20T12:00:00Z'),
      env: {
        NEW_API_BASE_URL: 'https://api.example/v1',
        NEW_API_KEY: 'secret',
        NEW_API_MODEL: 'news-model',
      },
      fetchImpl: async () => ({ ok: true, text: async () => '<rss />' }),
    });
    apiCalled = result.apiCalled;
    const report = await readFile(result.reportPath, 'utf8');
    expect(apiCalled).toBe(false);
    expect(report).toContain('没有捕获到符合条件的 RSS 更新');
    expect(result.reportPath).toContain('IT_Daily_Report_2026-07-20.md');
    await rm(outputDir, { recursive: true, force: true });
  });
});
