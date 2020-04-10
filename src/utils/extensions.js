import { remote } from 'electron';
import path from 'path';

const supportedNamesAndExtensions = [
  { name: 'Krita Files', extensions: ['kra'] },
  { name: 'JPEG Images', extensions: ['jpg', 'jpeg'] },
  ...['bmp', 'png', 'gif', 'svg', 'tiff', 'webp'].map((ext) => ({
    name: `${ext.toUpperCase()} Images`, extensions: [ext],
  })),
];

const supportedExtensions = supportedNamesAndExtensions
  .reduce((acc, x) => acc.concat(x.extensions), []);

export function isSupportedExtension(extName) {
  if (!extName) return false;

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
      { name: 'All Supported', extensions: supportedExtensions },
      ...supportedNamesAndExtensions,
    ],
    properties: ['openFile'],
  };

  const options = Object.assign(defaultOptions, overrideOptions);

  remote.dialog.showOpenDialog(options, callback);
}
