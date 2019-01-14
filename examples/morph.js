import { saveImageBuffer, readImage, normalizeBuffer } from '../utils/picture';
import { convertUnitToRGBA } from '../utils/color';
import { applyBinaryMap } from '../effects/binaryMap';
import { dilate, erode, boundary, iterativeThinning, closing, opening } from '../utils/binarymorph';

const runMorphs = async (sourcePath) => {
  const image = await readImage(sourcePath);
  const width = image.getWidth();
  const height = image.getHeight();
  let input = image.getImage().data;

  // create a normalized copy of the input image
  input = new Float32Array(input);
  normalizeBuffer(input, width, height);

  // convert to binary image
  input = applyBinaryMap(input, width, height);

  await saveImageBuffer(convertUnitToRGBA(input), width, height, 'morph-binary.png');

  let output = dilate(input, new Uint8Array(width * height * 4), width, height);
  await saveImageBuffer(convertUnitToRGBA(output), width, height, 'morph-dilate.png');

  output = erode(input, new Uint8Array(width * height * 4), width, height);
  await saveImageBuffer(convertUnitToRGBA(output), width, height, 'morph-erode.png');

  output = closing(input, new Uint8Array(width * height * 4), width, height);
  await saveImageBuffer(convertUnitToRGBA(output), width, height, 'morph-closing.png');

  output = opening(input, new Uint8Array(width * height * 4), width, height);
  await saveImageBuffer(convertUnitToRGBA(output), width, height, 'morph-opening.png');

  output = boundary(input, new Uint8Array(width * height * 4), width, height);
  await saveImageBuffer(convertUnitToRGBA(output), width, height, 'morph-boundary.png');

  output = iterativeThinning(input, new Uint8Array(width * height * 4), width, height);
  await saveImageBuffer(convertUnitToRGBA(output), width, height, 'morph-thinning.png');
};

runMorphs(`${__dirname}/ada.png`);
