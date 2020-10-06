import { buildConstrainedColorMap, makeColorMapFunction } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { plotFunction } from './util';
import { readImage, getPictureSize } from '../utils/picture';
import { makeBitmapTrap } from '../fractalsets/trap';
import { complex, ComplexNumber } from '../utils/complex';
import { zoomDomain } from '../utils/domain';
import { BOAT, expandPalette } from '../utils/palette';
import { ComplexToComplexFunction, PlotDomain } from '../utils/types';
import { findRoots, makeNewton1, makeNewton2, NEWTON_DOMAIN } from '../root-finding-fractal/newton';

const OUTPUT_DIRECTORY = `${__dirname}/../output/newton`;
mkdirs(OUTPUT_DIRECTORY);


const size = 2048;


const buildColorFunction = (nbRoots: number) => {
  const colormap = buildConstrainedColorMap(
    [ [0,0,0], ...expandPalette(BOAT, nbRoots) ],
    [ 0, 0, ...new Array(nbRoots).fill(0).map((_, i) => (i + 1) / nbRoots) ],
  );
  return makeColorMapFunction(colormap, 255);
}


const plotNewton1 = async (f: ComplexToComplexFunction, fd: ComplexToComplexFunction, roots: ComplexNumber[], maxIterations: number, domain: PlotDomain, smooth = false, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredNewton = makeNewton1(f, fd, roots, maxIterations, 0.0001, smooth);
  await plotFunction(`${OUTPUT_DIRECTORY}/newton1${suffix}.png`, width, height, configuredNewton, domain, buildColorFunction(roots.length));
};

const plotNewton2 = async (f: ComplexToComplexFunction, roots: ComplexNumber[], maxIterations: number, domain: PlotDomain, smooth = false, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredNewton = makeNewton2(f, roots, maxIterations, 0.0001, smooth);
  await plotFunction(`${OUTPUT_DIRECTORY}/newton2${suffix}.png`, width, height, configuredNewton, domain, buildColorFunction(roots.length));
};

let f: ComplexToComplexFunction = z => z.powN(4).sub(1);
let roots = findRoots(f, 256, 256);
console.log(roots);

plotNewton1(f, z => z.powN(3).mul(4), roots, 20, NEWTON_DOMAIN, false, '-f=z^4-1');
plotNewton2(f, roots, 20, NEWTON_DOMAIN, false, '-f=z^4-1');

plotNewton2(f, roots, 20, NEWTON_DOMAIN, true, '-f=z^4-1-smooth');

f = z => z.powN(3).sub(1);
roots = findRoots(f, 256, 256);
console.log(roots);
plotNewton2(f, roots, 20, NEWTON_DOMAIN, true, '-z^3-1-smooth');

f = z => z.powN(3).sub(z.mul(2)).add(2);
roots = findRoots(f, 256, 256);
console.log(roots);
plotNewton2(f, roots, 20, NEWTON_DOMAIN, true, '-z^3-z^2+1-smooth');

f = z => z.powN(8).add(z.powN(4).mul(15)).sub(16);
roots = findRoots(f, 256, 256);
console.log(roots);
plotNewton2(f, roots, 20, NEWTON_DOMAIN, true, '-z^8+15z^4-16-smooth');

f = z => z.powN(6).add(z.powN(3)).sub(1);
roots = findRoots(f, 256, 256);
console.log(roots);
plotNewton2(f, roots, 20, NEWTON_DOMAIN, true, '-z^6+z^3-1-smooth');

f = z => z.sin();
roots = findRoots(f, 256, 256);
console.log(roots);
plotNewton2(f, roots, 100, zoomDomain(NEWTON_DOMAIN, Math.PI / 2, 0, 4), true, '-sin(z)-smooth');

f = z => z.cosh();
roots = findRoots(f, 256, 256);
console.log(roots);
plotNewton2(f, roots, 100, zoomDomain(NEWTON_DOMAIN, 0, 0, 4), true, '-cosh(z)-smooth');

