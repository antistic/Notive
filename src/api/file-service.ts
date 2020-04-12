import { isSupportedExtension } from '@/utils/extensions';
import { shell } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Directory, File } from '@/model';

class FileService {
  constructor(private rootPath: string) { }

  private getFullPath = (entity: File | Directory): string =>
    path.join(entity.parent ? this.getFullPath(entity.parent) : this.rootPath, entity.name);

  createDirectory = (parent: Directory, name: string): Promise<void> => name
    ? fs.mkdirp(path.join(this.getFullPath(parent), name))
    : Promise.reject(new Error('Directory name is empty'));

  createFile = (parent: Directory, existingPath: string): Promise<void> => {
    const ext = path.extname(existingPath);
    if (!isSupportedExtension(ext)) {
      throw new Error('Unsupported file type');
    }

    const newPath = path.join(this.getFullPath(parent), path.basename(existingPath));
    return fs.copyFile(existingPath, newPath);
  }

  async newFileFromTemplate(parent: Directory, fileName: string, templatePath: string) {
    if (!fileName) {
      return Promise.reject(new Error('No file name given'));
    }
    if (!templatePath) {
      return Promise.reject(new Error('No file name given'));
    }
    const newPath = path.join(this.getFullPath(parent), fileName);

    await fs.copyFile(templatePath, newPath);
    return shell.openItem(newPath);
  }
}
