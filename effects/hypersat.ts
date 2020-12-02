import { hslAdd } from '../utils/color';

export const applyHypersat = (input: Float32Array, width: number, height: number) => {
  return hslAdd(input, width, height, 0, 1);
};
