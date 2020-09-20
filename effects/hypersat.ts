import { hslAdd } from '../utils/color';
import { PlotBuffer } from '../utils/types';

export const applyHypersat = (input: PlotBuffer, width: number, height: number) => {
  return hslAdd(input, width, height, 0, 1);
};
