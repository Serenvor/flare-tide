/**
 * 修复 @url: 格式的图片链接
 * 用法：node scripts/fix-url-format.js [目录]
 * 默认处理 D:/obsidian-writing/posts/
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const POSTS_DIR = process.argv[2] || "D:/obsidian-writing/posts";

// 匹配 @url:`...` 格式的链接
// ![alt](@url:`https://...`)  →  ![alt](https://...)
const PATTERN = /(!\[[^\]]*\]\()@url:`([^`]+)`/g;

let fixedCount = 0;
let fileCount = 0;

function processDir(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (extname(entry) === ".md") {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  const content = readFileSync(filePath, "utf-8");
  if (!content.includes("@url:")) return;

  const fixed = content.replace(PATTERN, "$1$2");
  if (fixed !== content) {
    writeFileSync(filePath, fixed, "utf-8");
    fixedCount++;
    console.log(`✅ 已修复：${filePath}`);
  }
  fileCount++;
}

console.log(`扫描目录：${POSTS_DIR}\n`);
processDir(POSTS_DIR);
console.log(`\n扫描 ${fileCount} 篇笔记，修复 ${fixedCount} 篇`);
