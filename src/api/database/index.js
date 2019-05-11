import sqlite from 'sqlite';
import SQL from 'sql-template-strings';
import appPaths from '@/api/appPaths';
import store from '@/api/store';
import fs from 'fs-extra';
import path from 'path';

export default {
  async setup() {
    fs.ensureDir(path.dirname(appPaths.database));

    const db = await sqlite.open(appPaths.database);

    await db.migrate({
      migrationsPath: appPaths.databaseMigrations,
    });

    await db.get(SQL`PRAGMA foreign_keys = ON`);

    this.db = db;

    store.availableAttributes = await this.getAvailableAttributes();
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
      id: row.id,
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

  async newAttribute(attributeName) {
    const last = await this.db.run(SQL`
      INSERT OR IGNORE
      INTO AttributesMeta (name)
      VALUES (${attributeName})
    `);

    if (last.stmt.changes > 0) {
      store.availableAttributes = await this.getAvailableAttributes();
    }
  },

  async addFileAttributeData(fileId, attributeName, attributeData) {
    await this.db.run(SQL`
      INSERT
      INTO Attributes (file_id, attr_name, attr_data)
      VALUES (${fileId}, ${attributeName}, ${attributeData})
    `);
  },

  async editFileAttributeData(fileId, attributeName, attributeData) {
    const result = await this.db.run(SQL`
      UPDATE Attributes
      SET attr_data=${attributeData}
      WHERE file_id = ${fileId} AND attr_name = ${attributeName}
    `);

    if (result.stmt.changes === 0) throw new Error('Attribute does not exist');
  },

  async deleteFileAttributeData(fileId, attributeName) {
    await this.db.run(SQL`
      DELETE FROM Attributes
      WHERE file_id = ${fileId} AND attr_name = ${attributeName}
    `);
  },

  getFileAttributes(fileId) {
    return this.db.all(SQL`
      SELECT *
      FROM Attributes
      WHERE file_id = ${fileId}
    `);
  },

  getAvailableAttributes() {
    return this.db.all(SQL`
      SELECT *
      FROM AttributesMeta
  `);
  },
};
