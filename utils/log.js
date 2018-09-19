import fs from 'fs';

const loggers = [];

const logInConsole = console.log;

const logInFile = (file, ...values) => {
  fs.appendFileSync(file, `${values.join(', ')}\n`);
};

const customLog = (...values) => {
  logInConsole(...values);
  loggers.forEach(logger => logger(...values));
};

export const addFileLogger = (path) => {
  loggers.push((...values) => logInFile(path, ...values));
};

console.log = customLog;
