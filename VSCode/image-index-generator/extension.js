const vscode = require('vscode');
const { generateImageIndex } = require('./src/generate-image-index');

function activate(context) {
  const command = vscode.commands.registerCommand(
    'imageIndexGenerator.generate',
    async (resource) => {
      if (!resource || resource.scheme !== 'file') return;

      try {
        const { outputPath, imageCount } = await generateImageIndex(resource.fsPath);
        const document = await vscode.workspace.openTextDocument(vscode.Uri.file(outputPath));
        await vscode.window.showTextDocument(document);
        vscode.window.showInformationMessage(`已生成 ${imageCount} 个图片的索引：${outputPath}`);
      } catch (error) {
        vscode.window.showErrorMessage(`图片索引生成失败：${error.message}`);
      }
    },
  );

  context.subscriptions.push(command);
}

function deactivate() {}

module.exports = { activate, deactivate };
