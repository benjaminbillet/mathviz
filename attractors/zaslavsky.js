import Complex from 'complex.js';
import math from '../utils/math';

// https://www.researchgate.net/publication/257481524_Aesthetic_Patterns_from_the_Perturbed_Orbits_of_Discrete_Dynamical_Systems
// https://hal.inria.fr/hal-01496082/document
// http://kgdawiec.bplaced.net/badania/pdf/isvc_2011.pdf

export const makeZaslavsky = (k, q) => {
  const alpha = 2 * Math.PI / q;
  const cosAlpha = math.cos(alpha);
  const sinAlpha = math.sin(alpha);
  return (z) => {
    const kSinY = k * math.sin(z.im);
    return new Complex((z.re + kSinY) * cosAlpha + z.im * sinAlpha, -(z.re + kSinY) * sinAlpha + z.im * cosAlpha);
  };
};