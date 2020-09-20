import * as Easing from '../../utils/easing';
import { buildAnimationFromFolder } from '../../utils/mp4';
import { mkdirs } from '../../utils/fs';
import { EasingFunction, RenderFrameFunction } from '../../utils/types';

export const animateFunction = async (func: RenderFrameFunction, begin: number, end: number, easing: EasingFunction, nbFrames: number, outputFolder: string, animName: string, fps = 20, startAt = 0) => {
  easing = easing || Easing.linear;
  const delta = end - begin;

  const path = `${outputFolder}/${animName}`;
  mkdirs(path);

  for (let i = startAt; i < nbFrames; i++) {
    const value = easing(i / nbFrames);
    console.log('Rendering frame', i);
    await func(begin + value * delta, i, `${path}/frame-${i}.png`);
  }

  await buildAnimationFromFolder(path, `${path}.mp4`, fps);
};
