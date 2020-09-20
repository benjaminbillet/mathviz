import { randomInteger } from './random';

export const reservoirSampling = <T> (f: () => T, sampleOutput: T[], maxSamples: number) => {
  let count = 0;
  return () => {
    const next = f();
    count++;
    if (sampleOutput.length < maxSamples) {
      sampleOutput.push(next);
    } else {
      const r = randomInteger(0, count);
      if (r < sampleOutput.length) {
        sampleOutput[r] = next;
      }
    }
  };
};
