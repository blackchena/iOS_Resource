const vscode = require('vscode');

function normalizeAndAlign(input) {
  const lines = input.split(/\r?\n/);

  const rows = lines.map((line) => {
    if (!line.trim()) return null;
    return line.trim().split(/\s+/);
  });

  const maxColumns = rows.reduce((max, row) => (row ? Math.max(max, row.length) : max), 0);
  const widths = new Array(maxColumns).fill(0);

  rows.forEach((row) => {
    if (!row) return;
    row.forEach((cell, index) => {
      if (cell.length > widths[index]) widths[index] = cell.length;
    });
  });

  const aligned = rows.map((row) => {
    if (!row) return '';
    if (row.length === 1) return row[0];

    let out = '';
    for (let i = 0; i < row.length; i += 1) {
      const cell = row[i];
      if (i === row.length - 1) {
        out += cell;
      } else {
        out += cell.padEnd(widths[i] + 2, ' ');
      }
    }
    return out;
  });

  return aligned.join('\n');
}

function activate(context) {
  const disposable = vscode.commands.registerCommand('nginxMapAligner.alignSelection', async () => {
    const editor = vscode.window.activeTextEditor;

    if (!editor) {
      vscode.window.showWarningMessage('No active editor found.');
      return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
      vscode.window.showInformationMessage('Please select text to align.');
      return;
    }

    const selectedText = editor.document.getText(selection);
    const result = normalizeAndAlign(selectedText);

    await editor.edit((editBuilder) => {
      editBuilder.replace(selection, result);
    });
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
