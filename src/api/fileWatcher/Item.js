import appPaths from '@/api/appPaths';
import path from 'path';

export default class Item {
  constructor(relativePath) {
    this.parent = null;

    this._relativePath = relativePath;
    this.path = path.join(path.basename(appPaths.notebooks), relativePath);
    this.fullPath = path.join(appPaths.notebooks, relativePath);
    this.name = path.basename(relativePath);
  }

  setParent(parent) {
    this.parent = parent;
  }

  delete() {
    this.parent._deleteChild(this);
  }
}
