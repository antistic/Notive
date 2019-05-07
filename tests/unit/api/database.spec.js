import SQL from 'sql-template-strings';
import database from '@/api/database';

jest.mock('@/api/appPaths', () => ({
  databasePath: ':memory:',
}));

describe('database', () => {
  describe('setup', () => {
    beforeAll(async () => {
      await database.setup();
    });

    afterAll(async () => {
      await database.close();
    });

    it('has correct tables', async () => {
      const tables = await database.db.all(SQL`
        SELECT name
        FROM sqlite_master
        WHERE type = 'table';
      `);

      expect(tables.map(table => table.name)).toEqual(
        expect.arrayContaining(['Files', 'Attributes', 'AttributesMeta']),
      );
    });
  });

  describe('ensureFileEntry', () => {
    beforeEach(async () => {
      await database.setup();
    });

    afterEach(async () => {
      await database.db.close();
    });

    it('should work', async () => {
      await database.ensureFileEntry('testPath', { mtimeMs: 10 });

      const rows = await database.db.all(SQL`SELECT * FROM Files`);
      expect(rows).toHaveLength(1);
    });

    it('does not reinsert if not modified', async () => {
      await database.ensureFileEntry('testPath', { mtimeMs: 10 });
      const { modified } = await database.ensureFileEntry('testPath', { mtimeMs: 10 });

      const rows = await database.db.all(SQL`SELECT * FROM Files`);
      expect(rows).toHaveLength(1);
      expect(modified).toBeFalsy();
    });

    it('updates file entry if modified time changes', async () => {
      await database.ensureFileEntry('testPath', { mtimeMs: 10 });
      const { modified } = await database.ensureFileEntry('testPath', { mtimeMs: 20 });

      const rows = await database.db.all(SQL`SELECT * FROM Files`);
      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveProperty('last_modified', 20);
      expect(modified).toBeTruthy();
    });
  });

  describe('deleteFileEntry', () => {
    beforeEach(async () => {
      await database.setup();
    });

    afterEach(async () => {
      await database.db.close();
    });

    it('removes the entry from Files', async () => {
      await database.ensureFileEntry('testPath', { mtimeMs: 10 });
      await database.deleteFileEntry('testPath');

      const rows = await database.db.all(SQL`SELECT * FROM Files`);
      expect(rows).toHaveLength(0);
    });

    it('removes the associated attributes from Files', async () => {
      const { id } = await database.ensureFileEntry('testPath', { mtimeMs: 10 });
      await (database.setFileAttributeData(id, 'testAttribute', 'testData'));
      await (database.deleteFileEntry('testPath'));

      const rows = await database.db.all(SQL`SELECT * FROM Attributes`);
      expect(rows).toHaveLength(0);
    });

    it('does not delete other files', async () => {
      await database.ensureFileEntry('testPath', { mtimeMs: 10 });
      await database.ensureFileEntry('testPath2', { mtimeMs: 20 });
      await database.deleteFileEntry('testPath');

      const rows = await database.db.all(SQL`SELECT * FROM Files`);
      expect(rows).toHaveLength(1);
    });
  });


  describe('setFileAttributeData', () => {
    beforeEach(async () => {
      await database.setup();
    });

    afterEach(async () => {
      await database.db.close();
    });

    it('sets the attribute', async () => {
      const { id } = await database.ensureFileEntry('testPath', { mtimeMs: 10 });

      await expect(database.setFileAttributeData(id, 'testAttribute', 'testData'))
        .resolves.toBeUndefined();

      const rows = await database.db.all(SQL`SELECT * FROM Attributes`);

      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveProperty('attr_name', 'testAttribute');
      expect(rows[0]).toHaveProperty('attr_data', 'testData');
    });
  });

  describe('getFileAttributes', () => {
    beforeEach(async () => {
      await database.setup();
    });

    afterEach(async () => {
      await database.db.close();
    });

    it('gets the attributes', async () => {
      const { id: id1 } = await database.ensureFileEntry('testPath1', { mtimeMs: 10 });
      await database.setFileAttributeData(id1, 'testAttribute', 'testData1');

      const { id: id2 } = await database.ensureFileEntry('testPath2', { mtimeMs: 20 });
      await database.setFileAttributeData(id2, 'testAttribute', 'testData2');

      const rows = await database.getFileAttributes(id1);

      expect(rows).toHaveLength(1);
      expect(rows[0]).toHaveProperty('attr_name', 'testAttribute');
      expect(rows[0]).toHaveProperty('attr_data', 'testData1');
    });
  });
});