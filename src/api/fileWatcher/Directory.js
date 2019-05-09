import fs from 'fs-extra';
import path from 'path';
import appPaths from '@/api/appPaths';

export default class Directory {
  constructor(parent, relativePath) {
    this.type = 'directory';
    this.path = path.join(path.basename(appPaths.notebooks), relativePath);
    this.contents = [];
    this.parent = parent;

    this.name = path.basename(relativePath);
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

  findItemByPath(relativePath) {
    const parts = relativePath.split(path.sep);
    return this.findItemByParts(parts);
  }

  findItemByParts([next, ...rest]) {
    if (next === undefined || next === '.' || next === '') return this;

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

    const thumbnailPath = path.join(appPaths.thumbnails, this.path);
    fs.remove(thumbnailPath);
  }
}
