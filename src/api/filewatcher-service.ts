import * as chokidar from 'chokidar';
import * as fs from 'fs-extra';
import * as path from 'path';
import { isSupportedExtension } from '@/utils/extensions';
import { DatabaseService } from './database-service';
import { FileService } from './file-service';
import { State, state } from './store';
import { Directory, File } from '@/model';
import { ThumbnailService } from './thumbnail-service';

export async function surrenderUntoMeAFileWatcherWithWhichICanWork(databaseService: DatabaseService, fileService: FileService,
  thumbnailService: ThumbnailService) {

  await new Promise((resolve, _) => {
    const watcher = chokidar.watch(fileService.rootNotebooksPath, {
      persistent: true,
      ignorePermissionErrors: true,
    });
    const service = new FileWatcherService(databaseService, watcher, fileService, thumbnailService, state);
    watcher
      .on('add', service.onAddFile)
      .on('addDir', service.onAddDir)
      .on('change', service.onChange)
      .on('unlink', service.onUnlink)
      .on('unlinkDir', service.onUnlinkDir)
      .on('ready', resolve);
    return service;
  });
}

export class FileWatcherService {
  constructor(private readonly db: DatabaseService,
    private readonly watcher: chokidar.FSWatcher,
    private readonly fileService: FileService,
    private readonly thumbnailService: ThumbnailService,
    private readonly state: State) { }

  private getParentFromPath(filePath: string) {
    const jump = (directory: Directory, [next, ...rest]: string[]): Directory => {
      if (!next) {
        return directory;
      }
      const child = directory.children.find(c => c.name === next);
      if (!child) {
        throw new Error(`Didn't find child '${next}' in dir '${directory.name}'`);
      }
      return jump(child, rest);
    }

    if (!state.fsRoot) {
      throw new Error('No root set');
    }

    const segments = filePath
      .split('/')
      .filter(s => s !== '.')
      .slice(0, -1);

    return jump(state.fsRoot, segments);
  }

  private getFileFromPath(filePath: string): File {
    const result = this.getParentFromPath(filePath).files
      .find(f => f.name === path.basename(filePath));
    if (!result) {
      throw new Error('file not found');
    }
    return result;
  }

  private getDirectoryFromPath(dirPath: string): Directory {
    const result = this.getParentFromPath(dirPath).children
      .find(f => f.name === path.basename(dirPath));
    if (!result) {
      throw new Error('file not found');
    }
    return result;
  }

  onAddFile(filePath: string, stats: fs.Stats): void {
    if (!isSupportedExtension(path.extname(filePath))) {
      return;
    }

    const relativePath = this.fileService.getRelativePath(filePath);
    this.db.ensureFileEntry(relativePath, stats)
      .then(({ id, modified }) => this.db.getFileAttributes(id)
        .then(attributes => {
          const parent = this.getParentFromPath(relativePath);
          const child = {
            parent,
            id,
            name: path.basename(relativePath),
            metadata: attributes.reduce((acc, cur) => ({ ...acc, [cur.key]: cur.value }), {}),
          }
          parent.files.push(child);

          if (modified) {
            this.thumbnailService.makeThumbnail(child);
          }
        }));
  }

  onAddDir(dirPath: string) {
    if (dirPath !== this.fileService.rootNotebooksPath) {
      const relativePath = this.fileService.getRelativePath(dirPath);
      const parent = this.getParentFromPath(relativePath);
      parent.children.push({
        parent,
        files: [],
        children: [],
        name: path.basename(dirPath)
      });
    }
  };

  onChange(filePath: string, stats: fs.Stats) {
    const file = this.getFileFromPath(filePath);
    this.db.updateFileLastModified(filePath, stats)
      .then(() => this.thumbnailService.makeThumbnail(file));
  }

  onUnlink(filePath: string) {
    const relativePath = this.fileService.getRelativePath(filePath);
    const parent = this.getParentFromPath(relativePath);
    parent.files = parent.files
      .filter(file => file.name !== path.basename(filePath));
    this.db.deleteFileEntry(filePath);
  }

  onUnlinkDir(dirPath: string) {
    const relativePath = this.fileService.getRelativePath(dirPath);
    const parent = this.getParentFromPath(relativePath);
    parent.children = parent.children
      .filter(child => child.name !== path.basename(dirPath));
  }
}