const vscode = require('vscode');
const path = require('node:path');
const { readImageDimensions } = require('./src/image-dimensions');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg']);

function activate(context) {
  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 1000);
  status.name = 'Image Resolution';
  status.tooltip = '当前图片分辨率';
  context.subscriptions.push(status);

  let refreshToken = 0;
  const refresh = async () => {
    const token = ++refreshToken;
    const uri = getActiveImageUri();
    if (!uri) {
      status.hide();
      return;
    }

    try {
      const buffer = Buffer.from(await vscode.workspace.fs.readFile(uri));
      const dimensions = readImageDimensions(buffer, uri.path);
      if (token !== refreshToken || !dimensions) {
        if (token === refreshToken) status.hide();
        return;
      }
      status.text = `$(file-media) ${formatNumber(dimensions.width)} × ${formatNumber(dimensions.height)}`;
      status.tooltip = `${uri.fsPath || uri.path}\n${dimensions.width} × ${dimensions.height}`;
      status.show();
    } catch {
      if (token === refreshToken) status.hide();
    }
  };

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(refresh),
    vscode.window.tabGroups.onDidChangeTabs(refresh),
    vscode.window.tabGroups.onDidChangeTabGroups(refresh),
  );
  refresh();
}

function getActiveImageUri() {
  const activeTab = vscode.window.tabGroups.activeTabGroup.activeTab;
  const tabUri = activeTab && activeTab.input && activeTab.input.uri;
  if (tabUri && isImageUri(tabUri)) return tabUri;

  const editorUri = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri;
  return editorUri && isImageUri(editorUri) ? editorUri : undefined;
}

function isImageUri(uri) {
  return uri.scheme === 'file' && IMAGE_EXTENSIONS.has(path.extname(uri.path).toLowerCase());
}

function formatNumber(value) {
  return Number(value).toLocaleString('en-US');
}

function deactivate() {}

module.exports = { activate, deactivate, formatNumber, getActiveImageUri, isImageUri };
