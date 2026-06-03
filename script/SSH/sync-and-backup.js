#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { Command } = require('commander');

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

const program = new Command();
program
  .name('sync-and-backup')
  .description('通用文件/目录同步脚本：上传前备份远程同名目标，再覆盖到指定目录')
  .argument('<sources...>', '本地要上传的文件或目录（支持多个）')
  .requiredOption('-u, --user <user>', '远程用户名')
  .requiredOption('-H, --host <host>', '远程主机地址')
  .requiredOption('-d, --dest <dir>', '远程目标目录')
  .option('-b, --backup-dir <dir>', '远程备份根目录，默认 <dest>/.backups')
  .option('--sudo', '远程操作使用 sudo -n（目标目录需要提权时使用）', false)
  .showHelpAfterError();

program.parse(process.argv);
const options = program.opts();
const sourceArgs = program.args;

if (!Array.isArray(sourceArgs) || sourceArgs.length === 0) {
  fail('至少需要一个本地文件或目录作为上传源');
}

const user = String(options.user).trim();
const host = String(options.host).trim();
const remoteDestDir = String(options.dest).trim();

const remoteBackupRoot = String(options.backupDir || `${remoteDestDir}/.backups`).trim();
const sshTarget = `${user}@${host}`;
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const stagingDir = `/tmp/sync-files-${timestamp}-${process.pid}`;
const useSudo = Boolean(options.sudo);
const sudoPrefix = useSudo ? 'sudo -n ' : '';

const normalizedSources = sourceArgs.map((item) => {
  const absolutePath = path.isAbsolute(item) ? item : path.resolve(process.cwd(), item);
  if (!fs.existsSync(absolutePath)) {
    fail(`本地文件或目录不存在: ${absolutePath}`);
  }

  return {
    absolutePath,
    name: path.basename(absolutePath),
  };
});

const nameSet = new Set();
for (const source of normalizedSources) {
  if (nameSet.has(source.name)) {
    fail(`检测到重名源（basename 相同）: ${source.name}，请避免同名后再执行`);
  }
  nameSet.add(source.name);
}

console.log('[1/3] 上传本地文件/目录到远程临时目录');
const rsyncArgs = ['-avz', '--rsync-path', `mkdir -p ${shellEscape(stagingDir)} && rsync`];
for (const source of normalizedSources) {
  console.log(`  - ${source.absolutePath}`);
  rsyncArgs.push(source.absolutePath);
}
rsyncArgs.push(`${sshTarget}:${stagingDir}/`);
run('rsync', rsyncArgs);

console.log('[2/3] 远程备份并覆盖目标目录中的同名文件/目录');
const sourceNamesLiteral = normalizedSources
  .map((source) => shellEscape(source.name))
  .join(' ');

const remoteScript = `
set -euo pipefail

DEST_DIR=${shellEscape(remoteDestDir)}
BACKUP_ROOT=${shellEscape(remoteBackupRoot)}
STAGING_DIR=${shellEscape(stagingDir)}
TIMESTAMP=${shellEscape(timestamp)}

SUDO=${shellEscape(sudoPrefix)}

run_remote() {
  if [ -n "$SUDO" ]; then
    $SUDO "$@"
  else
    "$@"
  fi
}

cleanup() {
  rm -rf "$STAGING_DIR" || true
}
trap cleanup EXIT

run_remote mkdir -p "$DEST_DIR"
run_remote mkdir -p "$BACKUP_ROOT"

BACKUP_DIR="$BACKUP_ROOT/$TIMESTAMP"
NEED_BACKUP_DIR=0

FILES=( ${sourceNamesLiteral} )
for file_name in "\${FILES[@]}"; do
  src="$STAGING_DIR/$file_name"
  dst="$DEST_DIR/$file_name"

  if [ ! -e "$src" ]; then
    echo "上传结果缺失: $src" >&2
    exit 1
  fi

  if run_remote test -e "$dst"; then
    if [ "$NEED_BACKUP_DIR" -eq 0 ]; then
      run_remote mkdir -p "$BACKUP_DIR"
      NEED_BACKUP_DIR=1
    fi

    run_remote cp -a "$dst" "$BACKUP_DIR/$file_name"
    echo "已备份: $dst -> $BACKUP_DIR/$file_name"
  else
    echo "目标不存在，跳过备份: $dst"
  fi

  run_remote rm -rf "$dst"
  run_remote mv "$src" "$dst"
  echo "已同步: $dst"
done
`;

run('ssh', ['-T', sshTarget, 'bash -se'], { input: remoteScript });

console.log(`[3/3] 同步完成，目标目录: ${remoteDestDir}`);
console.log(`备份根目录: ${remoteBackupRoot}`);
console.log(`备份批次时间戳: ${timestamp}`);
