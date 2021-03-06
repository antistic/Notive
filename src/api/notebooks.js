import { isSupportedExtension } from '@/utils/extensions';
import { shell } from 'electron';
import fs from 'fs-extra';
import path from 'path';

export default {
  newDirectory(parent, newDirectoryName) {
    if (!newDirectoryName) {
      return Promise.reject(new Error('Directory name is empty'));
    }

    const newPath = path.join(parent.fullPath, newDirectoryName);
    return fs.mkdirp(newPath);
  },

  async addFile(parent, filePath) {
    const ext = path.extname(filePath);
    if (!isSupportedExtension(ext)) {
      throw new Error('Unsupported file type');
    }

    const newPath = path.join(parent.fullPath, path.basename(filePath));
    await fs.copyFile(filePath, newPath);
  },

  async newFileFromTemplate(parent, fileName, templatePath) {
    if (!fileName) {
      throw new Error('No file name given');
    }
    if (!templatePath) {
      throw new Error('No file name given');
    }

    const newPath = path.join(parent.fullPath, fileName);

    await fs.copyFile(templatePath, newPath);
    await shell.openItem(newPath);
  },
};
