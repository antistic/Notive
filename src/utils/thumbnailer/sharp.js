import sharp from 'sharp';

export default (source, destination) => sharp(source, { density: 600 })
  .resize(250, 250, { fit: 'inside' })
  .png()
  .toFile(destination);
