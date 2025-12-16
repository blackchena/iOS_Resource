const fs = require("fs");
const path = require("path");
const { SourceMapConsumer } = require("source-map");
const { Command } = require("commander");

const program = new Command();

async function readOriginalSource(mapFilePath) {
  if (!fs.existsSync(mapFilePath)) {
    throw new Error(`Source map file not found: ${mapFilePath}`);
  }

  const sourceMapContent = fs.readFileSync(mapFilePath, "utf-8");
  const sourceMap = JSON.parse(sourceMapContent);

  const consumer = await new SourceMapConsumer(sourceMap);

  const sources = {};
  sourceMap.sources.forEach((source) => {
    sources[source] = consumer.sourceContentFor(source);
  });
  return sources;
}

program
  .name("blasourcemap")
  .description("Extract original sources from JavaScript source map files")
  .version("1.0.0")
  .requiredOption("-m, --map <path>", "Path to the .js.map source map file")
  .option("-o, --output <directory>", "Output directory for extracted sources", "./output")
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    const mapFilePath = path.resolve(options.map);
    const outputDir = path.resolve(options.output);

    console.log(`Reading source map from: ${mapFilePath}`);
    console.log(`Output directory: ${outputDir}`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`Created output directory: ${outputDir}`);
    }

    const sources = await readOriginalSource(mapFilePath);
    console.log(`Found ${Object.keys(sources).length} source files`);

    Object.keys(sources).forEach((sourcePath) => {
      const fileName = sourcePath.split("/").pop();
      const outputPath = path.join(outputDir, fileName);
      fs.writeFileSync(outputPath, sources[sourcePath]);
      console.log(`Written: ${outputPath}`);
    });

    console.log("Extraction completed successfully!");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
