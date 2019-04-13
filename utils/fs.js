import Fs from 'fs';
import Path from 'path';

// a function that creates a full directory path, if non existent
export const mkdirs = (dir) => {
  const initDir = Path.isAbsolute(dir) ? Path.sep : '';
  Path.normalize(dir).split(Path.sep).reduce((parentDir, childDir) => {
    const curDir = Path.resolve(parentDir, childDir);
    if (Fs.existsSync(curDir) === false) {
      Fs.mkdirSync(curDir);
    }
    return curDir;
  }, initDir);
};
