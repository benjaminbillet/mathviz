import { randomScalar, random, setRandomSeed } from '../utils/random';
import { saveImageBuffer } from '../utils/picture';
import { SIERRA } from '../utils/palette';
import { BLACK, WHITE } from '../utils/color';
import { TWO_PI } from '../utils/math';
import { mkdirs } from '../utils/fs';

const OUTPUT_DIRECTORY = `${__dirname}/../output/orbital`;
mkdirs(OUTPUT_DIRECTORY);


const makeBufferPlotter = (buffer, width, height) => {
  return (x, y, color, alpha) => {
    const idx = (Math.trunc(x) + Math.trunc(y) * width) * 4;
    const revAlpha = 1 - alpha;
    buffer[idx + 0] = (buffer[idx + 0] * revAlpha + color[0] * alpha);
    buffer[idx + 1] = (buffer[idx + 1] * revAlpha + color[1] * alpha);
    buffer[idx + 2] = (buffer[idx + 2] * revAlpha + color[2] * alpha);
  };
};


// draws itself with a y-axis symmetry
// high-range of speed and low decay, can reach any part of the picture
// often converges to rings
const makeParticle1 = (width, height, initialTheta, plotter, palette) => {
  let x;
  let y;
  let speed;
  let speedDecay;
  let theta;
  let thetaDecay;
  let thetaDecayDecay;
  let iterations = 0;
  let color1;
  let color2;
  return () => {
    // reset particles that leave the screen too much
    if (iterations === 0 || (x < -width) || (x > width * 2) || (y < -height) || (y > height * 2)) {
      x = width / 2;
      y = height / 2;
      speed = randomScalar(2, 32);
      speedDecay = randomScalar(0.0001, 0.001);

      // rotation
      theta = Math.min(Math.abs(initialTheta + randomScalar(-0.1, 0.1)), TWO_PI);
      thetaDecay = 0;
      thetaDecayDecay = randomScalar(0.001, 0.1);
      if (random() > 0.5) {
        thetaDecayDecay = -1 * thetaDecayDecay;
      }

      // color is determined by direction of movement
      const colorIdx = Math.trunc((palette.length - 1) * theta / TWO_PI);
      color1 = palette[colorIdx];
      color2 = palette[palette.length - colorIdx - 1];
    }

    // draw particle and anti-particle (y-symmetry)
    plotter(x, y, color1, 0.16);
    plotter(width - x, y, color2, 0.16);

    // move and rotate
    x += speed * Math.sin(theta);
    y += speed * Math.cos(theta);
    theta += thetaDecay;

    // update spin and speed
    thetaDecay += thetaDecayDecay;
    speed -= speedDecay;

    iterations++;
  };
};

// black particule
// draws itself with a y-axis symmetry
// sometimes accelerate in the reverse direction with large speed decay
const makeParticle2 = (width, height, initialTheta, plotter) => {
  let x;
  let y;
  let speed;
  let speedDecay;
  let theta;
  let thetaDecay;
  let thetaDecayDecay;
  let iterations = 0;
  return () => {
    // reset particles that leave the screen too much
    if (iterations === 0 || (x < -width) || (x > width * 2) || (y < -height) || (y > height * 2)) {
      x = width / 2;
      y = height / 2;
      theta = initialTheta + randomScalar(-0.11, 0.11);
      speed = randomScalar(0.5, 3);

      speedDecay = randomScalar(0.996, 1.001);
      thetaDecay = 0;
      thetaDecayDecay = randomScalar(0.00001, 0.001);
      if (random() > 0.5) {
        thetaDecayDecay = -1 * thetaDecayDecay;
      }
    }

    // draw particle and anti-particle (y-symmetry)
    plotter(x, y, BLACK, 0.13);
    plotter(width - x, y, BLACK, 0.13);

    // move and rotate
    x += speed * Math.sin(theta);
    y += speed * Math.cos(theta);
    theta += thetaDecay;

    // update spin and speed
    thetaDecay += thetaDecayDecay;
    speed *= speedDecay;
    if (random() > 0.997) {
      speed *= -1;
      speedDecay = 2 - speedDecay;
    }

    iterations++;
  };
};

