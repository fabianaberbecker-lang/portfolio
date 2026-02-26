/**
 * Generate PWA icons for Streaming Finder.
 * Creates simple PNG icons with a play-button design.
 * Run: node scripts/generate-icons.js
 *
 * Uses only built-in Node.js modules (no canvas dependency).
 * Generates minimal valid PNGs with an embedded SVG-based design.
 */

const fs = require('fs');
const path = require('path');

// Minimal PNG encoder (uncompressed) for simple icon generation
function createPNG(width, height, pixels) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT: raw image data with filter byte per row
  const rawData = [];
  for (let y = 0; y < height; y++) {
    rawData.push(0); // filter: none
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      rawData.push(pixels[idx], pixels[idx + 1], pixels[idx + 2]);
    }
  }

  // Compress with zlib
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(Buffer.from(rawData));

  function makeChunk(type, data) {
    const typeBuffer = Buffer.from(type);
    const length = Buffer.alloc(4);
    length.writeUInt32BE(data.length, 0);
    const combined = Buffer.concat([typeBuffer, data]);
    const crc = require('buffer').Buffer.alloc(4);
    // CRC32 calculation
    let c = 0xFFFFFFFF;
    for (let i = 0; i < combined.length; i++) {
      c ^= combined[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0);
      }
    }
    crc.writeUInt32BE((c ^ 0xFFFFFFFF) >>> 0, 0);
    return Buffer.concat([length, combined, crc]);
  }

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function generateIcon(size, maskable = false) {
  const pixels = new Uint8Array(size * size * 3);

  const bg = [10, 10, 10]; // #0a0a0a
  const accent = [230, 57, 70]; // #e63946 (streaming finder red)
  const white = [255, 255, 255];

  // Fill background
  for (let i = 0; i < size * size; i++) {
    pixels[i * 3] = bg[0];
    pixels[i * 3 + 1] = bg[1];
    pixels[i * 3 + 2] = bg[2];
  }

  const cx = size / 2;
  const cy = size / 2;
  const safeZone = maskable ? 0.35 : 0.4; // maskable needs smaller content

  // Draw accent circle
  const circleR = size * safeZone;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= circleR) {
        const idx = (y * size + x) * 3;
        pixels[idx] = accent[0];
        pixels[idx + 1] = accent[1];
        pixels[idx + 2] = accent[2];
      }
    }
  }

  // Draw play triangle (white)
  const triSize = circleR * 0.55;
  const triCx = cx + triSize * 0.1; // offset slightly right
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x - triCx;
      const py = y - cy;

      // Triangle pointing right: left edge at -triSize*0.5, right at +triSize*0.5
      // Top/bottom edges slope inward
      const left = -triSize * 0.4;
      const right = triSize * 0.5;
      const halfHeight = triSize * 0.55;

      if (px >= left && px <= right) {
        const progress = (px - left) / (right - left);
        const maxY = halfHeight * (1 - progress);
        if (Math.abs(py) <= maxY) {
          const idx = (y * size + x) * 3;
          pixels[idx] = white[0];
          pixels[idx + 1] = white[1];
          pixels[idx + 2] = white[2];
        }
      }
    }
  }

  return createPNG(size, size, pixels);
}

// Generate icons
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
fs.mkdirSync(iconsDir, { recursive: true });

const icons = [
  { name: 'sf-192.png', size: 192, maskable: false },
  { name: 'sf-512.png', size: 512, maskable: false },
  { name: 'sf-maskable-512.png', size: 512, maskable: true },
];

for (const icon of icons) {
  const png = generateIcon(icon.size, icon.maskable);
  const filePath = path.join(iconsDir, icon.name);
  fs.writeFileSync(filePath, png);
  console.log(`Generated ${icon.name} (${icon.size}x${icon.size})`);
}

console.log('Done! Icons saved to public/icons/');
