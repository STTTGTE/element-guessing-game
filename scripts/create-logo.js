import { createCanvas } from 'canvas';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a 512x512 canvas (largest size we need)
const canvas = createCanvas(512, 512);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 512, 512);

// Draw atomic symbol style text
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 200px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('Pt', 256, 256);

// Draw atomic number
ctx.font = 'bold 80px Arial';
ctx.fillText('78', 120, 160);

// Create output directory if it doesn't exist
const outputDir = join(__dirname, '../src/assets');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Save the image
const buffer = canvas.toBuffer('image/png');
writeFileSync(join(outputDir, 'logo.png'), buffer); 