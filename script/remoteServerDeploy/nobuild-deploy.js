#!/usr/bin/env node

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { program } from "commander";
import chalk from "chalk";
import dayjs from "dayjs";

const defaultLocalOut = "./out";

// Logger functions using chalk
const logger = {
  info: (message) => console.log(chalk.blue(message)),
  success: (message) => console.log(chalk.green(message)),
  warning: (message) => console.log(chalk.yellow(message)),
  error: (message) => console.log(chalk.red(message)),
  cyan: (message) => console.log(chalk.cyan(message)),
  bright: (message) => console.log(chalk.bold(message)),
  dim: (message) => console.log(chalk.dim(message)),
};

// Configure commander
program
  .name("deploy")
  .description("Deploy script for uploading and backing up files to remote server")
  .version("1.0.0")
  .option("-c, --config <path>", "Path to config file (JSON format)", "deploy.config.json")
  .option("-u, --user <user>", "SSH username")
  .option("-h, --host <host>", "SSH hostname or IP address")
  .option("-i, --identity-file <path>", "SSH private key path (IdentityFile)")
  .option("-r, --remote-path <path>", "Remote server target path")
  .option("-l, --local-out <path>", "Local out directory path")
  .option("--overwrite", "Overwrite remote files (adds --delete --checksum to rsync)")
  .option("--skip-upload", "Skip upload step")
  .option("--skip-backup", "Skip backup step")
  .option("--delete-backup <name>", "Delete a specific remote backup folder by name")
  .addHelpText(
    "after",
    `
Examples:
  # Full deployment (backup + upload)
  $ deploy --host xxx.xxx.com --user ubuntu --remote-path /var/www/xxx.xxx.com

  # Use SSH config host alias (no --user needed if configured in ~/.ssh/config)
  $ deploy --host prod-server --remote-path /var/www/xxx.xxx.com

  # Use config file
  $ deploy --config deploy.config.json

  # Use config file and override with command line options
  $ deploy --config deploy.config.json --host another-host.com

  # Upload only (skip backup)
  $ deploy --skip-backup --host xxx.xxx.com --remote-path /var/www/xxx.xxx.com

  # Backup only (skip upload)
  $ deploy --skip-upload --host xxx.xxx.com --remote-path /var/www/xxx.xxx.com

  # Delete a specific backup folder
  $ deploy --delete-backup xxx.xxx.com_20260101123000 --host xxx.xxx.com --remote-path /var/www/xxx.xxx.com

  # Upload with overwrite (delete remote files not in local)
  $ deploy --overwrite --host xxx.xxx.com --remote-path /var/www/xxx.xxx.com

Config file format (JSON):
  {
    "user": "username",
    "host": "ssh.example.com",
    "identityFile": "~/.ssh/id_ed25519",
    "remotePath": "/var/www/example.com",
    "localOut": "./out",
    "overwrite": false,
    "skipUpload": false,
    "skipBackup": false
  }
    `
  );

program.parse();

const options = program.opts();

// Load config from file if provided
let fileConfig = {};
const configPath = path.resolve(options.config);
if (fs.existsSync(configPath)) {
  try {
    const configContent = fs.readFileSync(configPath, "utf8");
    fileConfig = JSON.parse(configContent);
    console.log(chalk.green(`✅ Loaded config from: ${configPath}`));
  } catch (error) {
    console.error(chalk.red(`Error: Failed to parse config file: ${error.message}`));
    process.exit(1);
  }
} else if (options.config !== "deploy.config.json") {
  // Only error if user explicitly specified a config file that doesn't exist
  console.error(chalk.red(`Error: Config file not found: ${configPath}`));
  process.exit(1);
} else {
  console.log(chalk.yellow(`ℹ️  No config file found, using command line arguments.`));
}

// Merge configuration: defaults < file config < command line options
const config = {
  remoteHost: options.host || fileConfig.host,
  remotePath: options.remotePath || fileConfig.remotePath,
  localOutPath: options.localOut || fileConfig.localOut || defaultLocalOut,
  user: options.user || fileConfig.user,
  identityFile: options.identityFile || fileConfig.identityFile,
  overwrite: options.overwrite ?? fileConfig.overwrite ?? false,
  skipUpload: options.skipUpload ?? fileConfig.skipUpload ?? false,
  skipBackup: options.skipBackup ?? fileConfig.skipBackup ?? false,
  deleteBackup: options.deleteBackup || fileConfig.deleteBackup,
};

if (config.identityFile) {
  config.identityFile = path.resolve(config.identityFile);
  if (!fs.existsSync(config.identityFile)) {
    logger.error(`Error: identity file not found: ${config.identityFile}`);
    process.exit(1);
  }
}

