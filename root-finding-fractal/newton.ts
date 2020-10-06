import { complex, ComplexNumber } from '../utils/complex';
import { mapPixelToComplexDomain, mapPixelToDomain } from '../utils/picture';
import { ComplexToComplexFunction } from '../utils/types';

// https://www.chiark.greenend.org.uk/~sgtatham/newton
// https://en.wikipedia.org/wiki/Newton_fractal#Generalization_of_Newton_fractals

// https://sites.google.com/site/newtonfractals/applications-generalizations---simon

export const makeNewton1 = (f: ComplexToComplexFunction, fd: ComplexToComplexFunction, roots: ComplexNumber[], maxIterations = 20, tolerance = 0.001, smooth = true) => {
  return (z0: ComplexNumber) => {
    let z = z0;
    for (let i = 0; i < maxIterations; i++) {
      // iterate towards a root
      const newZ = z.sub(f(z).div(fd(z)));

      for (let j = 0; j < roots.length; j++) {
        const distance = newZ.sub(roots[j]).squaredModulus();
        const oldDistance = z.sub(roots[j]).squaredModulus();

        // if the current iteration is close enough to a root, color the pixel
        if (distance < tolerance) {
          let interpolatedDistance = 0;
          if (smooth && oldDistance > tolerance) {
            interpolatedDistance = (Math.log(tolerance) - Math.log(oldDistance)) / (Math.log(distance) - Math.log(oldDistance));
          }
          const fade = (i + interpolatedDistance) / maxIterations;
          return ((j + 1 + fade) / roots.length);
        }
      }
      z = newZ;
    }
    return 0;
  }
};


// a different implementation
// https://blog.anvetsu.com/posts/fractals-newton-python-matplotlib-numpy/
export const makeNewton2 = (f: ComplexToComplexFunction, roots: ComplexNumber[], maxIterations = 20, tolerance = 0.001, smooth = true) => {
  const h = new ComplexNumber(0.000001, 0.000001); // step size for numerical derivative
  return (z0: ComplexNumber) => {
    let z = z0;
    for (let i = 0; i < maxIterations; i++) {
      // complex numerical derivative
      const fz = f(z);
      const dz = f(z.add(h)).sub(fz).div(h);
      const newZ = z.sub(fz.div(dz));

      for (let j = 0; j < roots.length; j++) {
        const distance = newZ.sub(roots[j]).squaredModulus();
        const oldDistance = z.sub(roots[j]).squaredModulus();

        // if the current iteration is close enough to a root, color the pixel
        if (distance < tolerance) {
          let interpolatedDistance = 0;
          if (smooth && oldDistance > tolerance) {
            interpolatedDistance = (Math.log(tolerance) - Math.log(oldDistance)) / (Math.log(distance) - Math.log(oldDistance));
          }
          const fade = (i + interpolatedDistance) / maxIterations;
          return ((j + 1 + fade) / roots.length);
        }
      }
      
      z = newZ;
    }
    return 0;
  }
};

export const findRoots = (f: ComplexToComplexFunction, width: number, height: number, maxIterations = 20, decimals = 3, domain = NEWTON_DOMAIN) => {
  const tolerance = 1 / Math.pow(10, decimals);
  const h = new ComplexNumber(0.000001, 0.000001); // step size for numerical derivative
  const roots: ComplexNumber[] = [];

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let z = mapPixelToComplexDomain(i, j, width, height, domain);

      for (let i = 0; i < maxIterations; i++) {
        // complex numerical derivative
        const fz = f(z);
        const dz = f(z.add(h)).sub(fz).div(h);
        const newZ = z.sub(fz.div(dz));
  
        if (newZ.sub(z).squaredModulus() < tolerance) {
          let rootFound = -1;
          for (let j = 0; j < roots.length; j++) {
            const distance = newZ.sub(roots[j]).squaredModulus();
            if (distance < tolerance) {
              rootFound = j;
              break;
            }
          }
  
          if (rootFound === -1) {
            newZ.re = parseFloat(newZ.re.toFixed(decimals));
            newZ.im = parseFloat(newZ.im.toFixed(decimals));
            roots.push(newZ);
          }
        }
        z = newZ;
      }
    }
  }

  return roots;
};

export const NEWTON_DOMAIN = {
  xmin: -2,
  xmax: 2,
  ymin: -2,
  ymax: 2,
};
