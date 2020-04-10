import Item from './Item';
import File from './File';
import appPaths from '@/api/appPaths';
import fs from 'fs-extra';
import path from 'path';

export default class Directory extends Item {
  constructor(relativePath) {
    super(relativePath);

    this.type = 'directory';
    this.contents = [];
  }

  _clean() {
    const thumbnailPath = path.join(appPaths.thumbnails, this._relativePath);
    fs.remove(thumbnailPath);
  }

  _addChild(item) {
    this.contents.push(item);
  }

  addFile(relativePath, fileId) {
    const item = new File(relativePath, fileId);
    this._addItem(item);
    return item;
  }

  addDirectory(relativePath) {
    const item = new Directory(relativePath);
    this._addItem(item);
    return item;
  }

  _addItem(item) {
    const parentPath = path.dirname(item._relativePath);
    const parentItem = this.findChildPath(parentPath);
    parentItem._addChild(item);
    item.setParent(parentItem);
  }

  _deleteChild(item) {
    const index = this.contents.findIndex(
      (child) => child.path === item.path,
    );
    if (index > -1) {
      this.contents[index]._clean();
      this.contents.splice(index, 1);
    }
  }

  deleteChildPath(relativePath) {
    const item = this.findChildPath(relativePath);
    if (item) {
      item.delete();
    }
  }

  findChildPath(relativePath) {
    const parts = relativePath.split(path.sep);
    return this._findItemByParts(parts);
  }

  _findItemByParts([next, ...rest]) {
    if (next === '.') return this;

    const nextItem = this.contents.find(
      (item) => item.name === next,
    );

    if (rest.length === 0) return nextItem;
    return nextItem._findItemByParts(rest);
  }
}
