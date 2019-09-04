import * as Easing from '../../utils/easing';
import { buildAnimationFromFolder } from '../../utils/mp4';

export const animateFunction = async (func, begin, end, easing, nbFrames, folder, outputPath, fps = 20) => {
  easing = easing || Easing.linear;
  const delta = end - begin;

  for (let i = 0; i < nbFrames; i++) {
    const value = easing(i / nbFrames);
    console.log('Rendering frame', i);
    await func(begin + value * delta, i);
  }

  await buildAnimationFromFolder(folder, outputPath, fps);
};
