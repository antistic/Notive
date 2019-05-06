import { remote } from 'electron';
import path from 'path';

const appName = remote.app.getName();
const userDataPath = path.join(remote.app.getPath('documents'), appName);

export const appPaths = {
  root: userDataPath,
  notebooks: path.join(userDataPath, 'Notebooks'),
  templates: path.join(userDataPath, 'Templates'),
  thumbnails: path.join(userDataPath, 'Thumbnails'),
};

export const databasePath = path.join(appPaths.root, 'database.sqlite');
