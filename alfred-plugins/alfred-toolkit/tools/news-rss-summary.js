import Parser from 'rss-parser';
import dotenv from 'dotenv';
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const defaultFeedsPath = path.join(process.cwd(), 'config', 'news-feeds.cjs');
const defaultOutputDir = path.join(process.cwd(), 'reports');
const parser = new Parser();
const require = createRequire(import.meta.url);
const projectEnvPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env');

const CATEGORIES = [
  '重磅技术与开源前沿',
  '大模型与 AI 智能体',
  '基础设施与行业大厂',
  '网络安全与隐私',
  '极客开源好物',
  '最火开源仓库',
];

function guideItem(title, subtitle) {
  return { uid: 'news-rss-guide', title, subtitle, valid: false };
}

export function loadEnvironment({ envPath = projectEnvPath, target = process.env } = {}) {
  try {
    const parsed = dotenv.parse(readFileSync(envPath, 'utf8'));
    for (const [key, value] of Object.entries(parsed)) {
      if (target[key] === undefined) target[key] = value;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  return target;
}

loadEnvironment();

function normalizeText(value) {
  return String(value || '').trim().toLowerCase().replace(/\\s+/g, ' ');
}

export function parseInput(input = '') {
  const result = { feedsPath: defaultFeedsPath, hours: 24 };
  const trimmed = input.trim();
  if (!trimmed) return result;

  for (const token of trimmed.split(/\\s+/)) {
    const separator = token.indexOf('=');
    if (separator < 1) {
      throw new Error(`参数格式错误：${token}，请使用 feeds=路径 或 hours=24`);
    }
    const key = token.slice(0, separator);
    const value = token.slice(separator + 1);
    if (key === 'feeds') result.feedsPath = path.resolve(value);
    else if (key === 'hours') result.hours = Number(value);
    else throw new Error(`不支持的参数：${key}`);
  }
  return result;
}

function readFeedsConfig(feedsPath) {
  let config;
  try {
    config = require(feedsPath);
  } catch (error) {
    throw new Error(`RSS 配置读取失败：${error.message}`);
  }
  if (!config || !Array.isArray(config.feeds) || config.feeds.length === 0) {
    throw new Error('RSS 配置必须包含非空 feeds 数组');
  }
  for (const [index, feed] of config.feeds.entries()) {
    if (!feed || !String(feed.name || '').trim()) {
      throw new Error(`RSS 配置第 ${index + 1} 项缺少 name`);
    }
    let url;
    try { url = new URL(feed.url); } catch { url = null; }
    if (!url || !['http:', 'https:'].includes(url.protocol)) {
      throw new Error(`RSS 配置第 ${index + 1} 项 URL 无效`);
    }
  }
  return config.feeds.map(feed => ({ name: feed.name.trim(), url: feed.url.trim() }));
}

export function validateInput(input = '', { env = process.env, exists = existsSync } = {}) {
  let parsed;
  try {
    parsed = parseInput(input);
    if (!Number.isInteger(parsed.hours) || parsed.hours < 1 || parsed.hours > 168) {
      return { ok: false, error: '时间范围必须是 1 到 168 之间的整数小时' };
    }
    if (!exists(parsed.feedsPath)) {
      return { ok: false, error: `RSS 配置文件不存在：${parsed.feedsPath}` };
    }
    readFeedsConfig(parsed.feedsPath);
    for (const key of ['NEW_API_BASE_URL', 'NEW_API_KEY', 'NEW_API_MODEL']) {
      if (!String(env[key] || '').trim()) {
        return { ok: false, error: `缺少环境变量：${key}` };
      }
    }
    return { ok: true, ...parsed };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

export function filterRecentArticles(articles, now = new Date(), hours = 24) {
  const cutoff = now.getTime() - hours * 60 * 60 * 1000;
  return articles.filter(article => {
    const published = Date.parse(article.publishedAt || '');
    return Boolean(article.title?.trim()) && Number.isFinite(published)
      && published > cutoff && published <= now.getTime();
  });
}

export function deduplicateArticles(articles) {
  const seenLinks = new Set();
  const seenTitles = new Set();
  const result = [];
  for (const article of articles) {
    const titleKey = normalizeText(article.title);
    if (!titleKey) continue;
    const linkKey = normalizeText(article.link);
    if (seenTitles.has(titleKey) || (linkKey && seenLinks.has(linkKey))) continue;
    seenTitles.add(titleKey);
    if (linkKey) seenLinks.add(linkKey);
    result.push(article);
  }
  return result;
}

export function buildSummaryRequest(articles, { model }) {
  const promptArticles = articles.map((article, index) => [
    `[#${index + 1}] 标题: ${article.title}`,
    `来源: ${article.source || '未知'}`,
    `简述: ${String(article.summary || '').slice(0, 500)}`,
    `链接: ${article.link || '无'}`,
  ].join('\\n')).join('\\n---\\n');

  const systemPrompt = [
    '你是一位资深且客观的中文 IT 技术观察员。',
    '请对输入资讯跨来源强力去重，将同一事件合并并列出所有原始编号和链接。',
    `严格按以下分类输出：${CATEGORIES.join('、')}。`,
    '每条事件必须包含：一句话干货、技术影响、参考链接。',
    '只基于输入内容，不要编造未提供的事实，不要输出营销话术。',
  ].join('\\n');

  return {
    body: {
      model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `以下是待分析的 RSS 资讯：\\n\\n${promptArticles}` },
      ],
    },
  };
}

export function renderReport({ date, hours, articles, summary, succeededFeeds, failedFeeds }) {
  const failures = failedFeeds.length
    ? failedFeeds.map(feed => `- ${feed.name}: ${feed.error}`).join('\\n')
    : '- 无';
  const sourceLinks = articles.length
    ? articles.map(article => `- [${article.title}](${article.link || '#'})（${article.source || '未知来源'}）`).join('\\n')
    : '- 无';
  return [
    `# IT 行业热点情报与前沿分析 (${date})`,
    '',
    `- 筛选范围：最近 ${hours} 小时`,
    `- 成功 RSS 源：${succeededFeeds}`,
    `- 文章数量：${articles.length}`,
    '',
    '## RSS 源错误',
    failures,
    '',
    '## 原始资讯链接',
    sourceLinks,
    '',
    '## AI 摘要',
    summary,
    '',
  ].join('\\n');
}

async function readFeedsConfigAsync(feedsPath) {
  const config = require(feedsPath);
  if (!config || !Array.isArray(config.feeds) || config.feeds.length === 0) {
    throw new Error('RSS 配置必须包含非空 feeds 数组');
  }
  for (const [index, feed] of config.feeds.entries()) {
    let url;
    try { url = new URL(feed?.url); } catch { url = null; }
    if (!String(feed?.name || '').trim() || !url || !['http:', 'https:'].includes(url.protocol)) {
      throw new Error(`RSS 配置第 ${index + 1} 项无效`);
    }
  }
  return config.feeds.map(feed => ({ name: feed.name.trim(), url: feed.url.trim() }));
}

export async function fetchFeeds(feeds, { fetchImpl = globalThis.fetch, parserImpl = parser } = {}) {
  const articles = [];
  const failedFeeds = [];
  for (const feed of feeds) {
    try {
      const response = await fetchImpl(feed.url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const xml = await response.text();
      const parsed = await parserImpl.parseString(xml);
      for (const item of parsed.items || []) {
        articles.push({
          source: feed.name,
          title: item.title?.trim() || '',
          link: item.link?.trim() || item.guid?.trim() || '',
          summary: item.contentSnippet || item.content || item.summary || '',
          publishedAt: item.isoDate || item.pubDate || item.published || '',
        });
      }
    } catch (error) {
      failedFeeds.push({ name: feed.name, error: error.message });
    }
  }
  return { articles, failedFeeds, succeededFeeds: feeds.length - failedFeeds.length };
}

export async function summarizeArticles(articles, { fetchImpl = globalThis.fetch, env = process.env } = {}) {
  for (const key of ['NEW_API_BASE_URL', 'NEW_API_KEY', 'NEW_API_MODEL']) {
    if (!String(env[key] || '').trim()) throw new Error(`缺少环境变量：${key}`);
  }
  const baseUrl = env.NEW_API_BASE_URL.replace(/\/+$/, '');
  const request = buildSummaryRequest(articles, { model: env.NEW_API_MODEL });
  const response = await fetchImpl(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.NEW_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request.body),
  });
  if (!response.ok) throw new Error(`New API 请求失败：HTTP ${response.status}`);
  const data = await response.json();
  const summary = data?.choices?.[0]?.message?.content?.trim();
  if (!summary) throw new Error('New API 返回内容为空');
  return summary;
}

export async function generateReport(input = '', {
  fetchImpl = globalThis.fetch,
  env = process.env,
  now = new Date(),
  outputDir = defaultOutputDir,
} = {}) {
  const parsed = parseInput(input);
  const feeds = await readFeedsConfigAsync(parsed.feedsPath);
  const fetched = await fetchFeeds(feeds, { fetchImpl });
  const articles = deduplicateArticles(filterRecentArticles(fetched.articles, now, parsed.hours));
  const date = now.toISOString().slice(0, 10);
  const apiCalled = articles.length > 0;
  const summary = apiCalled
    ? await summarizeArticles(articles, { fetchImpl, env })
    : '本次筛选没有捕获到符合条件的 RSS 更新。';
  const report = renderReport({
    date, hours: parsed.hours, articles, summary,
    succeededFeeds: fetched.succeededFeeds, failedFeeds: fetched.failedFeeds,
  });
  await mkdir(outputDir, { recursive: true });
  const reportPath = path.resolve(outputDir, `IT_Daily_Report_${date}.md`);
  await writeFile(reportPath, report, 'utf8');
  return { reportPath, articles, apiCalled, failedFeeds: fetched.failedFeeds, succeededFeeds: fetched.succeededFeeds };
}

export function validate(input) {
  const result = validateInput(input);
  if (!result.ok) return { strategy: 'reject', items: [guideItem('⚠️ RSS 新闻摘要配置错误', result.error)] };
  return {
    strategy: 'confirm',
    summary: `读取 ${result.feedsPath}，分析最近 ${result.hours} 小时资讯并生成 Markdown 报告`,
  };
}

export async function handle(input) {
  try {
    const result = await generateReport(input);
    return [
      {
        uid: 'news-report-generated',
        title: `✅ RSS 新闻摘要报告已生成（${result.articles.length} 条）`,
        subtitle: result.reportPath,
        arg: result.reportPath,
        valid: true,
      },
      {
        uid: 'news-report-open',
        title: '📖 打开报告',
        subtitle: result.reportPath,
        arg: result.reportPath,
        variables: { ATK_ACTION: 'open-report' },
        valid: true,
      },
      {
        uid: 'news-report-copy',
        title: '📋 复制报告路径',
        subtitle: '将报告路径复制到剪贴板',
        arg: result.reportPath,
        variables: { ATK_ACTION: 'copy-report-path' },
        valid: true,
      },
    ];
  } catch (error) {
    return [guideItem('⚠️ RSS 新闻摘要失败', error.message)];
  }
}
