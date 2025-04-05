import { createCanvas } from 'canvas';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a 1280x720 canvas (16:9 aspect ratio for wide screens)
const canvas = createCanvas(1280, 720);
const ctx = canvas.getContext('2d');

// Fill background
ctx.fillStyle = '#0f172a';
ctx.fillRect(0, 0, 1280, 720);

// Draw app header
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 48px Arial';
ctx.textAlign = 'center';
ctx.fillText('Periodic Table Game', 640, 100);

// Draw periodic table grid
const gridSize = 60;
const startX = 240;
const startY = 200;
const elements = [
  { symbol: 'H', x: 0, y: 0 },
  { symbol: 'He', x: 17, y: 0 },
  { symbol: 'Li', x: 0, y: 1 },
  { symbol: 'Be', x: 1, y: 1 },
  { symbol: 'B', x: 12, y: 1 },
  { symbol: 'C', x: 13, y: 1 },
  { symbol: 'N', x: 14, y: 1 },
  { symbol: 'O', x: 15, y: 1 },
  { symbol: 'F', x: 16, y: 1 },
  { symbol: 'Ne', x: 17, y: 1 }
];

// Draw grid
elements.forEach(element => {
  const x = startX + (element.x * gridSize);
  const y = startY + (element.y * gridSize);
  
  // Draw element box
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, gridSize, gridSize);
  
  // Draw element symbol
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(element.symbol, x + gridSize/2, y + gridSize/2);
});

// Create output directory if it doesn't exist
const outputDir = join(__dirname, '../public/screenshots');
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Save the image
const buffer = canvas.toBuffer('image/png');
writeFileSync(join(outputDir, 'wide-screenshot.png'), buffer); 