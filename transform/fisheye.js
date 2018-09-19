import Complex from 'complex.js';


export const makeFisheyeFunction = () => {
  return (z) => {
    const factor = 2 / (z.abs() + 1);
    return new Complex(factor * z.im, factor * z.re);
  };
};

export const makeFisheye = () => {
  console.log('makeFisheyeFunction()');
  return makeFisheyeFunction();
};
