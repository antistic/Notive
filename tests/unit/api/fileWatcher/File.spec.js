import File from '@/api/fileWatcher/File';
import Directory from '@/api/fileWatcher/Directory';
import path from 'path';
import fs from 'fs-extra';
import appPaths from '@/api/appPaths';
import makeThumbnail from '@/utils/thumbnailer';

jest.mock('fs-extra');
jest.mock('@/utils/thumbnailer', () => jest.fn());
jest.mock('@/api/appPaths', () => {
  const path_ = require('path');

  return {
    notebooks: path_.join('/', 'root', 'notebooks'),
    thumbnails: path_.join('/', 'root', 'thumbnails'),
  };
});

describe('File', () => {
  it('creates with the correct fields', () => {
    const file = new File('newFile', 1);

    expect(file).toHaveProperty('type', 'file');
    expect(file).toHaveProperty('parent', null);
    expect(file).toHaveProperty('_relativePath', path.join('.', 'newFile'));
    expect(file).toHaveProperty('path', path.join('notebooks', 'newFile'));
    expect(file).toHaveProperty('name', 'newFile');
    expect(file).toHaveProperty('id', 1);
    expect(file).toHaveProperty('metadata', []);
    expect(file).toHaveProperty('_thumbnailPath', path.join(
      'thumbnails', 'newFile.png',
    ));
    expect(file).toHaveProperty('thumbnailPath', path.join(
      'thumbnails', 'newFile.png',
    ));
  });

  describe('_clean', () => {
    it('removes thumbnail', () => {
      const file = new File('newFile', 1);
      file._clean();
      expect(fs.remove).toHaveBeenCalledWith(
        path.join(
          appPaths.thumbnails,
          `${file._relativePath}.png`,
        ),
      );
    });
  });

  describe('delete', () => {
    it('deletes File', () => {
      const parent = new Directory('.');
      const file = parent.addFile('newFile', 1);

      file.delete();

      expect(parent.contents).toEqual([]);
    });
  });

  describe('makeThumbnail', () => {
    beforeEach(() => {
      fs.pathExists.mockResolvedValueOnce(false);
      fs.ensureDir.mockResolvedValueOnce(undefined);
      makeThumbnail.mockResolvedValueOnce(undefined);
    });

    it('calls with correct path', async () => {
      const file = new File('newFile', 1);
      await file.makeThumbnail();

      expect(makeThumbnail).toHaveBeenCalledWith(
        path.join(
          appPaths.notebooks,
          file._relativePath,
        ),
        path.join(
          appPaths.thumbnails,
          `${file._relativePath}.png`,
        ),
      );
    });

    it('assigns thumbnail paths correctly', async () => {
      const spy = jest.spyOn(Date, 'now').mockImplementation(() => 123456789);

      const file = new File('newFile', 1);
      await file.makeThumbnail();

      expect(file).toHaveProperty('_thumbnailPath', path.join(
        'thumbnails', 'newFile.png',
      ));
      expect(file).toHaveProperty('thumbnailPath', path.join(
        'thumbnails', 'newFile.png?m=123456789',
      ));

      spy.mockRestore();
    });
  });
});
