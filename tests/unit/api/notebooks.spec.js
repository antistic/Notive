import { isSupportedExtension } from '@/utils/extensions';
import Directory from '@/api/fileWatcher/Directory';
import notebooks from '@/api/notebooks';
import appPaths from '@/api/appPaths';
import { shell } from 'electron';
import fs from 'fs-extra';
import path from 'path';

jest.mock('fs-extra');
jest.mock('@/api/fileWatcher/Directory', () => require('@/api/fileWatcher/Item'));
jest.mock('@/utils/extensions');
jest.mock('@/api/appPaths', () => {
  const path_ = require('path');

  return {
    notebooks: path_.join('/', 'root', 'notebooks'),
    thumbnails: path_.join('/', 'root', 'thumbnails'),
    databaseMigrations: path_.join('public', 'migrations'),
  };
});

const mockParent = new Directory('mockParentPath');

describe('notebooks', () => {
  describe('newDirectory', () => {
    beforeEach(() => {
      fs.mkdirp.mockClear();
    });

    it.each(
      ['', null, undefined],
    )('fails on invalid directory names', async (directoryName) => {
      await expect(notebooks.newDirectory(mockParent, directoryName))
        .rejects.toThrow();

      expect(fs.mkdirp).not.toHaveBeenCalled();
    });

    it.each(
      ['0', 'testDirectory - name'],
    )('works with valid directory names', async (directoryName) => {
      fs.mkdirp.mockResolvedValue();

      await expect(notebooks.newDirectory(mockParent, directoryName))
        .resolves.not.toThrow();

      expect(fs.mkdirp).toHaveBeenCalledTimes(1);
      expect(fs.mkdirp).toHaveBeenCalledWith(path.join(
        path.join(appPaths.notebooks, 'mockParentPath', directoryName),
      ));
    });
  });

  describe('addFile', () => {
    it('adds to correct path', async () => {
      fs.copyFile.mockResolvedValueOnce(true);
      isSupportedExtension.mockReturnValueOnce(true);

      await notebooks.addFile(mockParent, 'testPath');

      expect(fs.copyFile).toHaveBeenCalledWith(
        'testPath',
        path.join(
          appPaths.notebooks,
          'mockParentPath',
          'testPath',
        ),
      );
    });

    it('checks the file type', async () => {
      isSupportedExtension.mockClear();
      isSupportedExtension.mockReturnValueOnce(true);
      fs.copyFile.mockResolvedValueOnce(true);

      await notebooks.addFile(mockParent, 'testPath');

      expect(isSupportedExtension).toHaveBeenCalledTimes(1);
    });

    it('fails if copy does not work', async () => {
      isSupportedExtension.mockReturnValueOnce(true);
      fs.copyFile.mockRejectedValueOnce(new Error('copy failed'));

      await expect(notebooks.addFile(mockParent, 'testPath'))
        .rejects.toThrow();
    });

    it('fails if wrong file type', async () => {
      isSupportedExtension.mockReturnValueOnce(false);
      fs.copyFile.mockResolvedValueOnce(true);

      await expect(notebooks.addFile(mockParent, 'testPath'))
        .rejects.toThrow();
    });
  });

  describe('newFileFromTemplate', () => {
    beforeEach(() => {
      fs.copyFile.mockClear();
    });

    it.each(
      ['', null, undefined],
    )('fails on invalid file path %p', async (filePath) => {
      await expect(notebooks.newFileFromTemplate(
        mockParent, filePath, 'mockTemplatePath',
      )).rejects.toThrow();

      expect(fs.copyFile).not.toHaveBeenCalled();
    });

    it.each(
      ['', null, undefined],
    )('fails on invalid template path %p', async (templatePath) => {
      await expect(notebooks.newFileFromTemplate(
        mockParent, 'mockFilePath', templatePath,
      )).rejects.toThrow();

      expect(fs.copyFile).not.toHaveBeenCalled();
    });


    it('works with valid inputs', async () => {
      fs.copyFile.mockResolvedValueOnce(true);
      shell.openItem.mockReturnValueOnce(true);

      await expect(
        notebooks.newFileFromTemplate(mockParent, 'mockPath', 'mockTemplatePath'),
      ).resolves.not.toThrow();

      expect(fs.copyFile).toHaveBeenCalledTimes(1);
      expect(shell.openItem).toHaveBeenCalledTimes(1);
      expect(fs.copyFile).toHaveBeenCalledWith(
        'mockTemplatePath',
        path.join(
          appPaths.notebooks,
          'mockParentPath',
          'mockPath',
        ),
      );
    });
  });
});
