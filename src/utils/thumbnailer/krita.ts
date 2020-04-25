import * as fs from 'fs-extra';
import * as yauzl from 'yauzl';

export const makeKritaThumbnail = (source: string, destination: string) => new Promise((resolve, reject) =>
  yauzl.open(source, { lazyEntries: true }, (err, zipfile) => {
    if (err) {
      return reject(err);
    }
    return zipfile
      ?.on('entry', (entry) => {
        if (entry.fileName === 'preview.png') {
          zipfile.openReadStream(entry, (err1, readStream) => {
            if (err1 || !readStream) {
              return reject(err1);
            }

            const writeStream = fs.createWriteStream(destination);
            readStream.pipe(writeStream);
            readStream.on('end', resolve);
          });
        } else {
          zipfile.readEntry();
        }
      })
      .on('end', () => {
        reject(new Error(`Could not find 'preview.png' in Krita file ${source}.`));
        zipfile.close();
      })
      .on('error', err2 => {
        reject(err2);
        zipfile.close();
      })
      .readEntry();
  })
);