// Validate required arguments for upload/backup
if (!config.skipUpload || !config.skipBackup) {
  if (!config.remoteHost || !config.remotePath) {
    logger.error("Error: --host and --remote-path are required when upload or backup is enabled");
    process.exit(1);
  }
}

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function getRemoteTarget() {
  return config.user ? `${config.user}@${config.remoteHost}` : config.remoteHost;
}

function getSshPrefix() {
  const parts = ["ssh"];
  if (config.identityFile) {
    parts.push("-i", shellEscape(config.identityFile));
  }
  parts.push(getRemoteTarget());
  return parts.join(" ");
}

function normalizeLocalPath(localPath) {
  const inputPath = String(localPath || "").trim();

  if (!inputPath) {
    logger.error("❌ Local path is required");
    process.exit(1);
  }

  const resolvedPath = path.resolve(inputPath);
  const rootPath = path.parse(resolvedPath).root;

  if (resolvedPath === rootPath) {
    return resolvedPath;
  }

  return resolvedPath.replace(/[\\/]+$/, "");
}

function execCommand(command, description) {
  try {
    logger.cyan(`🔄 ${description}...`);
    logger.dim(`Command: ${command}`);

    const output = execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
    });

    if (output) {
      logger.dim(output);
    }

    logger.success(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    logger.error(`❌ ${description} failed:`);
    logger.error(error.message);
    if (error.stdout) logger.warning(error.stdout);
    if (error.stderr) logger.error(error.stderr);
    return false;
  }
}

function printRemoteBackupFolders(parentDir, targetName) {
  const backupPattern = `${targetName}_*`;
  const listCommand =
    `${getSshPrefix()} "find ${shellEscape(parentDir)} -maxdepth 1 -mindepth 1 ` +
    `-type d -name ${shellEscape(backupPattern)} | sort"`;

  try {
    const rawOutput = execSync(listCommand, {
      encoding: "utf8",
      stdio: "pipe",
    });
    const backupFolders = rawOutput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((remotePath) => path.basename(remotePath));

    logger.cyan(`📚 Existing backup folders (${backupFolders.length}):`);
    if (backupFolders.length === 0) {
      logger.dim("(none)");
      return;
    }

    backupFolders.forEach((folder, index) => {
      logger.dim(`${index + 1}. ${folder}`);
    });
  } catch (error) {
    logger.warning("⚠️  Could not list existing backup folders.");
    if (error.stderr) {
      logger.dim(error.stderr);
    }
  }
}

function backupRemoteFile() {
  const timestamp = dayjs().format("YYYYMMDDHHmmss");
  // Extract directory and name from path
  const parentDir = path.dirname(config.remotePath);
  const targetName = path.basename(config.remotePath);

  // Create backup name with timestamp
  const backupName = `${targetName}_${timestamp}`;
  const remoteBackupPath = path.join(parentDir, backupName);

  logger.warning(`💾 Creating backup on remote server...`);

  // Check if target is a file or directory and use appropriate cp command
  let cpCommand;
  try {
    // First check if it's a directory
    execSync(`${getSshPrefix()} "test -d ${shellEscape(config.remotePath)}"`, { stdio: "pipe" });
    // It's a directory, use cp -r
    cpCommand = `${getSshPrefix()} "sudo cp -r ${shellEscape(config.remotePath)} ${shellEscape(remoteBackupPath)}"`;
    logger.cyan(`📁 Backing up directory with cp -r`);
  } catch (error) {
    // It's a file, use regular cp
    cpCommand = `${getSshPrefix()} "sudo cp ${shellEscape(config.remotePath)} ${shellEscape(remoteBackupPath)}"`;
    logger.cyan(`📄 Backing up file with cp`);
  }

  if (!execCommand(cpCommand, "Creating backup copy on remote server")) {
    logger.error(`❌ Backup failed. Could not create backup on remote server.`);
    process.exit(1);
  } else {
    logger.success(`✅ Backup created successfully at: ${remoteBackupPath}`);
    printRemoteBackupFolders(parentDir, targetName);
  }
}

