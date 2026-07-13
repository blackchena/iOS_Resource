const path = require('node:path');
const { writeFile } = require('node:fs/promises');

const generatorModulePath = path.resolve(
  __dirname,
  './vendor/img-index-generate.js',
);

async function loadGenerator() {
  return import(generatorModulePath);
}

async function generateImageIndex(folderPath, dependencies = {}) {
  const generator = await (dependencies.loadGenerator || loadGenerator)();
  const files = generator.collectImageFiles(folderPath);
  const outputPath = path.join(folderPath, 'index.js');
  const output = generator.renderImageIndex(files);

  await (dependencies.writeFile || writeFile)(outputPath, output, 'utf8');

  return { outputPath, imageCount: files.length };
}

module.exports = { generateImageIndex };
