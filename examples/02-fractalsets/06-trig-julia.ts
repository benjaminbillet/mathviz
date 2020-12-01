import { buildConstrainedColorMap, makeColorMapFunction } from '../../utils/color';
import { mkdirs } from '../../utils/fs';
import { plotFunction } from '../util';
import { getPictureSize } from '../../utils/picture';
import { complex, ComplexNumber, sin } from '../../utils/complex';
import { zoomDomain } from '../../utils/domain';
import { MANDELBROT } from '../../utils/palette';
import { makeTrigJulia, TRIGJULIA_DOMAIN, makeStripeAverageTrigJuliaLinear } from '../../fractalsets/trigjulia';
import { PlotDomain } from '../../utils/types';


const OUTPUT_DIRECTORY = `${__dirname}/../../output/sinjulia`;
mkdirs(OUTPUT_DIRECTORY);


const colormap = buildConstrainedColorMap(
  MANDELBROT,
  [ 0, 0.16, 0.42, 0.6425, 0.8575, 1 ],
);
const colorfunc = makeColorMapFunction(colormap);

const size = 2048;


const plotSinJulia = (c: ComplexNumber, bailout: number, maxIterations: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredLemon = makeTrigJulia(c, sin, bailout, maxIterations);
  plotFunction(`${OUTPUT_DIRECTORY}/sin-julia-c=${c.re}+${c.im}i${suffix}.png`, width, height, configuredLemon, domain, colorfunc);
};

const plotAverageStripeSinJulia = (c: ComplexNumber, bailout: number, maxIterations: number, stripeDensity: number, domain: PlotDomain, suffix = '') => {
  const [ width, height ] = getPictureSize(size, domain);
  const configuredJulia = makeStripeAverageTrigJuliaLinear(c, sin, bailout, maxIterations, stripeDensity);
  plotFunction(`${OUTPUT_DIRECTORY}/sin-julia-c=${c.re}+${c.im}i${suffix}-stripe.png`, width, height, configuredJulia, domain, colorfunc);
};

plotSinJulia(complex(0.984808, 0.173648), 50, 50, TRIGJULIA_DOMAIN);
plotSinJulia(complex(1, 0.2), 50, 100, TRIGJULIA_DOMAIN);
plotSinJulia(complex(1, 0.5), 50, 50, TRIGJULIA_DOMAIN);
plotSinJulia(complex(1, 1), 50, 50, TRIGJULIA_DOMAIN);
plotSinJulia(complex(-1.29904, -0.75), 50, 50, TRIGJULIA_DOMAIN);
plotSinJulia(complex(1.87939, 0.68404), 50, 50, TRIGJULIA_DOMAIN);

plotAverageStripeSinJulia(complex(0.984808, 0.173648), 50, 500, 2, zoomDomain(TRIGJULIA_DOMAIN, 0, 0, 2));
plotAverageStripeSinJulia(complex(1, 0.2), 50, 500, 2, zoomDomain(TRIGJULIA_DOMAIN, 0, 0, 6));
plotAverageStripeSinJulia(complex(1, 0.5), 50, 500, 10, zoomDomain(TRIGJULIA_DOMAIN, 0, 0, 8));
plotAverageStripeSinJulia(complex(1, 1), 50, 50, 10, zoomDomain(TRIGJULIA_DOMAIN, 0, 0, 8));
plotAverageStripeSinJulia(complex(-1.29904, -0.75), 50, 500, 2, zoomDomain(TRIGJULIA_DOMAIN, 0, 0, 8));
plotAverageStripeSinJulia(complex(1.87939, 0.68404), 50, 500, 2, zoomDomain(TRIGJULIA_DOMAIN, 0, 0, 32));
