import { clamp } from './misc';
import { dot3, normalize3 } from './vector';


// https://paroj.github.io/gltut/Illumination/Tut11%20Phong%20Model.html

export const phongSpecular = (normal: number[], viewDirection: number[], lightDirection: number[], power = 1) => {
  const reverseLightDirection = lightDirection.map(x => -x);

  let cosAngIncidence = dot3(normal[0], normal[1], normal[2], lightDirection[0], lightDirection[1], lightDirection[2]);
  cosAngIncidence = clamp(cosAngIncidence, 0, 1);
  if (cosAngIncidence <= 0) {
    return 0;
  }

  const normalVsLightAngle = 2 * dot3(normal[0], normal[1], normal[2], reverseLightDirection[0], reverseLightDirection[1], reverseLightDirection[2]);
  const reflect = normal.map((x, i) => reverseLightDirection[i] - normalVsLightAngle * x);
  const viewVsReflectAngle = dot3(viewDirection[0], viewDirection[1], viewDirection[2], reflect[0], reflect[1], reflect[2]);
  return Math.pow(clamp(viewVsReflectAngle, 0, 1), power);
};

export const blinnSpecular = (normal: number[], viewDirection: number[], lightDirection: number[], power = 4) => {
  let cosAngIncidence = dot3(normal[0], normal[1], normal[2], lightDirection[0], lightDirection[1], lightDirection[2]);
  cosAngIncidence = clamp(cosAngIncidence, 0, 1);
  if (cosAngIncidence <= 0) {
    return 0;
  }

  const lightAndViewDirection = lightDirection.map((x, i) => x + viewDirection[i]);
  const halfAngle = normalize3(lightAndViewDirection[0], lightAndViewDirection[1], lightAndViewDirection[2]);
  const normalVsHalfAngle = dot3(normal[0], normal[1], normal[2], halfAngle[0], halfAngle[1], halfAngle[2]);
  return Math.pow(clamp(normalVsHalfAngle, 0, 1), power);
};

export const gaussianSpecular = (normal: number[], viewDirection: number[], lightDirection: number[], power = 0.5) => {
  let cosAngIncidence = dot3(normal[0], normal[1], normal[2], lightDirection[0], lightDirection[1], lightDirection[2]);
  cosAngIncidence = clamp(cosAngIncidence, 0, 1);
  if (cosAngIncidence <= 0) {
    return 0;
  }

  const lightAndViewDirection = lightDirection.map((x, i) => x + viewDirection[i]);
  const halfAngle = normalize3(lightAndViewDirection[0], lightAndViewDirection[1], lightAndViewDirection[2]);

  const angleNormalHalf = Math.acos(dot3(halfAngle[0], halfAngle[1], halfAngle[2], normal[0], normal[1], normal[2]));
  const exponent = angleNormalHalf / power;
  // console.log(exponent, Math.exp(-(exponent * exponent)));
  return Math.exp(-(exponent * exponent));
};