function deleteRemoteBackupByName(backupName) {
  const requestedName = String(backupName || "").trim();
  const parentDir = path.dirname(config.remotePath);
  const targetName = path.basename(config.remotePath);

  if (!requestedName) {
    logger.error("❌ Backup name is required for deletion.");
    process.exit(1);
  }

  if (!requestedName.startsWith(`${targetName}_`)) {
    logger.error(
      `❌ Invalid backup name: ${requestedName}. Expected prefix: ${targetName}_`
    );
    process.exit(1);
  }

  const remoteBackupPath = path.join(parentDir, requestedName);
  const deleteCommand =
    `${getSshPrefix()} "if [ -d ${shellEscape(remoteBackupPath)} ]; then ` +
    `sudo rm -rf ${shellEscape(remoteBackupPath)}; ` +
    `echo DELETED; else echo NOT_FOUND; fi"`;

  try {
    logger.warning(`🗑️  Deleting remote backup folder: ${requestedName}`);
    const result = execSync(deleteCommand, {
      encoding: "utf8",
      stdio: "pipe",
    }).trim();

    if (result.includes("NOT_FOUND")) {
      logger.error(`❌ Backup folder not found: ${remoteBackupPath}`);
      process.exit(1);
    }

    logger.success(`✅ Backup folder deleted: ${remoteBackupPath}`);
    printRemoteBackupFolders(parentDir, targetName);
  } catch (error) {
    logger.error(`❌ Failed to delete backup folder: ${requestedName}`);
    logger.error(error.message);
    if (error.stderr) logger.error(error.stderr);
    process.exit(1);
  }
}

function deployLocalPath(localPath) {
  const sourcePath = normalizeLocalPath(localPath);

  logger.info(`🚀 Deploying from local path: ${sourcePath}`);

  if (!fs.existsSync(sourcePath)) {
    logger.error(`❌ Source path does not exist: ${sourcePath}`);
    process.exit(1);
  }

  const sourceStat = fs.statSync(sourcePath);
  const isDirectory = sourceStat.isDirectory();

  if (isDirectory) {
    const sourceEntries = fs.readdirSync(sourcePath);
    if (sourceEntries.length === 0) {
      logger.error(`❌ Source directory is empty: ${sourcePath}`);
      process.exit(1);
    }

    logger.cyan(`📦 Uploading ${sourceEntries.length} item(s) from: ${sourcePath}`);
  } else {
    logger.cyan(`📄 Uploading file: ${path.basename(sourcePath)}`);
  }

  const ensureRemoteDirCommand = `${getSshPrefix()} "mkdir -p ${shellEscape(config.remotePath)}"`;
  if (!execCommand(ensureRemoteDirCommand, "Ensuring remote directory exists")) {
    logger.error(`❌ Deploy failed. Could not create remote directory.`);
    process.exit(1);
  }

  const localSource = isDirectory ? `${sourcePath}/` : sourcePath;
  const rsyncParts = ["rsync", "-avz"];
  if (config.overwrite) {
    rsyncParts.push("--delete", "--checksum");
  }
  if (config.identityFile) {
    rsyncParts.push("-e", shellEscape(`ssh -i ${config.identityFile}`));
  }
  rsyncParts.push(shellEscape(localSource));
  rsyncParts.push(`${getRemoteTarget()}:${shellEscape(`${config.remotePath}/`)}`);
  const rsyncCommand = rsyncParts.join(" ");

  if (!execCommand(rsyncCommand, `Deploying from ${sourcePath}`)) {
    logger.error(`❌ Deploy failed. Deployment aborted.`);
    process.exit(1);
  }
}

function main() {
  try {
    if (config.deleteBackup) {
      deleteRemoteBackupByName(config.deleteBackup);
      return;
    }

    logger.info("🚀 Starting deployment process...");

    const steps = [];

    // Step 1: Backup (if not skipped)
    if (!config.skipBackup) {
      steps.push({ name: "Backup", func: backupRemoteFile });
    }

    // Step 2: Upload (if not skipped)
    if (!config.skipUpload) {
      steps.push({
        name: "Upload",
        func: () => deployLocalPath(config.localOutPath),
      });
    }

    if (steps.length === 0) {
      logger.warning("⚠️  All steps are skipped. Nothing to do.");
      process.exit(0);
    }

    logger.cyan(
      `\n📋 Deployment plan: ${steps.map((s) => s.name).join(" → ")}`
    );

    // Execute steps in order
    for (const step of steps) {
      logger.cyan(`\n${"=".repeat(50)}`);
      logger.bright(`Step: ${step.name}`);
      logger.cyan(`${"=".repeat(50)}`);
      step.func();
    }

    logger.success(`\n${"=".repeat(50)}`);
    logger.success("🎉 Deployment completed successfully!");
    logger.success(`${"=".repeat(50)}`);

    if (!config.skipBackup) {
      logger.cyan(
        `Backup location: ${config.remoteHost}:${path.dirname(
          config.remotePath
        )}`
      );
    }
    if (!config.skipUpload) {
      logger.cyan(`Deployed to: ${config.remoteHost}:${config.remotePath}`);
    }
  } catch (error) {
    logger.error(`\n❌ Deployment failed with error:`);
    logger.error(error.message);
    process.exit(1);
  }
}

// Run the deployment
main();
