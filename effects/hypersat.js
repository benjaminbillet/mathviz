import { hslAdd } from '../utils/color';

export const applyHypersat = (input, width, height) => {
  return hslAdd(input, width, height, 0, 1);
};
