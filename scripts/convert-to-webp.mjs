#!/usr/bin/env node
/**
 * Convert all JPG/PNG images in frontend/public/images/ to WebP format.
 * Keeps originals as backup. Run from project root.
 */
import sharp from 'sharp';
import { readdir, stat, mkdir } from 'fs/promises';
import { join, extname, dirname } from 'path';

const IMG_DIR = 'public/images';
const QUALITY = 82; // Good balance of quality vs size

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFiles(fullPath));
    } else if (/\.(jpg|jpeg|png)$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function convert() {
  const files = await getFiles(IMG_DIR);
  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of files) {
    const ext = extname(file);
    const webpPath = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const before = (await stat(file)).size;
    totalBefore += before;

    // Skip tiny files (logos etc under 5KB)
    if (before < 5000) {
      console.log(`SKIP ${file} (${(before / 1024).toFixed(1)}KB - too small)`);
      continue;
    }

    const isPng = ext.toLowerCase() === '.png';

    if (isPng) {
      await sharp(file).webp({ quality: QUALITY, lossless: false }).toFile(webpPath);
    } else {
      await sharp(file).webp({ quality: QUALITY }).toFile(webpPath);
    }

    const after = (await stat(webpPath)).size;
    totalAfter += after;
    const savings = ((1 - after / before) * 100).toFixed(1);
    console.log(`${file} → ${webpPath} (${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB, -${savings}%)`);
  }

  console.log(`\nTotal: ${(totalBefore / 1024 / 1024).toFixed(2)}MB → ${(totalAfter / 1024 / 1024).toFixed(2)}MB (-${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);
}

convert().catch(console.error);
