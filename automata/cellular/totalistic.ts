import { Next1dCellStateFunction } from '../../utils/types';

export const buildTotalisticRulesFromWolframRuleCode = (wolframRuleCode: number, nbState: number): number[] => {
  return Array.from(wolframRuleCode.toString(nbState)).map(x => parseInt(x));
};

export const makeTotalisticNextState = (rules: number[]): Next1dCellStateFunction => {
  return (stateLine, lineWidth, currentState, x) => {
    const b2 = x > 0 ? stateLine[x - 1] : stateLine[lineWidth - 1];
    const b1 = currentState;
    const b0 = x < lineWidth - 1 ? stateLine[x + 1] : stateLine[0];
    return rules[rules.length - 1 - (b0 + b1 + b2)];
  };
};
