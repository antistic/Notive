import fs from 'fs-extra';
import path from 'path';
import { getThumbnailPath, makeThumbnail } from '@/utils/thumbnailer';
import database from '@/api/database';

export default class File {
  constructor(parent, filePath, fileId) {
    this.type = 'file';

    this.parent = parent;

    this.path = filePath;
    this.name = path.basename(filePath);

    this.id = fileId;

    this.metadata = [];
    this.getAttributes();

    this.thumbnailPath = getThumbnailPath(this.path);
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
