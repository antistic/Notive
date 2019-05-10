import Directory from './Directory';
import chokidar from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import appPaths from '@/api/appPaths';
import database from '@/api/database';
import store from '@/api/store';
import { isSupportedExtension } from '@/utils/extensions';

/* ----- watcher methods */

const onAdd = (filePath, stats) => {
  if (!isSupportedExtension(path.extname(filePath))) return;

  const relativePath = path.relative(appPaths.notebooks, filePath);
  database.ensureFileEntry(relativePath, stats)
    .then(({ id, modified }) => {
      const file = store.state.fileTree.addFile(relativePath, id);
      file.getAttributes();
      if (modified) {
        file.makeThumbnail(true);
      }
    });
};

const onAddDir = (dirPath) => {
  if (dirPath !== appPaths.notebooks) {
    const relativePath = path.relative(appPaths.notebooks, dirPath);
    store.state.fileTree.addDirectory(relativePath);
  }
};

const onChange = (filePath, stats) => {
  const relativePath = path.relative(appPaths.notebooks, filePath);
  const file = store.state.fileTree.findChildPath(relativePath);
  database.updateFileLastModified(filePath, stats);
  file.makeThumbnail(true);
};

const onUnlink = (filePath) => {
  const relativePath = path.relative(appPaths.notebooks, filePath);
  store.state.fileTree.deleteChildPath(relativePath);
  database.deleteFileEntry(filePath);
};

const onUnlinkDir = (dirPath) => {
  const relativePath = path.relative(appPaths.notebooks, dirPath);
  store.state.fileTree.deleteChildPath(relativePath);
};

export default {
  async setup() {
    await Promise.all(['root', 'notebooks', 'templates', 'thumbnails'].map(
      dirName => fs.ensureDir(appPaths[dirName]),
    ));

    store.state.fileTree = new Directory('');

    await new Promise((resolve, _) => {
      const watcher = chokidar.watch(appPaths.notebooks, {
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
