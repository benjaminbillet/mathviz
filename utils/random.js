import { complex } from './complex';

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

export const randomUniform = () => {
  return () => random();
};
export const randomIntegerUniform = (min, max) => {
  return () => randomInteger(min, max);
};

// marsaglia polar method: https://en.wikipedia.org/wiki/Normal_distribution#Generating_values_from_normal_distribution
export const randomNormal = (mu = 0, sigma = 1) => {
  let u;
  let v;
  let s;
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
export const randomIntegerNormal = (min, max, mu = 0, sigma = 1) => {
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
export const randomIntegerLogNormal = (min, max, mu = undefined, sigma = undefined) => {
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
export const randomIntegerExponential = (min, max, lambda = 1) => {
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
  return () => irwinHall / n;
};
export const randomIntegerBates = (min, max, n = 2) => {
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
export const randomIntegerIrwinHall = (min, max, n = 2) => {
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
  if (Number.isNaN(randomState) || Number.isFinite(randomState) === false) {
    throw new Error('PRNG state diverged');
  }
  let t = (randomState += 0x6D2B79F5);
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
export const setRandomSeed = (seed) => {
  randomState = seed;
};


export const DefaultNormalDistribution = randomNormal(0, 1);
export const DefaultUniformDistribution = randomUniform();
export const DefaultExponentialDistribution = randomExponential(1);
