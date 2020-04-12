import { remote } from 'electron';
import * as path from 'path';

const supportedNamesAndExtensions = [
  { name: 'Krita Files', extensions: ['kra'] },
  { name: 'JPEG Images', extensions: ['jpg', 'jpeg'] },
  ...['bmp', 'png', 'gif', 'svg', 'tiff', 'webp'].map((ext) => ({
    name: `${ext.toUpperCase()} Images`, extensions: [ext],
  })),
];

const supportedExtensions = supportedNamesAndExtensions
  .map(x => x.extensions)
  .flat();

export function isSupportedExtension(extName: string): boolean {
  return extName ? supportedExtensions.includes(extName.toLowerCase().slice(1)) : false;
}

const imageExts = ['.bmp', '.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

export function isBrowserSupportedImage(filePath: string) {
  return imageExts.includes(path.extname(filePath).toLowerCase());
}

const defaultOptions: Electron.OpenDialogOptions = {
  filters: [
    { name: 'All Supported', extensions: supportedExtensions },
    ...supportedNamesAndExtensions,
  ],
  properties: ['openFile'],
};

export function showOpenDialog(overrideOptions?: Electron.OpenDialogOptions):
  Promise<Electron.OpenDialogReturnValue> {
  return remote.dialog.showOpenDialog({ ...defaultOptions, ...overrideOptions });
}
