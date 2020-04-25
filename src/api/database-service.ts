import * as sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import SQL from 'sql-template-strings';
import * as fs from 'fs-extra';
import * as path from 'path';

interface AttributeDto {
  'file_id': number;
  'attr_name': string;
  'attr_data': string;
}

interface Attribute {
  fileId: number;
  key: string;
  value: string;
}

interface FileDto {
  'id': number;
  'path': string;
  'last_modified': number;
}

interface File {
  id: number;
  path: string;
  lastModified: number;
}

interface AttributesMetaDto {
  name: string;
}

interface AttributesMeta extends AttributesMetaDto { }

export async function surrenderUntoMeADatabaseWithWhichICanWork(databasePath: string, databaseMigrations: string) {
  fs.ensureDir(path.dirname(databasePath));

  const db = await sqlite.open({
    filename: databasePath,
    driver: sqlite3.Database,
  } as sqlite.ISqlite.Config);

  db.migrate({
    migrationsPath: databaseMigrations,
  });

  await db.get(SQL`PRAGMA foreign_keys = ON`);

  return new DatabaseService(db);
}

export class DatabaseService {
  constructor(private db: sqlite.Database<sqlite3.Database, sqlite3.Statement>) { }

  close = this.db.close;

  async ensureFileEntry(filePath: string, stats: fs.Stats): Promise<{ id: number, modified: boolean }> {
    const row = await this.db.get<FileDto>(SQL`
      SELECT TOP 1 *
      FROM Files
      WHERE path = ${filePath}
    `);

    if (row) {
      if (row.last_modified !== stats.mtimeMs) {
        await this.updateFileLastModified(filePath, stats);
      }
      return {
        id: row.id,
        modified: false,
      };
    }

    const last: sqlite.ISqlite.RunResult<sqlite3.Statement> = await this.db.run(SQL`
      INSERT
      INTO Files (path, last_modified)
      VALUES (${filePath}, ${stats.mtimeMs})
    `);

    if (!last.lastID) {
      throw new Error('holy fuck');
    }

    return {
      id: last.lastID,
      modified: true,
    };
  }

  updateFileLastModified(filePath: string, stats: fs.Stats) {
    return this.db.run(SQL`
      UPDATE Files
      SET last_modified = ${stats.mtimeMs}
      WHERE path = ${filePath}
    `);
  }

  deleteFileEntry = (filePath: string) =>
    this.db.run(SQL`
      DELETE
      FROM Files
      WHERE path = ${filePath}
    `);

  newAttribute = (attributeName: string) => // TODO need to update available attributes once this is done
    this.db.run(SQL`
      INSERT OR IGNORE
      INTO AttributesMeta (name)
      VALUES (${attributeName.trim()})
    `).then(last => last.changes ?? 0);

  addFileAttributeData = (fileId: number, attributeName: string, attributeData: string) =>
    this.db.run(SQL`
      INSERT
      INTO Attributes (file_id, attr_name, attr_data)
      VALUES (${fileId}, ${attributeName}, ${attributeData.trim()})
    `);

  editFileAttributeData = async (fileId: number, attributeName: string, attributeData: string) =>
    this.db.run(SQL`
      UPDATE Attributes
      SET attr_data=${attributeData.trim()}
      WHERE file_id = ${fileId} AND attr_name = ${attributeName}
    `).then(result => {
      if (result.changes === 0) {
        throw new Error('Attribute doesn"t exist');
      }
      return result;
    });

  deleteFileAttributeData = (fileId: number, attributeName: string) =>
    this.db.run(SQL`
      DELETE FROM Attributes
      WHERE file_id = ${fileId} AND attr_name = ${attributeName}
    `);

  getFileAttributes = (fileId: number) => this.db.all<AttributeDto[]>(SQL`
      SELECT *
      FROM Attributes
      WHERE file_id = ${fileId}
    `).then(dtos =>
    dtos.map(dto => ({
      fileId: dto.file_id,
      key: dto.attr_name,
      value: dto.attr_data,
    } as Attribute))
  );

  getAvailableAttributes = () => this.db.all<AttributesMetaDto[]>(SQL`
      SELECT *
      FROM AttributesMeta
    `).then(dtos => dtos.map(dto => dto.name));
}
