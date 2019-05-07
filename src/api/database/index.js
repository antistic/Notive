import sqlite from 'sqlite';
import SQL from 'sql-template-strings';
import { databasePath } from '@/api/appPaths';

export default {
  async setup() {
    const db = await sqlite.open(databasePath);

    await db.migrate({
      migrationsPath: 'src/api/database/migrations',
    });

    await db.get(SQL`PRAGMA foreign_keys = ON`);

    this.db = db;
  },

  close() {
    this.db.close();
  },

  /**
   * @return { id: number, modified: boolean }
   */
  async ensureFileEntry(filePath, stats) {
    const row = await this.db.get(SQL`
      SELECT *
      FROM Files
      WHERE path = ${filePath}
    `);

    if (row === undefined) {
      const last = await this.db.run(SQL`
        INSERT
        INTO Files (path, last_modified)
        VALUES (${filePath}, ${stats.mtimeMs})
      `);

      return {
        id: last.stmt.lastID,
        modified: true,
      };
    }

    if (row.last_modified !== stats.mtimeMs) {
      const last = await this.updateFileLastModified(filePath, stats);

      return {
        id: last.stmt.lastID,
        modified: true,
      };
    }

    return {
      id: row.fileId,
      modified: false,
    };
  },

  updateFileLastModified(filePath, stats) {
    return this.db.run(SQL`
      UPDATE Files
      SET last_modified = ${stats.mtimeMs}
      WHERE path = ${filePath}
    `);
  },

  async deleteFileEntry(filePath) {
    await this.db.run(SQL`
      DELETE
      FROM Files
      WHERE path = ${filePath}
    `);
  },

  async setFileAttributeData(fileId, attributeName, attributeData) {
    await this.db.run(SQL`
      INSERT OR IGNORE
      INTO AttributesMeta (name)
      VALUES (${attributeName})
    `);
    await this.db.run(SQL`
      INSERT OR REPLACE
      INTO Attributes (file_id, attr_name, attr_data)
      VALUES (${fileId}, ${attributeName}, ${attributeData})
    `);
  },

  getFileAttributes(fileId) {
    return this.db.all(SQL`
      SELECT *
      FROM Attributes
      WHERE file_id = ${fileId}
    `);
  },
};
