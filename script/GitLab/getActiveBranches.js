const axios = require('axios');
const { program } = require('commander');

async function request(gitlabUrl, token, path) {
  const response = await axios.get(`${gitlabUrl}/api/v4${path}`, {
    headers: { 'PRIVATE-TOKEN': token }
  });
  return response.data;
}

function getMonthRange(monthStr) {
  const [year, month] = monthStr.split('-').map(Number);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

async function main(gitlabUrl, token, month) {
  const { startDate, endDate } = getMonthRange(month);
  console.log(`查询 ${month} (${startDate} ~ ${endDate}) 最活跃的分支...\n`);

  const projects = await request(gitlabUrl, token, '/projects?membership=true&per_page=100');
  const branchActivity = [];

  for (const project of projects) {
    try {
      const branches = await request(gitlabUrl, token, `/projects/${project.id}/repository/branches?per_page=100`);
      
      for (const branch of branches) {
        const commits = await request(
          gitlabUrl, token,
          `/projects/${project.id}/repository/commits?ref_name=${branch.name}&since=${startDate}&until=${endDate}&per_page=100`
        );
        
        if (commits.length > 0) {
          branchActivity.push({
            project: project.path_with_namespace,
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
      if (result.length >= 2) break;
    }
  }

  console.log(`${month} 最活跃的两个分支:\n`);
  result.forEach((item, i) => {
    console.log(`${i + 1}. ${item.project} / ${item.branch}`);
    console.log(`   提交数: ${item.commitCount}`);
    console.log(`   最后活动: ${item.lastActivity}\n`);
  });
}

program
  .requiredOption('-u, --url <url>', 'GitLab URL')
  .requiredOption('-t, --token <token>', 'Private token')
  .requiredOption('-m, --month <month>', 'Target month (YYYY-MM)')
  .parse();

const options = program.opts();
main(options.url, options.token, options.month).catch(console.error);
