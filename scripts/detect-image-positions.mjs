/**
 * Precompute subject-aware crop positions for site images.
 *
 * Runs COCO-SSD object detection (same model the old in-browser
 * saliency-detection.js used) over the photo and 3D-design images and writes
 * object-position percentages to data/image_positions.json. Hugo templates
 * read that data file and emit inline object-position styles — no JS ships
 * to the browser.
 *
 * Incremental: images already present in the manifest are skipped, so this
 * is cheap on runs where no new photos were added. Pass --force to redo all.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import sharp from 'sharp';

const ROOT = path.dirname(new URL(import.meta.url).pathname) + '/..';
const MANIFEST = path.join(ROOT, 'data/image_positions.json');
const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const DETECT_WIDTH = 640; // downscale before detection; plenty for COCO-SSD

// section key in the manifest -> directory scanned
const SECTIONS = {
  photos: 'content/photos',
  '3d-designs': 'assets/images/3d-designs',
};

const force = process.argv.includes('--force');

async function listImages(dir) {
  const entries = await readdir(path.join(ROOT, dir));
  return entries.filter((f) => IMAGE_EXT.test(f)).sort();
}

async function loadManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST, 'utf8'));
  } catch {
    return {};
  }
}

async function toTensor(file) {
  const { data, info } = await sharp(file)
    .resize({ width: DETECT_WIDTH, withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return tf.tensor3d(new Uint8Array(data), [info.height, info.width, 3], 'int32');
}

function positionFrom(predictions, width, height) {
  if (predictions.length === 0) return { x: 50, y: 50 };
  const main = predictions.reduce((prev, cur) =>
    cur.bbox[2] * cur.bbox[3] > prev.bbox[2] * prev.bbox[3] ? cur : prev
  );
  const cx = ((main.bbox[0] + main.bbox[2] / 2) / width) * 100;
  const cy = ((main.bbox[1] + main.bbox[3] / 2) / height) * 100;
  const clamp = (v) => Math.round(Math.max(20, Math.min(80, v)) * 10) / 10;
  return { x: clamp(cx), y: clamp(cy) };
}

const manifest = await loadManifest();
const pending = [];
for (const [section, dir] of Object.entries(SECTIONS)) {
  manifest[section] ??= {};
  for (const name of await listImages(dir)) {
    if (!force && manifest[section][name]) continue;
    pending.push({ section, name, file: path.join(ROOT, dir, name) });
  }
}

if (pending.length === 0) {
  console.log('image positions: manifest up to date, nothing to detect');
  process.exit(0);
}

console.log(`image positions: detecting ${pending.length} image(s)…`);
const model = await cocoSsd.load();

for (const { section, name, file } of pending) {
  const tensor = await toTensor(file);
  try {
    const predictions = await model.detect(tensor);
    const [height, width] = tensor.shape;
    const pos = positionFrom(predictions, width, height);
    manifest[section][name] = pos;
    const label = predictions.length
      ? predictions.reduce((p, c) => (c.bbox[2] * c.bbox[3] > p.bbox[2] * p.bbox[3] ? c : p)).class
      : 'none';
    console.log(`  ${section}/${name} -> ${pos.x}% ${pos.y}% (${label})`);
  } finally {
    tensor.dispose();
  }
}

// stable key order so diffs stay readable
const sorted = Object.fromEntries(
  Object.entries(manifest).map(([section, entries]) => [
    section,
    Object.fromEntries(Object.entries(entries).sort(([a], [b]) => a.localeCompare(b))),
  ])
);

await mkdir(path.dirname(MANIFEST), { recursive: true });
await writeFile(MANIFEST, JSON.stringify(sorted, null, 2) + '\n');
console.log(`image positions: wrote ${MANIFEST}`);
