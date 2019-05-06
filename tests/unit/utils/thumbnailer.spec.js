import { getThumbnailPath, makeThumbnail } from '@/utils/thumbnailer';
import * as makeKritaThumbnail from '@/utils/thumbnailer/krita';
import * as makeSharpThumbnail from '@/utils/thumbnailer/sharp';
import os from 'os';

jest.unmock('path');
jest.mock('fs-extra');
jest.mock('yauzl');
jest.mock('@/api/appPaths', () => ({
  appPaths: {
    notebooks: 'mockNotebooksPath',
  },
}));

describe('thumbnailer', () => {
  describe('getThumbnailPath', () => {
    it('creates the correct path', () => {
      if (os.platform === 'win32') {
        expect(getThumbnailPath('testFile.jpg', true))
          .toBe('mockNotebooksPath/testFile.jpg.png');

        expect(getThumbnailPath('testFile.png'))
          .toBe('mockNotebooksPath/testFile.png.png');

        expect(getThumbnailPath('testDirectory', false))
          .toBe('mockNotebooksPath/testDirectory');
      }
    });
  });

  describe('makeThumbnail', () => {
    it('calls the right thumbnailer for .kra files', async () => {
      const spy = jest.spyOn(makeKritaThumbnail, 'default');
      spy.mockResolvedValueOnce(true);

      await expect(makeThumbnail('testSource.kra', 'testDestination.kra'))
        .resolves.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });

    it.each(
      ['.jpg', '.gif', '.png'],
    )('calls the right thumbnailer for %s files', async (ext) => {
      const spy = jest.spyOn(makeSharpThumbnail, 'default');
      spy.mockResolvedValueOnce(true);

      await expect(makeThumbnail(`testSource${ext}`, `testSource.kra${ext}`))
        .resolves.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });

    it.each(
      ['.txt', '.pdf', '.bleh'],
    )('fails for unsupported (%s) files', ext => expect(
      makeThumbnail(`testSource${ext}`, `testSource.kra${ext}`),
    )
      .rejects.toThrow());
  });
});
