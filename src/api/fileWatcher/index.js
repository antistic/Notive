import File from './File';
import Directory from './Directory';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { appPaths } from '@/api/appPaths';
import store from '@/api/store';

/* ----- helper methods */

function addToFileTree(itemType, itemPath, fileId) {
  const parentItem = store.state.fileTree.findItemByPath(path.dirname(itemPath));

  let item;
  switch (itemType) {
    case 'file':
      item = new File(parentItem, itemPath, fileId);
      break;
    case 'directory':
      item = new Directory(parentItem, itemPath);
      break;
    default:
      throw new Error('Found neither file nor directory');
  }

  parentItem.addItem(item);
  return item;
}

function deleteFromFileTree(itemPath) {
  const parentItem = store.state.fileTree.findItemByPath(path.dirname(itemPath));
  if (parentItem) parentItem.deleteItem(itemPath);
}

/* ----- watcher methods */

const onAdd = (filePath) => {
  addToFileTree('file', filePath);
};

const onAddDir = (dirPath) => {
  if (dirPath !== appPaths.notebooks) {
    addToFileTree('directory', dirPath);
  }
};

const onChange = (filePath) => {
  const file = store.state.fileTree.findItemByPath(filePath);
  file.makeThumbnail(true);
};

const onUnlink = (filePath) => {
  deleteFromFileTree(filePath);
};

const onUnlinkDir = (dirPath) => {
  deleteFromFileTree(dirPath);
};

export default {
  async setup() {
    await Promise.all(Object.values(appPaths).map(
      appPath => fs.ensureDir(appPath),
    ));

    store.state.fileTree = new Directory(null, appPaths.notebooks);

    await new Promise((resolve, _) => {
      const watcher = chokidar.watch(appPaths.notebooks, {
        ignored: [/\.kra~$/],
        persistent: true,
      });

      watcher
        .on('add', onAdd)
        .on('addDir', onAddDir)
        .on('change', onChange)
        .on('unlink', onUnlink)
        .on('unlinkDir', onUnlinkDir)
        .on('ready', resolve)
        .on('error', (error) => {
          // Ignore EPERM errors in windows, which happen if you delete watched folders
          // https://github.com/paulmillr/chokidar/issues/566
          if (error.code === 'EPERM' && os.platform() === 'win32') {
            // pass
          }
        });
    });
  },
};
