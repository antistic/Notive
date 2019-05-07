import { appPaths } from '@/api/appPaths';
import makeKritaThumbnail from './krita';
import makeSharpThumbnail from './sharp';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import timers from 'timers';
import util from 'util';

export const getThumbnailPath = (itemPath, isFile = true) => {
  let pathName = path.relative(appPaths.notebooks, itemPath);
  if (isFile) {
    pathName = `${pathName}.png`;
  }

  return path.resolve(appPaths.thumbnails, pathName);
};

export const makeThumbnail = async (
  source,
  destination = this.getThumbnailPath(source),
  timeoutLength = 2000,
) => {
  const ext = path.extname(source);

  const tmpdir = os.tmpdir();
  const tmpPath = path.join(tmpdir, path.basename(source));

  const timeout = util.promisify(timers.setTimeout);

  await timeout(timeoutLength)
    .then(async () => {
      fs.copyFileSync(source, tmpPath);

      switch (ext) {
        case '.kra':
          await makeKritaThumbnail(source, destination);
          break;
        default:
          await makeSharpThumbnail(source, destination);
      }

      fs.unlink(tmpPath);
    });
};
