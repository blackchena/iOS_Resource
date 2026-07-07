const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { Command } = require("commander");

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function fetchJson(url) {
  return fetch(url).then(async (response) => {
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response.json();
  });
}

function downloadFile(url, filePath) {
  return fetch(url)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`);
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      await fsp.writeFile(filePath, buffer);
      return filePath;
    })
    .catch(async (error) => {
      try {
        await fsp.unlink(filePath);
      } catch (_unlinkError) {
        // ignore cleanup errors
      }
      throw error;
    });
}

async function fetchMetadataByOEmbed(video) {
  const oembedUrl =
    "https://www.youtube.com/oembed?url=" +
    encodeURIComponent(video) +
    "&format=json";
  const oembed = await fetchJson(oembedUrl);
  return {
    title: oembed.title || "",
  };
}

async function downloadThumbnailAndMetadata(video, index, thumbnailsDir) {
  const videoId = extractVideoId(video);
  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const thumbnailPath = path.join(thumbnailsDir, `video_${videoId}.jpg`);

  console.log(`Downloading thumbnail for video ${index + 1}: ${video}`);
  console.log(`Thumbnail URL: ${thumbnailUrl}`);

  await downloadFile(thumbnailUrl, thumbnailPath);
  const metadata = await fetchMetadataByOEmbed(video);

  console.log(`✅ Successfully processed video ${index + 1}`);
  return metadata;
}

// Function to extract video ID from YouTube URL or raw ID
function extractVideoId(input) {
  if (!input) {
    return "unknown";
  }

  const value = input.trim();
  if (YOUTUBE_ID_REGEX.test(value)) {
    return value;
  }

  try {
    const parsedUrl = new URL(value);
    const host = parsedUrl.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const shortId = parsedUrl.pathname.split("/").filter(Boolean)[0];
      return YOUTUBE_ID_REGEX.test(shortId) ? shortId : "unknown";
    }

    if (host.endsWith("youtube.com")) {
      const queryVideoId = parsedUrl.searchParams.get("v");
      if (YOUTUBE_ID_REGEX.test(queryVideoId || "")) {
        return queryVideoId;
      }

      const parts = parsedUrl.pathname.split("/").filter(Boolean);
      const embeddedId = parts.length > 1 ? parts[1] : "";
      if (
        (parts[0] === "shorts" || parts[0] === "embed") &&
        YOUTUBE_ID_REGEX.test(embeddedId)
      ) {
        return embeddedId;
      }
    }
  } catch (error) {
    return "unknown";
  }

  return "unknown";
}

function normalizeVideoInput(input) {
  const id = extractVideoId(input);
  if (id === "unknown") {
    return null;
  }

  return {
    id,
    url: `https://www.youtube.com/watch?v=${id}`,
  };
}

function collectVideos(value, previous) {
  const chunks = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return previous.concat(chunks);
}

function parseArgs() {
  const program = new Command();
  program
    .name("ytb-data-prepare")
    .description("Download YouTube thumbnails and generate metadata JSON")
    .requiredOption(
      "-v, --video <value>",
      "YouTube video URL or video ID. Repeat option or use comma-separated values.",
      collectVideos,
      [],
    )
    .option(
      "-o, --output <dir>",
      "Output directory (default: current working directory)",
      process.cwd(),
    )
    .showHelpAfterError();

  program.parse(process.argv);
  const options = program.opts();

  const normalizedVideos = Array.from(
    new Map(
      options.video
        .map((item) => normalizeVideoInput(item))
        .filter(Boolean)
        .map((item) => [item.id, item]),
    ).values(),
  );

  if (normalizedVideos.length === 0) {
    program.error("No valid YouTube video URL/ID provided.");
  }

  return {
    videos: normalizedVideos,
    outputDir: path.resolve(options.output),
  };
}

// Main function to download all thumbnails
async function downloadAllThumbnails(videos, outputDir) {
  const thumbnailsDir = path.join(outputDir, "thumbnails");
  fs.mkdirSync(thumbnailsDir, { recursive: true });

  console.log(`Starting to download ${videos.length} thumbnails...`);
  console.log(`Output directory: ${thumbnailsDir}`);
  console.log("---");

  const results = [];
  const outputData = [];

  for (let i = 0; i < videos.length; i++) {
    const { url, id } = videos[i];

    try {
      const metadata = await downloadThumbnailAndMetadata(url, i, thumbnailsDir);
      const title = metadata?.title?.trim();
      if (!title) {
        throw new Error("Title is empty");
      }

      outputData.push({
        coverImg: `/assets/app-video/thumbnails/video_${id}.jpg`,
        appCoverImg: `/assets/app-video/thumbnails/video_${id}.jpg`,
        bannerImg: "",
        bannerMobileImg: "",
        title,
        description: title,
        url,
        id,
      });

      results.push({ index: i, success: true, url });
    } catch (error) {
      results.push({
        index: i,
        success: false,
        url,
        error: error.message,
      });
    }

    // Add a small delay between downloads to be respectful to the server
    if (i < videos.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log("\n--- Download Summary ---");
  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`✅ Successful: ${successful}`);
  console.log(`❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log("\nFailed downloads:");
    results
      .filter((r) => !r.success)
      .forEach((r) => {
        console.log(`- Video ${r.index + 1}: ${r.url}`);
        console.log(`  Error: ${r.error}`);
      });
  }

  console.log(`\nThumbnails saved to: ${thumbnailsDir}`);

  const outputPath = path.join(thumbnailsDir, "video-list.json");
  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2), "utf-8");
  console.log(`Metadata JSON saved to: ${outputPath}`);
}

// Run the script
async function main() {
  const { videos, outputDir } = parseArgs();

  console.log("YouTube Thumbnail Downloader");
  console.log("============================");

  try {
    await downloadAllThumbnails(videos, outputDir);
  } catch (error) {
    console.error("Script failed:", error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Run the main function
main();
