import { complex } from '../utils/complex';
import { Transform2D } from '../utils/types';


export const makeSphericalFunction = (): Transform2D => {
  return (z) => {
    const rSquared = z.re * z.re + z.im * z.im;
    return complex(z.re / rSquared, z.im / rSquared);
  };
};

export const makeSpherical = () => {
  console.log('makeSphericalFunction()');
  return makeSphericalFunction();
};
