import fs from 'fs';
import { Logger } from './types';

const loggers: Logger[] = [];

const logInConsole = console.log;

const logInFile = (file: string, ...values: any[]): void => {
  fs.appendFileSync(file, `${values.join(', ')}\n`);
};

const customLog = (...values: any[]): void => {
  logInConsole(...values);
  loggers.forEach(logger => logger(...values));
};

export const addFileLogger = (path: string): void => {
  loggers.push((...values) => logInFile(path, ...values));
};

console.log = customLog;
