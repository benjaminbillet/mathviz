import { makeColorMapFunction, buildColorMap, buildConstrainedColorMap } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunctionClahe, downsampleImage, plotFunction } from './util';
import { getPictureSize } from '../utils/picture';
import { complex } from '../utils/complex';
import { CATERPILLAR } from '../utils/palette';
import { makeSecantSea, SECANT_SEA_DOMAIN } from '../fractalsets/secantsea';


const OUTPUT_DIRECTORY = `${__dirname}/../output/secant-sea`;
mkdirs(OUTPUT_DIRECTORY);

const colormap = buildConstrainedColorMap(
  [ [ 255, 255, 255 ], [ 0, 32, 60 ], [ 128, 0, 128 ], [ 175, 20, 25 ], [ 175, 20, 25 ] ],
  [ 0, 0.1, 0.14, 0.16, 1 ],
);
const colorfuncRaw = makeColorMapFunction(colormap, 255);
const colorfuncClahe = makeColorMapFunction(buildColorMap(CATERPILLAR), 255);

const size = 2048;
const supersamplingFactor = 5;


const plotSecantSea = async (c, bailout, maxIterations, doClahe, domain, suffix = '') => {
  const superSampledSize = size * supersamplingFactor;
  const [ superWidth, superHeight ] = getPictureSize(superSampledSize, domain);

  const rawPath = `${OUTPUT_DIRECTORY}/secantsea-c=${c.re}+${c.im}${suffix}.raw.png`;
  const sampledPath = `${rawPath.substring(0, rawPath.length - 8)}.sampled.png`;

  const configuredSecantSea = makeSecantSea(c, bailout, maxIterations);
  if (doClahe) {
    await plotFunctionClahe(rawPath, superWidth, superHeight, configuredSecantSea, domain, colorfuncClahe);
  } else {
    await plotFunction(rawPath, superWidth, superHeight, configuredSecantSea, domain, colorfuncRaw);
  }
  await downsampleImage(rawPath, sampledPath, supersamplingFactor);
};

plotSecantSea(complex(0.102, -0.04), 100, 100, false, SECANT_SEA_DOMAIN);
plotSecantSea(complex(1.098, 1.402), 100, 100, false, SECANT_SEA_DOMAIN);
plotSecantSea(complex(9.984, 7.55), 100, 100, false, SECANT_SEA_DOMAIN);
plotSecantSea(complex(0.662, 1.086), 100, 100, false, SECANT_SEA_DOMAIN);
plotSecantSea(complex(-0.354, 0.162), 100, 100, false, SECANT_SEA_DOMAIN);

plotSecantSea(complex(0.102, -0.04), 100, 100, true, SECANT_SEA_DOMAIN, '-clahe');
plotSecantSea(complex(1.098, 1.402), 100, 100, true, SECANT_SEA_DOMAIN, '-clahe');
plotSecantSea(complex(9.984, 7.55), 100, 100, true, SECANT_SEA_DOMAIN, '-clahe');
plotSecantSea(complex(0.662, 1.086), 100, 100, true, SECANT_SEA_DOMAIN, '-clahe');
plotSecantSea(complex(-0.354, 0.162), 100, 100, true, SECANT_SEA_DOMAIN, '-clahe');
