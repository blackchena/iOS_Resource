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

function getMonthRange(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

async function main(gitlabUrl, token, month, topN) {
  const { startDate, endDate } = getMonthRange(month);
  console.log(`查询 ${month} (${startDate} ~ ${endDate}) 最活跃的分支 (Top ${topN})...\n`);

  const projects = await request(gitlabUrl, token, '/projects?membership=true&per_page=100');
  const branchActivity = [];
  const userCache = new Map();

  for (const project of projects) {
    try {
      const creatorName = await getCreatorName(gitlabUrl, token, project, userCache);
      const branches = await request(gitlabUrl, token, `/projects/${project.id}/repository/branches?per_page=100`);
      
      for (const branch of branches) {
        const commits = await request(
          gitlabUrl, token,
          `/projects/${project.id}/repository/commits?ref_name=${branch.name}&since=${startDate}&until=${endDate}&per_page=100`
        );
        
        if (commits.length > 0) {
          branchActivity.push({
            project: project.path_with_namespace,
            creator: creatorName,
            branch: branch.name,
            commitCount: commits.length,
            lastActivity: commits[0].created_at
          });
        }
      }
    } catch (e) {}
  }

  branchActivity.sort((a, b) => b.commitCount - a.commitCount);

  const result = [];
  const seenProjects = new Set();
  for (const item of branchActivity) {
    if (!seenProjects.has(item.project)) {
      result.push(item);
      seenProjects.add(item.project);
      if (result.length >= topN) break;
    }
  }

  console.log(`${month} 最活跃的 ${topN} 个分支:\n`);
  result.forEach((item, i) => {
    console.log(`${i + 1}. ${item.project} / ${item.branch}`);
    console.log(`   仓库创建者: ${item.creator}`);
    console.log(`   提交数: ${item.commitCount}`);
    console.log(`   最后活动: ${item.lastActivity}\n`);
  });
}

program
  .requiredOption('-u, --url <url>', 'GitLab URL')
  .requiredOption('-t, --token <token>', 'Private token')
  .requiredOption('-m, --month <month>', 'Target month (YYYY-MM)')
  .option('-n, --top <number>', 'Top active branches count', '5')
  .parse();

const options = program.opts();
const topN = Number.parseInt(options.top, 10);
if (!Number.isInteger(topN) || topN <= 0) {
  console.error('参数错误: --top 必须是正整数');
  process.exit(1);
}

main(options.url, options.token, options.month, topN).catch(console.error);
