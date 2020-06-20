import { remote } from 'electron';

export const appPaths = remote.getGlobal('appPaths') as {[name: string]: string};
