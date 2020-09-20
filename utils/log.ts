import fs from 'fs';
import { Logger } from './types';

const loggers: Logger[] = [];

const logInConsole = console.log;

const logInFile = (file: string, ...values: any[]) => {
  fs.appendFileSync(file, `${values.join(', ')}\n`);
};

const customLog = (...values: any[]) => {
  logInConsole(...values);
  loggers.forEach(logger => logger(...values));
};

export const addFileLogger = (path: string) => {
  loggers.push((...values) => logInFile(path, ...values));
};

console.log = customLog;
