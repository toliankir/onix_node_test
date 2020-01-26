import path from 'path';

export function getRootDir() {
  return path.dirname(path.dirname(__dirname));
}