#!/usr/bin/env node

const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { Command } = require('commander');
const dayjs = require('dayjs');

function fail(message) {
  console.error(`\n[ERROR] ${message}`);
  process.exit(1);
}

function run(cmd, args, options = {}) {
  const result = spawnSync(cmd, args, {
    stdio: options.input ? ['pipe', 'inherit', 'inherit'] : 'inherit',
    input: options.input,
    encoding: 'utf8',
  });

  if (result.error) {
    fail(`${cmd} 执行失败: ${result.error.message}`);
  }

  if (result.status !== 0) {
    fail(`${cmd} ${args.join(' ')} 执行失败，退出码: ${result.status}`);
  }
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'"'"'`)}'`;
}

function normalizeRemoteTarget(inputPath) {
  const target = String(inputPath).trim();
  if (!target) {
    fail('远端目标路径不能为空');
  }

  if (target === '/') return target;
  return target.replace(/\/+$/, '');
}

const program = new Command();
program
  .name('sync-and-backup')
  .description('远端备份脚本：支持多个文件/目录，按源路径同级生成备份')
  .requiredOption('-u, --user <user>', '远程用户名')
  .requiredOption('-H, --host <host>', '远程主机地址')
  .option('--sudo', '远程操作使用 sudo -n（目标路径需要提权时使用）', false)
  .argument('<targets...>', '远端要备份的文件或目录（支持多个）')
  .showHelpAfterError();

program.parse(process.argv);
const options = program.opts();
const targets = program.args;

if (!Array.isArray(targets) || targets.length === 0) {
  fail('至少需要一个远端文件或目录作为备份目标');
}

const user = String(options.user).trim();
const host = String(options.host).trim();
const sshTarget = `${user}@${host}`;
const timestamp = dayjs().format('YYYYMMDDHHmm');
const useSudo = Boolean(options.sudo);
const sudoPrefix = useSudo ? 'sudo -n ' : '';

const normalizedTargets = targets.map((target) => normalizeRemoteTarget(target));
const duplicateCheck = new Set();
for (const sourcePath of normalizedTargets) {
  if (duplicateCheck.has(sourcePath)) {
    fail(`检测到重复目标: ${sourcePath}`);
  }
  duplicateCheck.add(sourcePath);
}

const backupPairs = normalizedTargets.map((sourcePath) => ({
  sourcePath,
  backupPath: path.posix.join(path.posix.dirname(sourcePath), `${path.posix.basename(sourcePath)}_${timestamp}`),
}));

const duplicateBackupCheck = new Set();
for (const pair of backupPairs) {
  if (duplicateBackupCheck.has(pair.backupPath)) {
    fail(`检测到备份路径冲突: ${pair.backupPath}`);
  }
  duplicateBackupCheck.add(pair.backupPath);
}

console.log(`[1/1] 远端开始备份，共 ${backupPairs.length} 个目标`);
for (const pair of backupPairs) {
  console.log(`  - ${pair.sourcePath} -> ${pair.backupPath}`);
}

const sourceLiteral = backupPairs.map((pair) => shellEscape(pair.sourcePath)).join(' ');
const backupLiteral = backupPairs.map((pair) => shellEscape(pair.backupPath)).join(' ');

const remoteScript = `
set -euo pipefail

SUDO=${shellEscape(sudoPrefix)}
SOURCES=( ${sourceLiteral} )
BACKUPS=( ${backupLiteral} )

run_remote() {
  if [ -n "$SUDO" ]; then
    $SUDO "$@"
  else
    "$@"
  fi
}

for i in "\${!SOURCES[@]}"; do
  src="\${SOURCES[$i]}"
  backup="\${BACKUPS[$i]}"

  if ! run_remote test -e "$src"; then
    echo "目标不存在: $src" >&2
    exit 1
  fi

  if run_remote test -e "$backup"; then
    echo "备份目标已存在，请稍后重试: $backup" >&2
    exit 1
  fi

  run_remote cp -a "$src" "$backup"
  echo "已备份: $src -> $backup"
done
`;

run('ssh', ['-T', sshTarget, 'bash -se'], { input: remoteScript });
console.log(`备份完成，时间戳: ${timestamp}`);
