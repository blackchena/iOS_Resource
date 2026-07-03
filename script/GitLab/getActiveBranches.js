const axios = require('axios');
const { program } = require('commander');

async function request(gitlabUrl, token, path) {
  const response = await axios.get(`${gitlabUrl}/api/v4${path}`, {
    headers: { 'PRIVATE-TOKEN': token }
  });
  return response.data;
}

async function getCreatorName(gitlabUrl, token, project, userCache) {
  let creatorId = project.creator_id;
  if (!creatorId) {
    try {
      const detail = await request(gitlabUrl, token, `/projects/${project.id}`);
      creatorId = detail.creator_id;
    } catch (e) {}
  }
  if (!creatorId) return '未知';
  if (userCache.has(creatorId)) return userCache.get(creatorId);

  try {
    const user = await request(gitlabUrl, token, `/users/${creatorId}`);
    const name = user.name || user.username || `ID:${creatorId}`;
    userCache.set(creatorId, name);
    return name;
  } catch (e) {
    const fallbackName = `ID:${creatorId}`;
    userCache.set(creatorId, fallbackName);
    return fallbackName;
  }
}

async function requestAllPages(gitlabUrl, token, path, perPage = 100) {
  const all = [];
  let page = 1;
  while (true) {
    const separator = path.includes('?') ? '&' : '?';
    const pagedPath = `${path}${separator}per_page=${perPage}&page=${page}`;
    const data = await request(gitlabUrl, token, pagedPath);
    if (!Array.isArray(data) || data.length === 0) {
      break;
    }
    all.push(...data);
    if (data.length < perPage) {
      break;
    }
    page += 1;
  }
  return all;
}

function countDiffLines(diffText) {
  let additions = 0;
  let deletions = 0;
  if (!diffText) {
    return { additions, deletions };
  }

  const lines = diffText.split('\n');
  for (const line of lines) {
    if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) {
      continue;
    }
    if (line.startsWith('+')) {
      additions += 1;
    } else if (line.startsWith('-')) {
      deletions += 1;
    }
  }

  return { additions, deletions };
}

async function getBranchMonthChange(gitlabUrl, token, projectId, branchName, startDate, endDate) {
  const commits = await requestAllPages(
    gitlabUrl,
    token,
    `/projects/${projectId}/repository/commits?ref_name=${encodeURIComponent(branchName)}&since=${startDate}&until=${endDate}`
  );

  if (commits.length === 0) {
    return null;
  }

  const latestCommit = commits[0];
  const earliestCommit = commits[commits.length - 1];

  let diffStats = {
    addedLines: 0,
    modifiedLines: 0,
    deletedLines: 0
  };

  if (latestCommit.id !== earliestCommit.id) {
    const compare = await request(
      gitlabUrl,
      token,
      `/projects/${projectId}/repository/compare?from=${encodeURIComponent(earliestCommit.id)}&to=${encodeURIComponent(latestCommit.id)}&straight=true`
    );

    const diffs = Array.isArray(compare.diffs) ? compare.diffs : [];
    for (const fileDiff of diffs) {
      const { additions, deletions } = countDiffLines(fileDiff.diff || '');
      if (fileDiff.new_file) {
        diffStats.addedLines += additions;
        continue;
      }
      if (fileDiff.deleted_file) {
        diffStats.deletedLines += deletions;
        continue;
      }
      diffStats.modifiedLines += additions + deletions;
    }
  }

  return {
    commitCount: commits.length,
    earliestCommit,
    latestCommit,
    diffStats
  };
}

function getMonthRange(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

async function main(gitlabUrl, token, month, topN, threshold, targetBranch) {
  const { startDate, endDate } = getMonthRange(month);
  console.log(`查询 ${month} (${startDate} ~ ${endDate}) 月初首提到月末末提 diff 超过 ${threshold} 行的分支 (Top ${topN})...\n`);

  const projects = await request(gitlabUrl, token, '/projects?membership=true&per_page=100');
  const branchActivity = [];
  const userCache = new Map();

  for (const project of projects) {
    try {
      const creatorName = await getCreatorName(gitlabUrl, token, project, userCache);
      const branches = await request(gitlabUrl, token, `/projects/${project.id}/repository/branches?per_page=100`);
      
      for (const branch of branches) {
        if (targetBranch && branch.name !== targetBranch) {
          continue;
        }

        const change = await getBranchMonthChange(
          gitlabUrl,
          token,
          project.id,
          branch.name,
          startDate,
          endDate
        );

        if (!change) {
          continue;
        }

        const isMatched =
          change.diffStats.addedLines > threshold ||
          change.diffStats.modifiedLines > threshold ||
          change.diffStats.deletedLines > threshold;

        if (isMatched) {
          branchActivity.push({
            project: project.path_with_namespace,
            creator: creatorName,
            branch: branch.name,
            commitCount: change.commitCount,
            diffStats: change.diffStats,
            monthStartCommit: change.earliestCommit.id,
            monthEndCommit: change.latestCommit.id,
            lastActivity: change.latestCommit.created_at
          });
        }
      }
    } catch (e) {}
  }

  branchActivity.sort((a, b) => {
    const aTotal = a.diffStats.addedLines + a.diffStats.modifiedLines + a.diffStats.deletedLines;
    const bTotal = b.diffStats.addedLines + b.diffStats.modifiedLines + b.diffStats.deletedLines;
    if (bTotal !== aTotal) {
      return bTotal - aTotal;
    }
    return b.commitCount - a.commitCount;
  });

  const result = [];
  const seenProjects = new Set();
  for (const item of branchActivity) {
    if (!seenProjects.has(item.project)) {
      result.push(item);
      seenProjects.add(item.project);
      if (result.length >= topN) break;
    }
  }

  console.log(`${month} 月初第一次提交到月末最后一次提交的 diff（新增/修改/删除）超过 ${threshold} 的 ${topN} 个分支:\n`);
  result.forEach((item, i) => {
    console.log(`${i + 1}. ${item.project} / ${item.branch}`);
    console.log(`   仓库创建者: ${item.creator}`);
    console.log(`   月内提交数: ${item.commitCount}`);
    console.log(`   区间 diff 新增/修改/删除: ${item.diffStats.addedLines}/${item.diffStats.modifiedLines}/${item.diffStats.deletedLines}`);
    console.log(`   月初提交: ${item.monthStartCommit}`);
    console.log(`   月末提交: ${item.monthEndCommit}`);
    console.log(`   最后活动: ${item.lastActivity}\n`);
  });
}

program
  .requiredOption('-u, --url <url>', 'GitLab URL')
  .requiredOption('-t, --token <token>', 'Private token')
  .requiredOption('-m, --month <month>', 'Target month (YYYY-MM)')
  .option('-n, --top <number>', 'Top active branches count', '10')
  .option('-s, --threshold <number>', 'Changed lines threshold per commit', '100')
  .option('-b, --branch <name>', 'Only analyze the specified branch name')
  .parse();

const options = program.opts();
const topN = Number.parseInt(options.top, 10);
const threshold = Number.parseInt(options.threshold, 10);
if (!Number.isInteger(topN) || topN <= 0) {
  console.error('参数错误: --top 必须是正整数');
  process.exit(1);
}

if (!Number.isInteger(threshold) || threshold < 0) {
  console.error('参数错误: --threshold 必须是非负整数');
  process.exit(1);
}

main(options.url, options.token, options.month, topN, threshold, options.branch).catch(console.error);
