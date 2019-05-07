import fs from 'fs-extra';
import yauzl from 'yauzl';

export default (source, destination) => new Promise((resolve, reject) => {
  yauzl.open(source, { lazyEntries: true }, (err0, zipfile) => {
    if (err0) reject(err0);

    zipfile.on('entry', (entry) => {
      if (entry.fileName === 'preview.png') {
        zipfile.openReadStream(entry, (err1, readStream) => {
          if (err1) reject(err1);

          const writeStream = fs.createWriteStream(destination);
          readStream.pipe(writeStream);
          readStream.on('end', resolve);
        });
      } else {
        zipfile.readEntry();
      }
    });
    zipfile.on('end', () => {
      reject(new Error(`Could not find 'preview.png' in Krita file ${source}.`));
      zipfile.close();
    });
    zipfile.on('error', (err2) => {
      reject(err2);
      zipfile.close();
    });

    zipfile.readEntry();
  });
});
