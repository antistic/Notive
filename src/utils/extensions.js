import { remote } from 'electron';
import path from 'path';

const supportedNamesAndExtensions = [
  { name: 'Krita Files', extensions: ['kra'] },
  { name: 'JPEG Images', extensions: ['jpg', 'jpeg'] },
  { name: 'PNG Images', extensions: ['png'] },
  { name: 'Photoshop Files', extensions: ['psd'] },
];

const supportedExtensions = supportedNamesAndExtensions
  .reduce((acc, x) => acc.concat(x.extensions), []);

export function isSupportedExtension(extName) {
  let ext = extName.toLowerCase();
  // remove initial '.'
  ext = ext.slice(1);

  return supportedExtensions.indexOf(ext) > -1;
}

export function isBrowserSupportedImage(filePath) {
  let ext = path.extname(filePath);
  ext = ext.toLowerCase();

  const imageExts = ['.bmp', '.jpg', '.jpeg', '.png', '.gif', '.svg', 'webp'];

  return imageExts.indexOf(ext) > -1;
}


export function showOpenDialog(overrideOptions, callback) {
  const defaultOptions = {
    filters: [
      // ** is used to force it to be the default option
      { name: 'All Files', extensions: ['**'] },
      ...supportedNamesAndExtensions,
    ],
    properties: ['openFile'],
  };

  const options = Object.assign(defaultOptions, overrideOptions);

  remote.dialog.showOpenDialog(options, callback);
}
