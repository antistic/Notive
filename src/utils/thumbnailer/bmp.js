import { decode } from '@vingle/bmp-js';
import sharp from 'sharp';
import fs from 'fs-extra';

export default async (source, destination) => {
  const buf = fs.readFileSync(source);
  const bitmap = decode(buf, true);

  await sharp(bitmap.data, {
    raw: {
      width: bitmap.width,
      height: bitmap.height,
      channels: 4,
    },
  })
    .resize(250, 250, { fit: 'inside' })
    .png()
    .toFile(destination);
};
