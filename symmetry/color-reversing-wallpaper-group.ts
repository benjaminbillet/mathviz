import { applyInvert } from '../effects/invert';
import { applyTransform } from '../effects/transform';
import { makeAffine2dFromMatrix, rotate } from '../utils/affine';
import { convertUnitToRGBA } from '../utils/color';
import { ComplexNumber } from '../utils/complex';
import { downscale2 } from '../utils/downscale';
import { readImage, saveImageBuffer } from '../utils/picture';
import { ComplexToComplexFunction, PlotBuffer } from '../utils/types';
import { makeCnm, makeEnmGenericLattice, makeSnm, makeTnm, makeWnm } from './wallpaper-group';

export const saveInvertCollageHorizontal = async (inputPath: string, outputPath: string, stripe = true) => {
  const picture = await readImage(inputPath, 255);
  const width = picture.width;
  const height = picture.height;
  const bitmap = picture.buffer;

  const output = makeInvertCollageHorizontal(bitmap, width, height, stripe);
  await saveImageBuffer(convertUnitToRGBA(output), width, height, outputPath);
}

export const makeInvertCollageHorizontal = (bitmap: PlotBuffer, width: number, height: number, stripe = true): PlotBuffer => {
  let stripeSize = Math.trunc(width * 2 / 50)
  if (stripe === false) {
    stripeSize = 0;
  }
  const inverted = applyTransform(applyInvert(bitmap, width, height), width, height, makeAffine2dFromMatrix(rotate(Math.PI)));

  const newWidth = stripeSize + width * 2;

  let output: PlotBuffer = new Float32Array(newWidth * height * 4);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const srcIdx = (i + j * width) * 4;

      const destIdx1 = (i + j * newWidth) * 4;
      output[destIdx1 + 0] = bitmap[srcIdx + 0];
      output[destIdx1 + 1] = bitmap[srcIdx + 1];
      output[destIdx1 + 2] = bitmap[srcIdx + 2];
      output[destIdx1 + 3] = 1;

      const destIdx2 = (i + width + stripeSize + j * newWidth) * 4;
      output[destIdx2 + 0] = inverted[srcIdx + 0];
      output[destIdx2 + 1] = inverted[srcIdx + 1];
      output[destIdx2 + 2] = inverted[srcIdx + 2];
      output[destIdx2 + 3] = 1;
    }
  }

  output = downscale2(output, newWidth, height, width, height);
  return output;
}

const makeInvertCollageVertical = (bitmap: PlotBuffer, width: number, height: number) => {
  const inverted = applyTransform(applyInvert(bitmap, width, height), width, height, makeAffine2dFromMatrix(rotate(Math.PI)));

  const output = new Float32Array(width * height * 2 * 4);
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const srcIdx = (i + j * width) * 4;

      const destIdx1 = (i + j * width) * 4;
      output[destIdx1 + 0] = bitmap[srcIdx + 0];
      output[destIdx1 + 1] = bitmap[srcIdx + 1];
      output[destIdx1 + 2] = bitmap[srcIdx + 2];
      output[destIdx1 + 3] = 1;

      const destIdx2 = (width * height + i + j * width) * 4;
      output[destIdx2 + 0] = inverted[srcIdx + 0];
      output[destIdx2 + 1] = inverted[srcIdx + 1];
      output[destIdx2 + 2] = inverted[srcIdx + 2];
      output[destIdx2 + 3] = 1;
    }
  }

  return output;
}

type Term = { f: ComplexToComplexFunction, a: ComplexNumber }
const buildWallpaperFunction = (terms: Term[]): ComplexToComplexFunction => {
  return (z) => {
    let result = new ComplexNumber(0, 0);
    terms.forEach(term => {
      const tmp = term.f(z).mul(term.a);
      result = result.add(tmp, result);
    });
    return result;
  };
};

const checkParams = (nValues: number[], mValues: number[], aValues: ComplexNumber[], checkOddN = false, checkOddM = false, checkOddNM = false) => {
  if (nValues.length != mValues.length) {
    throw new Error('nValues.length != mValues.length');
  }
  if (nValues.length != aValues.length) {
    throw new Error('nValues.length != aValues.length');
  }
  if (checkOddNM) {
    nValues.forEach((n, i) => {
      if ((n + mValues[i]) % 2 === 0) {
        throw new Error('n+m must be odd');
      }
    });
  } else if (checkOddN) {
    nValues.forEach((n, i) => {
      if (n % 2 === 0) {
        throw new Error('n must be odd');
      }
    });
  } else if (checkOddM) {
    mValues.forEach((m, i) => {
      if (m % 2 === 0) {
        throw new Error('m must be odd');
      }
    });
  }
}

export const makeP1P1WallpaperFunction = (xi: number, eta: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeEnmGenericLattice(xi, eta, n, m), a });
  });
  return buildWallpaperFunction(terms);
};


