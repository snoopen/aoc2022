import * as fs from 'node:fs';
import { createCanvas } from 'canvas';

export function drawVisited(visited, limits) {
  const vis = Object.values(visited);

  const border = 10;
  const xOffset = - limits.xMin;
  const yOffset = - limits.yMin;
  const xSize = (limits.xMax - xOffset) - (limits.xMin - xOffset);
  const ySize = (limits.yMax - yOffset) - (limits.yMin - yOffset);
  const width = xSize + border * 2;
  const height = ySize + border * 2;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(255,255,255,1)';
  ctx.fillRect(0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);

  vis.forEach(e=>{
    const x = e.x + xOffset + border;
    const y = e.y + yOffset + border;
    for (let i = 0; i < 3; i++) {
      imageData.data[y * (imageData.width * 4) + x * 4 + i] = 0;
    }
  });

  ctx.putImageData(imageData, 0, 0);

  const out = fs.createWriteStream('./src/day09/image.png');
  const stream = canvas.createPNGStream();

  stream.pipe(out);
  out.on('finish', () =>  console.log('The PNG file was created.'));
}
