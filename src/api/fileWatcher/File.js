import fs from 'fs-extra';
import path from 'path';
import makeThumbnail from '@/utils/thumbnailer';
import database from '@/api/database';
import appPaths from '@/api/appPaths';

export default class File {
  constructor(parent, relativePath, fileId) {
    this.type = 'file';

    this.parent = parent;

    this.path = path.join(path.basename(appPaths.notebooks), relativePath);
    this.name = path.basename(relativePath);

    this.id = fileId;

    this.metadata = [];
    this.getAttributes();

    this._fullPath = path.join(appPaths.notebooks, relativePath);
    this._fullThumbnailPath = `${path.join(appPaths.thumbnails, relativePath)}.png`;
    this._thumbnailPath = `${path.join(path.basename(appPaths.thumbnails), relativePath)}.png`;
    this.thumbnailPath = this._thumbnailPath;
    this.makeThumbnail();
  }

  async getAttributes() {
    this.metadata = await database.getFileAttributes(this.id);
  }

  async addAttribute(name, data) {
    await database.addFileAttributeData(this.id, name, data);
    await this.getAttributes();
  }

  async editAttribute(name, data) {
    await database.editFileAttributeData(this.id, name, data);
    await this.getAttributes();
  }

  makeThumbnail(force = false) {
    fs.pathExists(this._fullThumbnailPath).then((exists) => {
      if (force || !exists) {
        fs.ensureDir(path.dirname(this._fullThumbnailPath))
          .then(() => makeThumbnail(this._fullPath, this._fullThumbnailPath))
          .then(() => {
            // add current time to force url to change
            this.thumbnailPath = `${this._thumbnailPath}?m=${new Date().getTime()}`;
          });
      }
    });
  }

  clean() {
    fs.remove(this._fullThumbnailPath);
  }
}
