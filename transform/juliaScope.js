import Complex from 'complex.js';
import fs from 'fs';
import { randomInteger, randomScalar } from '../utils/random';

export const makeJuliaScopeFunction = (power, dist) => {
  const ratio = dist / power;
  return (z) => {
    const r = Math.pow(z.abs(), ratio);
    let t = -1;
    if (Math.random() < 0.5) {
      t = 1;
    }
    t = (t * Math.atan2(z.im, z.re) + 2 * Math.PI * Math.trunc(power * Math.random())) / power;
    return new Complex(Math.cos(t) * r, Math.sin(t) * r);
  };
};

export const makeJuliaScope = (file) => {
  const power = randomInteger(5, 10);
  const dist = randomScalar(2, 4);
  fs.appendFileSync(file, `makeJuliaScopeFunction(${power}, ${dist})\n`);
  return makeJuliaScopeFunction(power, dist);
};
