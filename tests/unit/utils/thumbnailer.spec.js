import makeThumbnail from '@/utils/thumbnailer';
import * as makeKritaThumbnail from '@/utils/thumbnailer/krita';
import * as makeSharpThumbnail from '@/utils/thumbnailer/sharp';

jest.unmock('path');
jest.mock('fs-extra');
jest.mock('yauzl');
jest.mock('@/api/appPaths', () => ({
  notebooks: 'mockNotebooksPath',
}));

describe('thumbnailer', () => {
  describe('makeThumbnail', () => {
    it('calls the right thumbnailer for .kra files', async () => {
      const spy = jest.spyOn(makeKritaThumbnail, 'default');
      spy.mockResolvedValueOnce(true);

      await expect(makeThumbnail('testSource.kra', 'testDestination.kra', 0))
        .resolves.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });

    it.each(
      ['.jpg', '.gif', '.png'],
    )('calls the right thumbnailer for %s files', async (ext) => {
      const spy = jest.spyOn(makeSharpThumbnail, 'default');
      spy.mockResolvedValueOnce(true);

      await expect(makeThumbnail(`testSource${ext}`, `testSource.kra${ext}`, 0))
        .resolves.toBeUndefined();

      expect(spy).toHaveBeenCalledTimes(1);

      spy.mockRestore();
    });

    it.each(
      ['.txt', '.pdf', '.bleh'],
    )('fails for unsupported (%s) files', ext => expect(
      makeThumbnail(`testSource${ext}`, `testSource.kra${ext}`, 0),
    )
      .rejects.toThrow());
  });
});