export const makeP2P1WallpaperFunction = (xi: number, eta: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeEnmGenericLattice(xi, eta, n, m), a });
    terms.push({ f: makeEnmGenericLattice(xi, eta, -n, -m), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makeP2P2WallpaperFunction = (xi: number, eta: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeEnmGenericLattice(xi, eta, n, m), a });
    terms.push({ f: makeEnmGenericLattice(xi, eta, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePGP1WallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(-Math.pow(-1, m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makePMP1WallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makePGPGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makePMPGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMPGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(-Math.pow(-1, m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makePMGPGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, -m), a: a.negative() });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makePGGPGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, -m), a: a.negative() });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, n + m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makePMPM1WallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMPM2WallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMPMWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMMPMWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a });
    terms.push({ f: makeTnm(l, -n, -m), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makePMGPMWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(-Math.pow(-1, m)) });
    terms.push({ f: makeTnm(l, -n, -m), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMP1WallpaperFunction = (b: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeCnm(b, n, m), a });
    terms.push({ f: makeCnm(b, m, n), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMMP2WallpaperFunction = (b: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeCnm(b, n, m), a });
    terms.push({ f: makeCnm(b, m, n), a: a.negative() });
    terms.push({ f: makeCnm(b, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMCMWallpaperFunction = (b: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeCnm(b, n, m), a });
    terms.push({ f: makeCnm(b, m, n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMMCMWallpaperFunction = (b: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeCnm(b, n, m), a });
    terms.push({ f: makeCnm(b, m, n), a: a.negative() });
    terms.push({ f: makeCnm(b, -n, -m), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makePMMCMMWallpaperFunction = (b: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeCnm(b, n, m), a });
    terms.push({ f: makeCnm(b, m, n), a });
    terms.push({ f: makeCnm(b, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMMP2WallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.negative() });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMGP2WallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, m, n), a: a.mul(-Math.pow(-1, m)) });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePGGP2WallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, m, n), a: a.mul(-Math.pow(-1, n + m)) });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMMPMMWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMMPMMWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMMPMGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, m)) });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMGPMGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, m)) });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMMPMGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, m)) });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makePMGPGGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, n + m)) });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeCMMPGGWallpaperFunction = (l: number, nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeTnm(l, n, m), a });
    terms.push({ f: makeTnm(l, -n, m), a: a.mul(Math.pow(-1, n + m)) });
    terms.push({ f: makeTnm(l, -n, -m), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4P2WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4MPMMWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a: a.negative() });
    terms.push({ f: makeSnm(m, n), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4GPGGWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a: a.negative() });
    terms.push({ f: makeSnm(m, n), a: a.mul(-Math.pow(-1, n + m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4MCMMWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a: a.negative() });
    terms.push({ f: makeSnm(m, n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4GCMMWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a: a.negative() });
    terms.push({ f: makeSnm(m, n), a: a.mul(Math.pow(-1, n + m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4P4WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4MP4WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a });
    terms.push({ f: makeSnm(m, n), a: a.negative() });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4GP4WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a });
    terms.push({ f: makeSnm(m, n), a: a.mul(-Math.pow(-1, n + m)) });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4MP4MWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a });
    terms.push({ f: makeSnm(m, n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP4MP4GWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues, false, false, true);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeSnm(n, m), a });
    terms.push({ f: makeSnm(-m, n), a });
    terms.push({ f: makeSnm(m, n), a: a.mul(Math.pow(-1, n + m)) });
  });
  return buildWallpaperFunction(terms);
};

















export const makeP31MP3WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(m, n), a: a.negative() });
    terms.push({ f: makeWnm(m, -(n + m)), a });
    terms.push({ f: makeWnm(-(n + m), n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP3M1P3WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(-m, -n), a: a.negative() });
    terms.push({ f: makeWnm(m, -(n + m)), a });
    terms.push({ f: makeWnm(-(n + m), n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP6P3WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(-n, -m), a: a.negative() });
    terms.push({ f: makeWnm(m, -(n + m)), a });
    terms.push({ f: makeWnm(-(n + m), n), a });
  });
  return buildWallpaperFunction(terms);
};




export const makeP6P31MWallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(m, n), a });
    terms.push({ f: makeWnm(-n, -m), a: a.negative() });
    terms.push({ f: makeWnm(m, -(n + m)), a });
    terms.push({ f: makeWnm(-(n + m), n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP6MP3M1WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(-m, -n), a });
    terms.push({ f: makeWnm(-n, -m), a: a.negative() });
    terms.push({ f: makeWnm(m, -(n + m)), a });
    terms.push({ f: makeWnm(-(n + m), n), a });
  });
  return buildWallpaperFunction(terms);
};

export const makeP6MP6WallpaperFunction = (nValues: number[], mValues: number[], aValues: ComplexNumber[]): ComplexToComplexFunction => {
  checkParams(nValues, mValues, aValues);
  const terms: Term[] = [];
  nValues.forEach((n, i) => {
    const m = mValues[i];
    const a = aValues[i];
    terms.push({ f: makeWnm(n, m), a });
    terms.push({ f: makeWnm(-n, -m), a });
    terms.push({ f: makeWnm(m, n), a: a.negative() });
    terms.push({ f: makeWnm(m, -(n + m)), a });
    terms.push({ f: makeWnm(-(n + m), n), a });
  });
  return buildWallpaperFunction(terms);
};