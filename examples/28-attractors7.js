import { mkdirs } from '../utils/fs';
import { plotAutoscaledAttractor } from './util';
import { complex } from '../utils/complex';
import { MAVERICK } from '../utils/palette';
import { makeZaslavsky } from '../attractors/zaslavsky';
import { makeKrasnoselskijPerturbatedIterator } from '../attractors/perturbation';

const OUTPUT_DIRECTORY = `${__dirname}/../output/attractors`;
mkdirs(OUTPUT_DIRECTORY);

const nbIterations = 10000000;
const initialPointPicker = () => complex(1, 1);

// regular zaslavsky function
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky1.png`, 2048, 2048, makeZaslavsky(4, 7), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky2.png`, 2048, 2048, makeZaslavsky(3, 5), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky3.png`, 2048, 2048, makeZaslavsky(2, -10), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky4.png`, 2048, 2048, makeZaslavsky(-7, 7), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky5.png`, 2048, 2048, makeZaslavsky(-4, 7), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky6.png`, 2048, 2048, makeZaslavsky(5, 5), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky7.png`, 2048, 2048, makeZaslavsky(6, -9), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky8.png`, 2048, 2048, makeZaslavsky(-3, 8), initialPointPicker, MAVERICK, nbIterations, nbIterations);


// a simple perturbation function
const makePerturbator = (n = 500) => {
  let callCounter = 0;
  return (z) => {
    callCounter++;
    if (callCounter === n) { // every n iterations, we slightly perturbate the system
      callCounter = 0;
      return complex(z.re + 1, z.im + 0.5);
    }
    return z;
  };
};

// we change the behavior of the zaslavsky function by wrapping it into a perturbated Krasnoselskij
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky-perturbated1.png`, 2048, 2048, makeKrasnoselskijPerturbatedIterator(makeZaslavsky(-60, -38), makePerturbator(), 0.615), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky-perturbated2.png`, 2048, 2048, makeKrasnoselskijPerturbatedIterator(makeZaslavsky(3, 5), makePerturbator(), 0), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky-perturbated3.png`, 2048, 2048, makeKrasnoselskijPerturbatedIterator(makeZaslavsky(77, 10), makePerturbator(), 0.5), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky-perturbated4.png`, 2048, 2048, makeKrasnoselskijPerturbatedIterator(makeZaslavsky(-9.72, 0.16), makePerturbator(), 0.15749471355229616), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky-perturbated5.png`, 2048, 2048, makeKrasnoselskijPerturbatedIterator(makeZaslavsky(2.37, -0.07), makePerturbator(), 0.088), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky-perturbated6.png`, 2048, 2048, makeKrasnoselskijPerturbatedIterator(makeZaslavsky(0.73, 7.01), makePerturbator(), 0.89), initialPointPicker, MAVERICK, nbIterations, nbIterations);
plotAutoscaledAttractor(`${OUTPUT_DIRECTORY}/zaslavsky-perturbated7.png`, 2048, 2048, makeKrasnoselskijPerturbatedIterator(makeZaslavsky(0.24, 7.46), makePerturbator(), 0.53), initialPointPicker, MAVERICK, nbIterations, nbIterations);
