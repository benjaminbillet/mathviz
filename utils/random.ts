import { complex } from './complex';
import { SQRT_TWO_PI } from './math';
import { RealToRealFunction, BiRealToRealFunction } from './types';

export const randomScalar = (min = -1, max = 1) => {
  return random() * (max - min) + min;
};
export const randomInteger = (min: number, max: number) => {
  return Math.floor(random() * (max - min) + min);
};
export const randomComplex = (reMin = -1, reMax = 1, imMin = -1, imMax = 1) => {
  return complex(randomScalar(reMin, reMax), randomScalar(imMin, imMax));
};
export const randomArray = (size: number, min = -1, max = 1) => {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = randomScalar(min, max);
  }
  return arr;
};
export const randomRgbColor = () => {
  return randomArray(3, 0, 255);
};

export const pickRandom = (arr: any[]) => {
  return arr[Math.trunc(random() * arr.length)];
};

export const pickRandomSubset = (nb: number, arr: any[]) => {
  return new Array(nb).fill(null).map(() => pickRandom(arr));
};

export const randomIntegerWeighted = (distribution: number[], min = 0) => {
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

export const randomUniform = () => {
  return () => random();
};
export const randomIntegerUniform = (min: number, max: number) => {
  return () => randomInteger(min, max);
};

// marsaglia polar method: https://en.wikipedia.org/wiki/Normal_distribution#Generating_values_from_normal_distribution
export const randomNormal = (mu = 0, sigma = 1) => {
  let u = null;
  let v = null;
  let s = null;
  return () => {
    // reuse one x every two random numbers
    if (u != null) {
      v = u;
      u = null;
    } else {
      do {
        u = random() * 2 - 1; // convert random() output to [-1, 1]
        v = random() * 2 - 1;
        s = u * u + v * v;
      } while (s >= 1);
    }
    return mu + sigma * v * Math.sqrt(-2 * Math.log(s) / s);
  };
};
export const randomIntegerNormal = (min: number, max: number, mu = 0, sigma = 1) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const normal = randomNormal(mu, sigma);
  for (let i = 0; i < length; i++) {
    weights[i] = normal() * normal();
  }
  return randomIntegerWeighted(weights, min);
};

export const randomLogNormal = (mu = 0, sigma = 1) => {
  const normal = randomNormal(mu, sigma);
  return () => Math.exp(normal());
};
export const randomIntegerLogNormal = (min: number, max: number, mu = undefined, sigma = undefined) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const logNormal = randomLogNormal(mu, sigma);
  for (let i = 0; i < length; i++) {
    weights[i] = logNormal();
  }
  return randomIntegerWeighted(weights, min);
};

export const randomExponential = (lambda = 1) => {
  return () => -Math.log(1 - random()) / lambda;
};
export const randomIntegerExponential = (min: number, max: number, lambda = 1) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const exponential = randomExponential(lambda);
  for (let i = 0; i < length; i++) {
    weights[i] = exponential();
  }
  return randomIntegerWeighted(weights, min);
};

export const randomBates = (n = 2) => {
  const irwinHall = randomIrwinHall(n);
  return () => irwinHall() / n;
};
export const randomIntegerBates = (min: number, max: number, n = 2) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const bates = randomBates(n);
  for (let i = 0; i < length; i++) {
    weights[i] = bates();
  }
  return randomIntegerWeighted(weights, min);
};

export const randomIrwinHall = (n = 2) => {
  return () => {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += random();
    }
    return sum;
  };
};
export const randomIntegerIrwinHall = (min: number, max: number, n = 2) => {
  const length = max - min;
  const weights = new Float32Array(length);
  const irwinHall = randomIrwinHall(n);
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

export const makeCumulative = (distribution: number[]) => {
  return distribution.reduce((result, x, i) => {
    if (i === 0) {
      result.push(x);
    } else {
      result.push(x + result[i - 1]);
    }
    return result;
  }, []);
};

export const makeGaussian = (sigma = 1, mu = 0): RealToRealFunction => {
  const twoSigmaSquared = 2 * sigma * sigma;
  const oneOverSqrtOfTwoPiSigma = 1 / (sigma * SQRT_TWO_PI);
  return (x) => {
    const d = Math.pow(x - mu, 2);
    return oneOverSqrtOfTwoPiSigma * Math.exp(-d / twoSigmaSquared);
  };
};

export const makeGaussian2d = (sigma = 1, xmu = 0, ymu = 0): BiRealToRealFunction => {
  const twoSigmaSquared = 2 * sigma * sigma;
  const oneOverTwoPiSigmaSquared = 1 / (twoSigmaSquared * Math.PI);
  return (x, y) => {
    const d = Math.pow(x - xmu, 2) + Math.pow(y - ymu, 2);
    return oneOverTwoPiSigmaSquared * Math.exp(-d / twoSigmaSquared);
  };
};

// https://github.com/bryc/code/blob/master/jshash/PRNGs.md

const xmur3 = (str: string) => {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return () => {
    h = Math.imul(h ^ h >>> 16, 2246822507);
    h = Math.imul(h ^ h >>> 13, 3266489909);
    return (h ^= h >>> 16) >>> 0;
  }
}

export const makeXoshiro128ss = (seed: string) => {
  const seedGen = xmur3(seed);
  let a = seedGen();
  let b = seedGen();
  let c = seedGen();
  let d = seedGen();
  return () => {
    var t = b << 9, r = a * 5; r = (r << 7 | r >>> 25) * 9;
    c ^= a; d ^= b;
    b ^= c; a ^= d; c ^= t;
    d = d << 11 | d >>> 21;
    return (r >>> 0) / 4294967296;
  }
}

// a global shared pseudo random generator
let prng = makeXoshiro128ss(new Date().toString())
export const random = () => {
  return prng();
};
export const setRandomSeed = (seed: string) => {
  prng = makeXoshiro128ss(seed);
};

export const DefaultNormalDistribution = randomNormal(0, 1);
export const DefaultUniformDistribution = randomUniform();
export const DefaultExponentialDistribution = randomExponential(1);
