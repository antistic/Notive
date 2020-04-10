import Directory from '@/api/fileWatcher/Directory';
import appPaths from '@/api/appPaths';
import fs from 'fs-extra';
import path from 'path';

jest.mock('fs-extra');
jest.mock('@/api/appPaths', () => {
  const path_ = require('path');

  return {
    notebooks: path_.join('/', 'root', 'notebooks'),
    thumbnails: path_.join('/', 'root', 'thumbnails'),
  };
});

describe('Directory', () => {
  it('creates with correct fields', () => {
    const dir = new Directory('newDir');

    expect(dir).toHaveProperty('type', 'directory');
    expect(dir).toHaveProperty('parent', null);
    expect(dir).toHaveProperty('_relativePath', path.join('.', 'newDir'));
    expect(dir).toHaveProperty('path', path.join('notebooks', 'newDir'));
    expect(dir).toHaveProperty('name', 'newDir');
    expect(dir).toHaveProperty('contents', []);
  });

  describe('_clean', () => {
    it('removes thumbnail path', () => {
      const dir = new Directory('newDir');
      dir._clean();
      expect(fs.remove).toHaveBeenCalledWith(
        path.join(
          appPaths.thumbnails,
          dir._relativePath,
        ),
      );
    });
  });

  describe('delete', () => {
    it('deletes Directory', () => {
      const parent = new Directory('.');
      const dir = parent.addDirectory(path.join('.', 'newDir'));

      dir.delete();

      expect(parent.contents).toEqual([]);
    });

    it('deletes Directory with items', () => {
      const parent = new Directory('');
      const dir = parent.addDirectory(path.join('.', 'newDir'));
      parent.addFile(
        path.join('.', 'newDir', 'newFile'),
        1,
      );

      dir.delete();

      expect(parent.contents).toEqual([]);
    });
  });

  describe('addFile/addDirectory', () => {
    it('adds direct child file', () => {
      const parent = new Directory('');
      const child = parent.addFile(path.join('.', 'newFile'), 1);

      expect(parent.contents).toEqual(
        expect.arrayContaining([child]),
      );
      expect(child).toHaveProperty('parent', parent);
      expect(child).toHaveProperty('name', 'newFile');
    });

    it('adds direct child directory', () => {
      const parent = new Directory('');
      const child = parent.addDirectory(path.join('.', 'newDir'));

      expect(parent.contents).toEqual(
        expect.arrayContaining([child]),
      );
      expect(child).toHaveProperty('parent', parent);
      expect(child).toHaveProperty('name', 'newDir');
    });

    it('adds nested child file', () => {
      const parent = new Directory('');
      const dir = parent.addDirectory(path.join('.', 'newDir'));
      const file = parent.addFile(
        path.join('.', 'newDir', 'newFile'),
        1,
      );

      expect(parent.contents).toEqual(
        expect.arrayContaining([dir]),
      );
      expect(dir.contents).toEqual(
        expect.arrayContaining([file]),
      );
      expect(file).toHaveProperty('parent', dir);
      expect(file).toHaveProperty('name', 'newFile');
    });
  });

  describe('deleteChildPath', () => {
    it('deletes item', () => {
      const parent = new Directory('');
      const child = parent.addDirectory('newDir');
      parent.deleteChildPath(child._relativePath);

      expect(parent.contents).not.toEqual(
        expect.arrayContaining([child]),
      );
      expect(fs.remove).toHaveBeenCalledWith(
        path.join(appPaths.thumbnails, 'newDir'),
      );
    });

    it('deletes correct item out of multiple', () => {
      const parent = new Directory('');
      const child1 = parent.addDirectory('newDir');
      const child2 = parent.addDirectory('newDir2');
      parent.deleteChildPath(child2._relativePath);

      expect(parent.contents).not.toEqual(
        expect.arrayContaining([child2]),
      );
      expect(parent.contents).toEqual(
        expect.arrayContaining([child1]),
      );
      expect(fs.remove).toHaveBeenCalledWith(
        path.join(appPaths.thumbnails, 'newDir'),
      );
    });

    it('deletes nested child file', () => {
      const parent = new Directory('');
      const dir = parent.addDirectory(path.join('.', 'newDir'));
      const file = parent.addFile(
        path.join('.', 'newDir', 'newFile'),
        1,
      );

      parent.deleteChildPath(file._relativePath);

      expect(parent.contents).toEqual(
        expect.arrayContaining([dir]),
      );
      expect(dir.contents).not.toEqual(
        expect.arrayContaining([file]),
      );
    });
  });
});
