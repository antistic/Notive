import { shell } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import { isSupportedExtension } from '@/utils/extensions';

export default {
  newDirectory(parent, newDirectoryName) {
    if (!newDirectoryName) {
      return Promise.reject(new Error('Directory name is empty'));
    }

    const newPath = path.join(parent.path, newDirectoryName);
    return fs.mkdirp(newPath);
  },

  addFile(parent, filePath) {
    const ext = path.extname(filePath);
    if (!isSupportedExtension(ext)) {
      return Promise.reject(new Error('Unsupported file type'));
    }

    const newPath = path.join(parent.path, path.basename(filePath));
    return fs.copyFile(filePath, newPath);
  },

  newFileFromTemplate(parent, fileName, templatePath) {
    if (!fileName) {
      return Promise.reject(new Error('No file name given'));
    }
    if (!templatePath) {
      return Promise.reject(new Error('No file name given'));
    }

    const newPath = path.join(parent.path, fileName);

    return fs
      .copyFile(templatePath, newPath)
      .then(() => shell.openItem(newPath));
  },
};
