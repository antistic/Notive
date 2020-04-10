import Item from './Item';
import makeThumbnail from '@/utils/thumbnailer';
import database from '@/api/database';
import appPaths from '@/api/appPaths';
import fs from 'fs-extra';
import path from 'path';

export default class File extends Item {
  constructor(relativePath, fileId) {
    super(relativePath);

    this.type = 'file';
    this.id = fileId;

    this.metadata = [];

    this._thumbnailPath = `${path.join(path.basename(appPaths.thumbnails), relativePath)}.png`;
    this.thumbnailPath = this._thumbnailPath;
  }

  _clean() {
    fs.remove(this._getFullThumbnailPath());
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

  async deleteAttribute(name) {
    await database.deleteFileAttributeData(this.id, name);
    await this.getAttributes();
  }

  async makeThumbnail(force = false) {
    const exists = await fs.pathExists(this._fullThumbnailPath);

    if (force || !exists) {
      const fullPath = path.join(appPaths.notebooks, this._relativePath);
      const fullThumbnailPath = this._getFullThumbnailPath();

      await fs.ensureDir(path.dirname(fullThumbnailPath));
      await makeThumbnail(fullPath, fullThumbnailPath);
      // add current time to force url to change
      this.thumbnailPath = `${this._thumbnailPath}?m=${Date.now()}`;
    }
  }

  _getFullThumbnailPath() {
    return `${path.join(appPaths.thumbnails, this._relativePath)}.png`;
  }
}
