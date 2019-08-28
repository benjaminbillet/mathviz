import { saveImageBuffer, readImage } from '../utils/picture';
import { convertUnitToRGBA } from '../utils/color';
import { mkdirs } from '../utils/fs';
import { blendAdd, blendSubstract, blendMultiply, blendDivide, blendDifference, blendExclusion, blendScreen, blendOverlay, blendHardLight, blendSoftLight, blendVividLight, blendPinLight, blendLighten, blendDarken, blendAverage, blendColorDodge, blendLinearDodge, blendColorBurn, blendLinearBurn, blendPhoenix, blendNegation, blendReflect, blendHue, blendSaturation, blendLuminosity, blendColor } from '../utils/blend';

const sourcePath1 = `${__dirname}/ada-big.png`;
const sourcePath2 = `${__dirname}/clouds.png`;

const applyBlend = async (blendFunc, outputPath) => {
  const image1 = await readImage(sourcePath1, 255);
  const image2 = await readImage(sourcePath2, 255);

  if (image1.width !== image2.width || image1.height !== image2.height) {
    throw new Error('Incompatible image size');
  }

  const output = convertUnitToRGBA(blendFunc(image1.buffer, image2.buffer));
  await saveImageBuffer(output, image1.width, image1.height, outputPath);
};

const OUTPUT_DIRECTORY = `${__dirname}/../output/blend`;
mkdirs(OUTPUT_DIRECTORY);


applyBlend(blendAdd, `${OUTPUT_DIRECTORY}/blend-add.png`);
applyBlend(blendSubstract, `${OUTPUT_DIRECTORY}/blend-substract.png`);
applyBlend(blendMultiply, `${OUTPUT_DIRECTORY}/blend-multiply.png`);
applyBlend(blendDivide, `${OUTPUT_DIRECTORY}/blend-divide.png`);
applyBlend(blendDifference, `${OUTPUT_DIRECTORY}/blend-difference.png`);
applyBlend(blendExclusion, `${OUTPUT_DIRECTORY}/blend-exclusion.png`);
applyBlend(blendScreen, `${OUTPUT_DIRECTORY}/blend-screen.png`);
applyBlend(blendOverlay, `${OUTPUT_DIRECTORY}/blend-overlay.png`);
applyBlend(blendHardLight, `${OUTPUT_DIRECTORY}/blend-hardlight.png`);
applyBlend(blendSoftLight, `${OUTPUT_DIRECTORY}/blend-softlight.png`);
applyBlend(blendVividLight, `${OUTPUT_DIRECTORY}/blend-vividlight.png`);
applyBlend(blendPinLight, `${OUTPUT_DIRECTORY}/blend-pinlight.png`);
applyBlend(blendLighten, `${OUTPUT_DIRECTORY}/blend-lighten.png`);
applyBlend(blendDarken, `${OUTPUT_DIRECTORY}/blend-darken.png`);
applyBlend(blendAverage, `${OUTPUT_DIRECTORY}/blend-average.png`);
applyBlend(blendColorDodge, `${OUTPUT_DIRECTORY}/blend-colordodge.png`);
applyBlend(blendLinearDodge, `${OUTPUT_DIRECTORY}/blend-lineardodge.png`);
applyBlend(blendColorBurn, `${OUTPUT_DIRECTORY}/blend-colorburn.png`);
applyBlend(blendLinearBurn, `${OUTPUT_DIRECTORY}/blend-linearburn.png`);
applyBlend(blendPhoenix, `${OUTPUT_DIRECTORY}/blend-phoenix.png`);
applyBlend(blendNegation, `${OUTPUT_DIRECTORY}/blend-negation.png`);
applyBlend(blendReflect, `${OUTPUT_DIRECTORY}/blend-reflect.png`);
applyBlend(blendHue, `${OUTPUT_DIRECTORY}/blend-hue.png`);
applyBlend(blendSaturation, `${OUTPUT_DIRECTORY}/blend-saturation.png`);
applyBlend(blendLuminosity, `${OUTPUT_DIRECTORY}/blend-luminosity.png`);
applyBlend(blendColor, `${OUTPUT_DIRECTORY}/blend-color.png`);
