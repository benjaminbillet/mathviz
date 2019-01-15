import { saveImageBuffer } from '../utils/picture';
import { convertUnitToRGBA } from '../utils/color';
import { makeCubicBezier } from '../utils/curve';
import { complex } from '../utils/complex';
import { drawBresenhamLine } from '../utils/bresenham';

const run = async () => {
  const width = 500;
  const height = 500;
  const input = new Float32Array(width * height * 4);

  const plot = (x, y) => {
    const idx = (Math.round(x) + Math.round(y) * width) * 4;
    input[idx + 0] = 1;
    input[idx + 1] = 1;
    input[idx + 2] = 1;
  };

  const bezier = makeCubicBezier(complex(50, 10), complex(10, 50), complex(150, 200), complex(50, 300));
  for (let i = 0; i < 1; i += 0.1) {
    point = bezier(i);
    plot(point.re, point.im);
  };

  const bezier2 = makeCubicBezier(complex(150, 10), complex(110, 50), complex(250, 200), complex(150, 300));
  let previousPoint = null;
  let point = null;
  for (let i = 0; i < 1; i += 0.1) {
    point = bezier2(i);
    if (previousPoint != null) {
      drawBresenhamLine(previousPoint.re, previousPoint.im, point.re, point.im, plot);
    }
    previousPoint = point;
  };

  await saveImageBuffer(convertUnitToRGBA(input), width, height, 'bezier.png');
};

run();
