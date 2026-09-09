/**
 * R2 图片上传脚本
 * 用法：
 *   node scripts/r2-upload.js <本地图片路径> --type posts|gallery [--album 相册名]
 *   node scripts/r2-upload.js batch --dir <目录> --type posts|gallery [--album 相册名]
 *
 * 返回：{"cdnUrl": "https://cdn.xxx.com/posts/abc123.webp", "width": 1200, "height": 800}
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createHash } from "node:crypto";
import { readFile, stat, readdir } from "node:fs/promises";
import { extname, basename, resolve } from "node:path";
import sharp from "sharp";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

// ========== 配置区 ==========
const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucket: process.env.R2_BUCKET_NAME,
  publicUrl: process.env.R2_PUBLIC_URL?.replace(/\/+$/, ""), // 去尾部斜杠
};

const SHARP_OPTIONS = {
  webp: { quality: 82, effort: 4 },      // 主输出：WebP
  avif: { quality: 70, effort: 3 },      // 可选：AVIF（更小但编码慢）
  maxWidth: 1920,                         // 长边限制
  maxHeight: 1920,
  thumbnailWidth: 400,                    // 缩略图宽度
};

const VALID_TYPES = ["posts", "gallery"];
// ============================

// 校验环境变量
function checkEnv() {
  const missing = Object.entries(R2_CONFIG).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    console.error(`❌ 缺少环境变量: ${missing.join(", ")}，请检查 .env.local`);
    process.exit(1);
  }
}

// 生成对象键：posts/2024/abc123.webp 或 gallery/album1/abc123.webp
function genObjectKey(type, album, origName, hash) {
  const datePrefix = type === "posts" ? new Date().toISOString().slice(0, 7) + "/" : ""; // 2024-01/
  const albumPrefix = type === "gallery" && album ? `${album}/` : "";
  const ext = ".webp"; // 统一输出 WebP
  return `${type}/${datePrefix}${albumPrefix}${hash}${ext}`;
}

// 计算文件 hash（前 64KB + 文件大小 + 修改时间，够用且极快）
async function fileHash(filePath) {
  const buffer = await readFile(filePath);
  const { size, mtimeMs } = await stat(filePath);
  const hash = createHash("sha256").update(buffer.subarray(0, 64 * 1024)).update(String(size)).update(String(mtimeMs)).digest("hex");
  return hash.slice(0, 16); // 16 字符足够防冲突
}

// 图片压缩 → 返回 {webpBuffer, width, height}
async function optimizeImage(inputPath) {
  const image = sharp(inputPath, { failOnError: false });
  const metadata = await image.metadata();
  const { width, height } = metadata;

  // 超过长边限制则等比缩放
  let pipeline = image;
  if (width > SHARP_OPTIONS.maxWidth || height > SHARP_OPTIONS.maxHeight) {
    pipeline = pipeline.resize({
      width: SHARP_OPTIONS.maxWidth,
      height: SHARP_OPTIONS.maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  const webpBuffer = await pipeline.webp(SHARP_OPTIONS.webp).toBuffer();
  const finalMeta = await sharp(webpBuffer).metadata();

  return { buffer: webpBuffer, width: finalMeta.width, height: finalMeta.height };
}

// 上传到 R2
async function uploadToR2(key, buffer, contentType = "image/webp") {
  const client = new S3Client({
    region: "auto",
    endpoint: `https://${R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_CONFIG.accessKeyId,
      secretAccessKey: R2_CONFIG.secretAccessKey,
    },
  });

  await client.send(new PutObjectCommand({
    Bucket: R2_CONFIG.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000, immutable", // 1 年强缓存
  }));

  return `${R2_CONFIG.publicUrl}/${key}`;
}

// 单文件处理主流程
async function processSingle(filePath, type, album) {
  const hash = await fileHash(filePath);
  const key = genObjectKey(type, album, basename(filePath), hash);
  const { buffer, width, height } = await optimizeImage(filePath);
  const cdnUrl = await uploadToR2(key, buffer);

  return { cdnUrl, width, height, key };
}

// 批量处理
async function processBatch(dir, type, album) {
  const files = (await readdir(dir)).filter(f => /\.(jpe?g|png|webp|avif|gif)$/i.test(f));
  const results = [];
  for (const f of files) {
    try {
      const res = await processSingle(resolve(dir, f), type, album);
      results.push({ original: f, ...res });
      console.log(`✅ ${f} → ${res.cdnUrl}`);
    } catch (e) {
      console.error(`❌ ${f}:`, e.message);
    }
  }
  return results;
}

// ========== CLI 入口 ==========
async function main() {
  checkEnv();
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
用法:
  单文件: node scripts/r2-upload.js <图片路径> --type posts|gallery [--album 相册名]
  批量:   node scripts/r2-upload.js batch --dir <目录> --type posts|gallery [--album 相册名]
示例:
  node scripts/r2-upload.js ./photo.jpg --type posts
  node scripts/r2-upload.js ./cover.png --type gallery --album japan-trip
  node scripts/r2-upload.js batch --dir ./assets --type posts
`);
    process.exit(0);
  }

  const isBatch = args[0] === "batch";
  let type = "posts";
  let album = "";

  // 解析 --type --album --dir
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--type") type = args[++i];
    if (args[i] === "--album") album = args[++i];
  }
  if (!VALID_TYPES.includes(type)) {
    console.error(`❌ --type 必须是 ${VALID_TYPES.join("|")}`);
    process.exit(1);
  }

  try {
    if (isBatch) {
      const dirIdx = args.indexOf("--dir");
      if (dirIdx === -1) throw new Error("batch 模式需 --dir <目录>");
      const dir = resolve(args[dirIdx + 1]);
      await processBatch(dir, type, album);
    } else {
      const filePath = resolve(args[0]);
      const res = await processSingle(filePath, type, album);
      // 只输出 JSON，供 Obsidian 插件捕获
      console.log(JSON.stringify(res));
    }
  } catch (e) {
    console.error("❌ 上传失败:", e.message);
    process.exit(1);
  }
}

main();