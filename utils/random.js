import * as D3Random from 'd3-random';
import { complex } from './complex';

export * from 'd3-random';

export const DefaultNormalDistribution = D3Random.randomNormal(0, 1);

export const randomScalar = (min = -1, max = 1) => {
  return random() * (max - min) + min;
};
export const randomInteger = (min, max) => {
  return Math.floor(random() * (max - min) + min);
};
export const randomComplex = (reMin = -1, reMax = 1, imMin = -1, imMax = 1) => {
  return complex(randomScalar(reMin, reMax), randomScalar(imMin, imMax));
};
export const randomArray = (size, min = -1, max = 1) => {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = randomScalar(min, max);
  }
  return arr;
};
export const randomRgbColor = () => {
  return randomArray(3, 0, 255);
};

export const pickRandom = (arr) => {
  return arr[Math.trunc(random() * arr.length)];
};

export const pickRandomSubset = (nb, arr) => {
  return new Array(nb).fill(null).map(() => pickRandom(arr));
};

export const randomIntegerUniform = (min, max) => {
  return () => randomInteger(min, max);
};

export const randomIntegerWeighted = (distribution, min = 0) => {
  const weightSum = distribution.reduce((result, x) => result + x, 0);
  return () => {
    const rand = random() * weightSum;
    let runningTotal = 0;
    for (let i = 0; i < distribution.length; i++) {
      runningTotal += distribution[i];
      if (rand <= runningTotal) {
        return i + min;
      }
    }
    console.warn('weighted distribution failed, fallbacking to uniform randomness');
    return Math.trunc(random() * distribution.length) + min;
  };
};

export const randomIntegerNormal = (min, max, mu = undefined, sigma = undefined) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const normal = D3Random.randomNormal(mu, sigma);
  for (let i = 0; i < length; i++) {
    weights[i] = normal() * normal();
  }
  return randomIntegerWeighted(weights, min);
};

export const randomIntegerLogNormal = (min, max, mu = undefined, sigma = undefined) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const logNormal = D3Random.randomLogNormal(mu, sigma);
  for (let i = 0; i < length; i++) {
    weights[i] = logNormal();
  }
  return randomIntegerWeighted(weights, min);
};

export const randomIntegerExponential = (min, max, lambda) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const exponential = D3Random.randomExponential(lambda);
  for (let i = 0; i < length; i++) {
    weights[i] = exponential();
  }
  return randomIntegerWeighted(weights, min);
};

export const randomIntegerBates = (min, max, n) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const bates = D3Random.randomBates(n);
  for (let i = 0; i < length; i++) {
    weights[i] = bates();
  }
  return randomIntegerWeighted(weights, min);
};

export const randomIntegerIrwinHall = (min, max, n) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const irwinHall = D3Random.randomIrwinHall(n);
  for (let i = 0; i < length; i++) {
    weights[i] = irwinHall();
  }
  return randomIntegerWeighted(weights, min);
};

export const binomial = (p = 0.5) => {
  if (random() < p) {
    return 0;
  }
  return 1;
};

export const makeCumulative = (distribution) => {
  return distribution.reduce((result, x, i) => {
    if (i === 0) {
      result.push(x);
    } else {
      result.push(x + result[i - 1]);
    }
    return result;
  }, []);
};

export const makeGaussian = (sigma = 1, mu = 0) => {
  const twoSigmaSquared = 2 * sigma * sigma;
  const oneOverSqrtOfTwoPiSigmaSquared = 1 / Math.sqrt(twoSigmaSquared * Math.PI);
  return (x) => {
    const d = Math.pow(x - mu, 2);
    return oneOverSqrtOfTwoPiSigmaSquared * Math.exp(-d / twoSigmaSquared);
  };
};

export const makeGaussian2d = (sigma = 1, xmu = 0, ymu = 0) => {
  const twoSigmaSquared = 2 * sigma * sigma;
  const oneOverTwoPiSigmaSquared = 1 / (twoSigmaSquared * Math.PI);
  return (x, y) => {
    const d = Math.pow(x - xmu, 2) + Math.pow(y - ymu, 2);
    return oneOverTwoPiSigmaSquared * Math.exp(-d / twoSigmaSquared);
  };
};

// a fast, seedable and not-that-bad PRNG
export const makeMulberry32 = (seed) => {
  return () => {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
};

// a global shared mulberry32 generator
let randomState = new Date().getTime();
export const random = () => {
  let t = (randomState += 0x6D2B79F5);
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
export const setRandomSeed = (seed) => {
  randomState = seed;
};
