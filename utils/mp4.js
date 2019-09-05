import fs from 'fs';
import { Converter } from 'ffmpeg-stream';
import { saveImageBuffer } from './picture';
import { mkdirs } from './fs';

export const buildAnimationAccumulator = (path, width, height, fps = 20, overwrite = false) => {
  const tmpFolder = `${path}.tmp`;
  mkdirs(tmpFolder);

  const conv = new Converter(); // create converter
  const input = conv.input({ f: 'image2pipe', r: fps }); // create input writable stream
  conv.output(path, { vcodec: 'libx264', pix_fmt: 'yuv420p' }); // output to file

  const promises = [];
  let i = 0;

  return {
    accumulate: async (frame) => {
      const frameFile = `${tmpFolder}/frame-${i}.png`;
      if (overwrite || fs.existsSync(file) === false) {
        await saveImageBuffer(frame, width, height, frameFile);
      }

      promises.push(() => new Promise((fulfill, reject) => {
        fs.createReadStream(framFile)
          .on('end', fulfill) // fulfill promise on frame end
          .on('error', reject) // reject promise on error
          .pipe(input, { end: false }); // pipe to converter, but don't end the input yet
      }));

      i++;
    },
    finish: async () => {
      const composed = promises.reduce((prev, next) => prev.then(next), Promise.resolve());
      composed.then(() => input.end());
      await conv.run();
    },
  };
};

export const buildAnimationFromFolder = async (folder, outputPath, fps = 20) => {
  const conv = new Converter(); // create converter
  const input = conv.input({ f: 'image2pipe', r: fps }); // create input writable stream
  conv.output(outputPath, { vcodec: 'libx264', pix_fmt: 'yuv420p' }); // output to file

  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
  }

  const promises = [];
  let i = 0;
  while (true) {
    const file = `${folder}/frame-${i}.png`;
    if (fs.existsSync(file) === false) {
      break;
    }
    promises.push(() => new Promise((fulfill, reject) => {
      fs.createReadStream(file)
        .on('end', fulfill) // fulfill promise on frame end
        .on('error', reject) // reject promise on error
        .pipe(input, { end: false }); // pipe to converter, but don't end the input yet
    }));
    i++;
  }
  // reduce into a single promise, run sequentially
  const composed = promises.reduce((prev, next) => prev.then(next), Promise.resolve());
  composed.then(() => input.end());

  await conv.run();
};
