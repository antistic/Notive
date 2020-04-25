import { isSupportedExtension } from '@/utils/extensions';
import { makeThumbnail } from '@/utils/thumbnailer';
import { shell } from 'electron';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Directory, File } from '@/model';
import { FileService } from './file-service';

export class ThumbnailService {
  constructor(public readonly rootThumbnailsPath: string,
    private readonly fileService: FileService) { }

  async makeThumbnail(file: File, cancelOverwrite = false) {

    const thumbnailPath = this.getFullPath(file);
    await fs.pathExists(thumbnailPath);
    if(cancelOverwrite && await fs.pathExists(thumbnailPath)) {
      return;
    }
    const fullFilePath = this.fileService.getFullPath(file);
    await fs.ensureDir(path.dirname(thumbnailPath));
    await makeThumbnail(fullFilePath, thumbnailPath);
  }

  getFullPath = (entity: File | Directory): string =>
    path.join(entity.parent ? this.getFullPath(entity.parent) : this.rootThumbnailsPath, entity.name);
}
