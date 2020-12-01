import { getRedmeanColorDistance } from './color';
import { randomInteger } from './random';
import { Palette } from './types';

type Cluster = {
  mean: { r: number; g: number, b: number }
  items: number[], // id of pixels in the original image
  error: number,
};

const clusterize = (buffer: Float32Array, width: number, height: number, clusters: Cluster[]): Cluster[] => {
  // clone the cluster objects
  const newClusters = clusters.map(cluster => {
    return { mean: { ...cluster.mean }, items: [], error: 0 };
  });

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (randomInteger(0, width) + randomInteger(0, height) * width) * 4;
      let bestClusterIdx = null;
      let smallestError = Number.MAX_SAFE_INTEGER;
      clusters.forEach((cluster, i) => {
        const error = getRedmeanColorDistance(cluster.mean.r / 255, cluster.mean.g / 255, cluster.mean.b / 255, buffer[idx + 0] / 255, buffer[idx + 1] / 255, buffer[idx + 2] / 255);
        if (error < smallestError) {
          smallestError = error;
          bestClusterIdx = i;
        }
      });
      newClusters[bestClusterIdx].items.push(idx);
      newClusters[bestClusterIdx].error += smallestError;
    }
  }

  // compute the new centroids of the cluster
  newClusters.forEach(cluster => {
    let rSum = 0;
    let bSum = 0;
    let gSum = 0;
    cluster.items.forEach((idx) => {
      rSum += buffer[idx + 0];
      gSum += buffer[idx + 1];
      bSum += buffer[idx + 2];
    });
    cluster.mean = {
      r: rSum / cluster.items.length,
      g: gSum / cluster.items.length,
      b: bSum / cluster.items.length,
    }
  });

  return newClusters;
};

const hasConverged = (newClusters: Cluster[], oldClusters: Cluster[]) => {
  // check if all means gqve evolved
  return newClusters.every((newCluster, i) => {
    const oldCluster = oldClusters[i];
    if (newCluster.mean.r - oldCluster.mean.r <= 0.0001 && newCluster.mean.g - oldCluster.mean.g <= 0.0001 && newCluster.mean.b - oldCluster.mean.b <= 0.0001) {
      return true;
    }
    return false;
  });
};

export const extractPalette = (buffer: Float32Array, width: number, height: number, paletteSize: number, maxAttempts = 10): Palette => {
  let bestClusters = null;
  let smallestError = Number.MAX_SAFE_INTEGER;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // randomly initialize the k means
    let clusters = new Array(paletteSize).fill(null).map(() => {
      const inIdx = (randomInteger(0, width) + randomInteger(0, height) * width) * 4;
      return {
        mean: {
          r: buffer[inIdx + 0],
          g: buffer[inIdx + 1],
          b: buffer[inIdx + 2],
        },
        items: [ inIdx ],
        error: 0,
      };
    });
    
    let newClusters = null;
    do {
      newClusters = clusterize(buffer, width, height, clusters);
      clusters = newClusters;
    } while (!hasConverged(newClusters, clusters));

    // compute the error and keep the clusters if its better
    const error = clusters.reduce((sum, cluster) => sum + cluster.error, 0);
    if (error < smallestError) {
      smallestError = error;
      bestClusters = clusters;
    }
  }

  return bestClusters.map(cluster => [
    cluster.mean.r,
    cluster.mean.g,
    cluster.mean.b,
    1,
  ]);
};
