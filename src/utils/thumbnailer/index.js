import { appPaths } from '@/api/appPaths';
import makeKritaThumbnail from './krita';
import makeSharpThumbnail from './sharp';
import path from 'path';

export const getThumbnailPath = (itemPath, isFile = true) => {
  let pathName = path.relative(appPaths.notebooks, itemPath);
  if (isFile) {
    pathName = `${pathName}.png`;
  }

  return path.resolve(appPaths.thumbnails, pathName);
};

export const makeThumbnail = async (source, destination = this.getThumbnailPath(source)) => {
  const ext = path.extname(source);
  switch (ext) {
    case '.kra':
      await makeKritaThumbnail(source, destination);
      break;
    default:
      await makeSharpThumbnail(source, destination);
  }
};
