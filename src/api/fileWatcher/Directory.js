import fs from 'fs-extra';
import path from 'path';
import { getThumbnailPath } from '@/utils/thumbnailer';
import { appPaths } from '@/api/appPaths';

export default class Directory {
  constructor(parent, dirPath) {
    this.type = 'directory';
    this._path = dirPath;
    this.contents = [];
    this.parent = parent;

    this.name = path.basename(dirPath);
  }

  get path() {
    return this._path;
  }

  addItem(item) {
    this.contents.push(item);
  }

  deleteItem(itemPath) {
    const index = this.contents.findIndex(item => item.path === itemPath);
    if (index > -1) {
      this.contents[index].clean();
      this.contents.splice(index, 1);
    }
  }

  findItemByPath(itemPath) {
    const relativePath = path.relative(appPaths.notebooks, itemPath);
    const parts = relativePath.split(path.sep);
    return this.findItemByParts(parts);
  }

  findItemByParts([next, ...rest]) {
    if (next === undefined || next === '') return this;

    const nextItem = this.contents.find(
      item => path.basename(item.path) === next,
    );

    if (rest.length === 0) return nextItem;
    return nextItem.findItemByParts(rest);
  }

  clean() {
    this.contents.forEach((item) => {
      item.clean();
    });

    const thumbnailPath = getThumbnailPath(this.path);
    fs.remove(thumbnailPath);
  }
}
