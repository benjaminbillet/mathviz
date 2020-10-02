import { complex, ComplexNumber } from '../utils/complex';
import { ComplexToComplexFunction } from '../utils/types';
import { makeP111RosetteFunction, makeP11GRosetteFunction, makeP11MRosetteFunction, makeP1M1RosetteFunction, makeP211RosetteFunction, makeP2MGRosetteFunction, makeP2MMRosetteFunction } from './rosette-group';

const phi: ComplexToComplexFunction = z => complex(Math.cos(z.re), Math.sin(z.re)).mul(Math.exp(-z.im));

export const makeP111FriezeFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  return makeUnfoldedRosetteFunction(makeP111RosetteFunction(pFold, powers, coeffs, multiplicators));
};

export const makeP211FriezeFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  return makeUnfoldedRosetteFunction(makeP211RosetteFunction(pFold, powers, coeffs, multiplicators));
};

export const makeP1M1FriezeFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  return makeUnfoldedRosetteFunction(makeP1M1RosetteFunction(pFold, powers, coeffs, multiplicators));
};

export const makeP11MFriezeFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  return makeUnfoldedRosetteFunction(makeP11MRosetteFunction(pFold, powers, coeffs, multiplicators));
};

export const makeP11GFriezeFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  return makeUnfoldedRosetteFunction(makeP11GRosetteFunction(pFold, powers, coeffs, multiplicators));
};

export const makeP2MMFriezeFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  return makeUnfoldedRosetteFunction(makeP2MMRosetteFunction(pFold, powers, coeffs, multiplicators));
};

export const makeP2MGFriezeFunction = (pFold: number, powers: number[], coeffs: ComplexNumber[], multiplicators: number[]): ComplexToComplexFunction => {
  return makeUnfoldedRosetteFunction(makeP2MGRosetteFunction(pFold, powers, coeffs, multiplicators));
};

export const makeUnfoldedRosetteFunction = (f: ComplexToComplexFunction): ComplexToComplexFunction => {
  return z => { 
    return f(phi(z));
  }
};