// move freely in any direction
// when they don't leave the area they tend to stabilize into perfect circular orbits
// have 30% percent chance to be resetted
// draw slight emboss
const makeParticle3 = (width, height, plotter) => {
  let x;
  let y;
  let speed;
  let speedDecay;
  let theta;
  let thetaDecay;
  let thetaDecayDecay;
  let iterations = 0;
  return () => {
    // reset particles that leave the screen too much
    if (iterations === 0 || (x < -width) || (x > width * 2) || (y < -height) || (y > height * 2)) {
      x = width / 2;
      y = height / 2;
      theta = randomScalar(0, TWO_PI);
      speed = randomScalar(0.5, 3.5);

      speedDecay = randomScalar(0.996, 1.001);
      thetaDecay = 0;
      thetaDecayDecay = randomScalar(0.00001, 0.001);
      if (random() > 0.5) {
        thetaDecayDecay = -1 * thetaDecayDecay;
      }
    }

    // draw highlight/shadow emboss
    plotter(x, y - 1, WHITE, 0.11);
    plotter(x, y + 1, BLACK, 0.11);

    // move and rotate
    x += speed * Math.sin(theta);
    y += speed * Math.cos(theta);
    theta += thetaDecay;

    // update spin and speed
    thetaDecay += thetaDecayDecay;
    speed *= speedDecay;
    if (random() > 0.997) {
      speedDecay = 1;
      thetaDecayDecay = 0.00001;
      if (random() > 0.7) {
        iterations = -1; // reset
      }
    }

    iterations++;
  };
};

// move freely in any direction
// quick to stabilize into a single pixel,
// have 70% percent chance to be resetted
// draw thick emboss
const makeParticle4 = (width, height, plotter) => {
  let x;
  let y;
  let speed;
  let speedDecay;
  let theta;
  let thetaDecay;
  let thetaDecayDecay;
  let iterations = 0;
  const gray = [ 16, 16, 16 ];
  return () => {
    // reset particles that leave the screen too much
    if (iterations === 0 || (x < -width) || (x > width * 2) || (y < -height) || (y > height * 2)) {
      x = width / 2;
      y = height / 2;
      theta = randomScalar(0, TWO_PI);
      speed = randomScalar(1, 6);

      speedDecay = randomScalar(0.998, 1.000);
      thetaDecay = 0;
      thetaDecayDecay = randomScalar(0.00001, 0.001);
      if (random() > 0.5) {
        thetaDecayDecay = -1 * thetaDecayDecay;
      }
    }

    // draw particle (high contrast)
    plotter(x, y, gray, 0.59);

    // draw highlight/shadow emboss
    for (let dy = 1; dy < 5; dy++) {
      plotter(x, y - dy, WHITE, (30 - dy * 6) / 255);
      plotter(x, y + dy, BLACK, (30 - dy * 6) / 255);
    }

    // move and rotate
    x += speed * Math.sin(theta);
    y += speed * Math.cos(theta);
    theta += thetaDecay;

    // update spin and speed
    thetaDecay += thetaDecayDecay;
    speed *= speedDecay;
    speedDecay *= 0.9999;
    if (random() > 0.996) {
      speed *= -1; // reverse orbit
      speedDecay = 2 - speedDecay;
      if (random() > 0.3) {
        iterations = -1; // reset
      }
    }

    iterations++;
  };
};

const run = async (path, width, height, seed = 100, nbIterations = 5000, palette = SIERRA) => {
  setRandomSeed(seed);

  const buffer = new Float32Array(width * height * 4).fill(255);
  const plotter = makeBufferPlotter(buffer, width, height);

  const initialTheta = randomScalar(0, TWO_PI);

  const allParticles = [].concat(
    new Array(1800).fill(null).map(() => makeParticle1(width, height, initialTheta, plotter, palette)),
    new Array(1300).fill(null).map(() => makeParticle2(width, height, initialTheta, plotter)),
    new Array(1000).fill(null).map(() => makeParticle3(width, height, plotter)),
    new Array(100).fill(null).map(() => makeParticle4(width, height, plotter)),
  );

  // iterate all particles
  for (let i = 0; i < nbIterations; i++) {
    allParticles.forEach(p => p());
  }

  await saveImageBuffer(buffer, width, height, path);
};

run(`${OUTPUT_DIRECTORY}/orbital1.png`, 1024, 1024, 100);
run(`${OUTPUT_DIRECTORY}/orbital2.png`, 1024, 1024, 1100);
run(`${OUTPUT_DIRECTORY}/orbital3.png`, 1024, 1024, 1400);
run(`${OUTPUT_DIRECTORY}/orbital4.png`, 1024, 1024, 4000);
