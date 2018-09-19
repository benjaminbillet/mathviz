

export const makeIdentityFunction = () => {
  return (z) => z;
};

export const makeIdentity = () => {
  console.log('makeIdentityFunction()');
  return makeIdentityFunction();
};
