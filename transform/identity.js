import fs from 'fs';

export const makeIdentityFunction = () => {
  return (z) => z;
};

export const makeIdentity = (file) => {
  fs.appendFileSync(file, 'makeIdentityFunction()\n');
  return makeIdentityFunction();
};
