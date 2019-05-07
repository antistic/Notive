import fs from 'fs-extra';
import path from 'path';
import { getThumbnailPath, makeThumbnail } from '@/utils/thumbnailer';
import store from '@/api/store';

export default class File {
  constructor(parent, filePath, fileId) {
    this.type = 'file';
    this.path = filePath;
    this.id = fileId;
    this.parent = parent;
    this.thumbnailPath = getThumbnailPath(this.path);

    this.name = path.basename(filePath);
    this.makeThumbnail();
  }

  get metadata() {
    if (this._data === undefined) {
      this._data = store.db.getAttributes(this.id);
    }

    return this._data;
  }

  makeThumbnail(force = false) {
    fs.pathExists(this.thumbnailPath).then((exists) => {
      if (force || !exists) {
        const outputPath = getThumbnailPath(this.path);
        fs.ensureDir(path.dirname(outputPath))
          .then(() => makeThumbnail(this.path, outputPath))
          .then(() => {
            // add current time to force url to change
            this.thumbnailPath = `${outputPath}?m=${new Date().getTime()}`;
          });
      }
    });
  }

  clean() {
    fs.remove(this.thumbnailPath);
  }
}
