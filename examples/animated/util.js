import * as Easing from '../../utils/easing';
import { buildAnimationFromFolder } from '../../utils/mp4';
import { mkdirs } from '../../utils/fs';

export const animateFunction = async (func, begin, end, easing, nbFrames, outputFolder, animName, fps = 20, startAt = 0) => {
  easing = easing || Easing.linear;
  const delta = end - begin;

  const path = `${outputFolder}/${animName}`;
  mkdirs(path);

  for (let i = startAt; i < nbFrames; i++) {
    const value = easing(i / nbFrames);
    console.log('Rendering frame', i);
    await func(begin + value * delta, i, `${path}/frame-${i}.png`);
  }

  await buildAnimationFromFolder(path, `${outputFolder}/${animName}.mp4`, fps);
};
