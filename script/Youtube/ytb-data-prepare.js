const { exec } = require("child_process");
const fs = require("fs");
const fsp = require("fs/promises");
const path = require("path");
const { Command } = require("commander");

const YOUTUBE_ID_REGEX = /^[a-zA-Z0-9_-]{11}$/;

function shellEscape(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
        return;
      }
      resolve({ stdout, stderr });
    });
  });
}

function parseMetadataFromStdout(stdout) {
  const jsonLine = stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .pop();

  if (!jsonLine) {
    throw new Error("No metadata JSON returned by yt-dlp");
  }

  try {
    return JSON.parse(jsonLine);
  } catch (parseError) {
    throw new Error(`Failed to parse metadata JSON: ${parseError.message}`);
  }
}

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

// Download thumbnail and fetch metadata (including title) in a single yt-dlp call
function downloadThumbnailAndMetadata(video, index, thumbnailsDir, ytDlpOptions) {
  return new Promise((resolve, reject) => {
    const videoId = extractVideoId(video);
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    const thumbnailPath = path.join(thumbnailsDir, `video_${videoId}.jpg`);
    const args = [
      "--ignore-config",
      "--skip-download",
      "--print-json",
      "--no-update",
    ];

    if (ytDlpOptions.cookiesFromBrowser) {
      args.push("--cookies-from-browser", ytDlpOptions.cookiesFromBrowser);
    }
    if (ytDlpOptions.cookies) {
      args.push("--cookies", ytDlpOptions.cookies);
    }
    if (ytDlpOptions.jsRuntimes) {
      args.push("--js-runtimes", ytDlpOptions.jsRuntimes);
    }

    args.push(video);

    const command = `python3 -m yt_dlp ${args.map(shellEscape).join(" ")}`;

    console.log(`Downloading thumbnail for video ${index + 1}: ${video}`);
    console.log(`Command: ${command}`);

    downloadFile(thumbnailUrl, thumbnailPath)
      .then(() => runCommand(command))
      .then(({ stdout, stderr }) => {
        if (stderr) {
          console.log(`Info for video ${index + 1}:`, stderr);
        }
        const metadata = parseMetadataFromStdout(stdout);
        console.log(`✅ Successfully downloaded thumbnail for video ${index + 1}`);
        resolve(metadata);
      })
      .catch(async (error) => {
        const errorText = `${error.message}\n${error.stderr || ""}`;
        if (
          errorText.includes("Sign in to confirm your age") ||
          errorText.includes("This video may be inappropriate for some users")
        ) {
          reject(
            new Error(
              "Age-restricted video. Please provide authentication with --cookies-from-browser <browser> or --cookies <cookies.txt>.",
            ),
          );
          return;
        }

        if (errorText.includes("Requested format is not available")) {
          try {
            console.log(
              `Retrying video ${index + 1} metadata with oEmbed fallback...`,
            );
            const metadata = await fetchMetadataByOEmbed(video);
            console.log(
              `✅ Successfully downloaded thumbnail for video ${index + 1} (retry)`,
            );
            resolve(metadata);
            return;
          } catch (retryError) {
            reject(
              new Error(
                `Requested format is not available even after retry. ${retryError.message}`,
              ),
            );
            return;
          }
        }

        console.error(
          `Error downloading thumbnail for video ${index + 1}:`,
          error.message,
        );
        reject(error);
      });
  });
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
    .option(
      "--cookies-from-browser <browser>",
      "Pass browser cookies to yt-dlp (e.g. chrome, safari, edge, firefox)",
    )
    .option(
      "--cookies <path>",
      "Path to cookies.txt file for yt-dlp authentication",
    )
    .option(
      "--js-runtimes <value>",
      "JS runtimes passed to yt-dlp, e.g. node or deno:/path/to/deno",
      "node",
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
    ytDlpOptions: {
      cookiesFromBrowser: options.cookiesFromBrowser || "",
      cookies: options.cookies ? path.resolve(options.cookies) : "",
      jsRuntimes: options.jsRuntimes || "node",
    },
  };
}

// Main function to download all thumbnails
async function downloadAllThumbnails(videos, outputDir, ytDlpOptions) {
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
      const metadata = await downloadThumbnailAndMetadata(
        url,
        i,
        thumbnailsDir,
        ytDlpOptions,
      );
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

// Check if yt-dlp is available
function checkYtDlp() {
  return new Promise((resolve) => {
    exec("python3 -m yt_dlp --version", (error) => {
      if (error) {
        console.error("❌ yt-dlp is not installed or not accessible.");
        console.error("Please install it using: pip install yt-dlp");
        resolve(false);
      } else {
        console.log("✅ yt-dlp is available");
        resolve(true);
      }
    });
  });
}

// Run the script
async function main() {
  const { videos, outputDir, ytDlpOptions } = parseArgs();

  console.log("YouTube Thumbnail Downloader");
  console.log("============================");

  const isYtDlpAvailable = await checkYtDlp();
  if (!isYtDlpAvailable) {
    process.exit(1);
  }

  try {
    await downloadAllThumbnails(videos, outputDir, ytDlpOptions);
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
