const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

const tmpFile = process.argv[2];
if (!tmpFile) {
  console.error("Usage: node process-instagram.js <json-file>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(tmpFile, "utf-8"));
const posts = data.data || [];

console.log("Found " + posts.length + " posts");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          download(res.headers.location, dest).then(resolve).catch(reject);
          return;
        }
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      })
      .on("error", (err) => {
        fs.unlink(dest, () => {});
        reject(err);
      });
  });
}

async function main() {
  const cachedPosts = [];

  for (const post of posts) {
    const id = post.id;
    let localImage = null;
    let localThumbnail = null;

    // Download main image for IMAGE and CAROUSEL_ALBUM
    if (post.media_type !== "VIDEO" && post.media_url) {
      const filename = id + ".jpg";
      try {
        await download(
          post.media_url,
          path.join("public/instagram", filename)
        );
        localImage = "/instagram/" + filename;
        console.log("  Downloaded image: " + filename);
      } catch (e) {
        console.log("  Failed to download image for " + id + ": " + e.message);
      }
    }

    // Download thumbnail for VIDEO
    if (post.media_type === "VIDEO" && post.thumbnail_url) {
      const filename = id + "_thumb.jpg";
      try {
        await download(
          post.thumbnail_url,
          path.join("public/instagram", filename)
        );
        localThumbnail = "/instagram/" + filename;
        console.log("  Downloaded thumbnail: " + filename);
      } catch (e) {
        console.log(
          "  Failed to download thumbnail for " + id + ": " + e.message
        );
      }
    }

    cachedPosts.push({
      id: post.id,
      caption: post.caption || "",
      media_type: post.media_type,
      media_url: localImage || post.media_url,
      thumbnail_url: localThumbnail || post.thumbnail_url || null,
      permalink: post.permalink,
      timestamp: post.timestamp,
      like_count: post.like_count || 0,
      comments_count: post.comments_count || 0,
    });
  }

  // Write cached data
  const outPath = path.join("src/data", "instagram-cache.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      { posts: cachedPosts, updated: new Date().toISOString() },
      null,
      2
    )
  );
  console.log("\nSaved " + cachedPosts.length + " posts to " + outPath);
  console.log("Done! The site will now use cached Instagram data.");
}

main().catch(console.error);
