import { complex, modulus } from '../utils/complex';
import math from '../utils/math';
import { Transform2D } from '../utils/types';

export const makeHeartFunction = (): Transform2D => {
  return (z) => {
    const r = modulus(z);
    const theta = math.atan2(z.im, z.re);
    const rTheta = theta * r;
    return complex(r * math.sin(rTheta), -r * math.cos(rTheta));
  };
};

export const makeHeart = () => {
  console.log('makeHeartFunction()');
  return makeHeartFunction();
};
