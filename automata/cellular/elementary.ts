import { clamp } from '../../utils/misc';
import { Next1dCellStateFunction } from '../../utils/types';

export const buildElementaryRulesFromWolfranRuleCode = (wolframRuleCode: number): number[] => {
  wolframRuleCode = clamp(wolframRuleCode, 0, 255);
  return Array.from(wolframRuleCode.toString(2).padStart(8, '0')).map(x => parseInt(x));
};

export const makeElementaryNextState = (rules: number[]): Next1dCellStateFunction => {
  return (stateLine, lineWidth, currentState, x) => {
    const b2 = x > 0 ? stateLine[x - 1] : stateLine[lineWidth - 1];
    const b1 = currentState;
    const b0 = x < lineWidth - 1 ? stateLine[x + 1] : stateLine[0];
    const idx = 7 - (b0 + b1 * 2 + b2 * 4); // rightmost is the least significant bit
    return rules[idx];
  };
};
