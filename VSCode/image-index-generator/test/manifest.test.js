const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('declares the explorer folder command', () => {
  const manifest = JSON.parse(readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));

  assert.deepEqual(manifest.contributes.commands, [{
    command: 'imageIndexGenerator.generate',
    title: '生成图片索引',
  }]);
  assert.deepEqual(manifest.contributes.menus['explorer/context'], [{
    command: 'imageIndexGenerator.generate',
    when: 'resourceScheme == file && explorerResourceIsFolder',
  }]);
});
