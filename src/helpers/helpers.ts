import path from 'path';

export function getRootDir(): string {
  return path.dirname(path.dirname(__dirname));
}

export function dayInSpecTZ(timestamp: number, timezone: number): string {
  // const eventDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()];

  return '';
}