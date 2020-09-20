import { IDENTITY } from './affine';
import { PlotDomain } from './types';

export const BI_UNIT_DOMAIN: PlotDomain = { xmin: -1, xmax: 1, ymin: -1, ymax: 1 };
export const UNIT_DOMAIN: PlotDomain = { xmin: 0, xmax: 1, ymin: 0, ymax: 1 };

export const scaleDomain = (domain: PlotDomain, scale = 1): PlotDomain => {
  return {
    xmin: domain.xmin * scale,
    ymin: domain.ymin * scale,
    xmax: domain.xmax * scale,
    ymax: domain.ymax * scale,
  };
};

export const transformDomain = (domain: PlotDomain, matrix = IDENTITY): PlotDomain => {
  const a11 = matrix.get([ 0, 0 ]);
  const a12 = matrix.get([ 0, 1 ]);
  const a13 = matrix.get([ 0, 2 ]);
  const a21 = matrix.get([ 1, 0 ]);
  const a22 = matrix.get([ 1, 1 ]);
  const a23 = matrix.get([ 1, 2 ]);
  return {
    xmin: a11 * domain.xmin + a12 * domain.ymin + a13,
    ymin: a21 * domain.xmin + a22 * domain.ymin + a23,
    xmax: a11 * domain.xmax + a12 * domain.ymax + a13,
    ymax: a21 * domain.xmax + a22 * domain.ymax + a23,
  };
};

export const zoomDomain = (domain: PlotDomain, centerX = 0, centerY = 0, scale = 1): PlotDomain => {
  const scaledRangeX = (domain.xmax - domain.xmin) / scale;
  const scaledRangeY = (domain.ymax - domain.ymin) / scale;
  return {
    xmin: centerX - scaledRangeX / 2,
    ymin: centerY - scaledRangeY / 2,
    xmax: centerX + scaledRangeX / 2,
    ymax: centerY + scaledRangeY / 2,
  };
};

export const symmetrizeDomain = (domain: PlotDomain): PlotDomain => {
  let { xmin, xmax, ymin, ymax } = domain;
  //if ((xmin > 0 && xmax < 0) || (xmin < 0 && xmax > 0)) {
    xmax = Math.max(Math.abs(xmin), xmax);
    xmin = -xmax;
  //}

  //if ((ymin > 0 && ymax < 0) || (ymin < 0 && ymax > 0)) {
    ymax = Math.max(Math.abs(ymin), ymax);
    ymin = -ymax;
  //}
  return { xmin, ymin, xmax, ymax };
};

export const adjustDomainRatio = (domain: PlotDomain, expectedRatio: number): PlotDomain => {
  const width = domain.xmax - domain.xmin;
  const height = domain.ymax - domain.ymin;
  const currentRatio = width / height;
  const delta = expectedRatio / currentRatio;
  if (width > height) {
    return {
      ...domain,
      ymin: domain.ymin * delta,
      ymax: domain.ymax * delta,
    };
  } else if (width < height) {
    return {
      ...domain,
      xmin: domain.xmin * delta,
      xmax: domain.xmax * delta,
    };
  }
  return domain;
};

/* export const mapDomain = (x, y, sourceDomain, destinationDomain) => {
  const sourceDomainWidth = sourceDomain.xmax - sourceDomain.xmin;
  const sourceDomainHeight = sourceDomain.ymax - sourceDomain.ymin;

  const destinationDomainWidth = destinationDomain.xmax - destinationDomain.xmin;
  const destinationDomainHeight = destinationDomain.ymax - destinationDomain.ymin;

  const xRatio = sourceDomainWidth / destinationDomainWidth;
  const yRatio = sourceDomainHeight / destinationDomainHeight;
  return [
    destinationDomain.xmin + (x * xRatio),
    destinationDomain.ymin + (y * yRatio),
  ];
}; */
