import { Transform2D } from '../utils/types';

export const makeIdentityFunction = (): Transform2D => {
  return (z) => z;
};

export const makeIdentity = () => {
  console.log('makeIdentityFunction()');
  return makeIdentityFunction();
};
