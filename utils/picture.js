import PngImage from 'pngjs-image';

export const createImage = (width, height, r = 0, g = 0, b = 0, a = 255) => {
  const image = PngImage.createImage(width, height);
  fillPicture(image.getImage().data, width, height, r, g, b, a);
  return image;
};

export const saveImage = async (image, path) => {
  return new Promise((resolve, reject) => {
    image.writeImage(path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const saveImageBuffer = async (buffer, width, height, path) => {
  const image = PngImage.createImage(width, height);
  image.getImage().data.set(buffer);
  await saveImage(image, path);
};

export const readImage = async (path) => {
  return new Promise((resolve, reject) => {
    PngImage.readImage(path, (err, image) => {
      if (err) {
        reject(err);
      } else {
        resolve(image);
      }
    });
  });
};

export const transformImage = (buffer, f) => {
  for (let i = 0; i < buffer.length; i += 4) {
    const result = f(buffer[i], buffer[i + 1], buffer[i + 2], buffer[i + 3]);
    buffer[i + 0] = result[0] != null ? result[0] : buffer[i + 0];
    buffer[i + 1] = result[1] != null ? result[1] : buffer[i + 1];
    buffer[i + 2] = result[2] != null ? result[2] : buffer[i + 2];
    buffer[i + 3] = result[3] != null ? result[3] : buffer[i + 3];
  }
};

export const mapPixelToDomain = (x, y, width, height, domain) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;

  const xRatio = domainWidth / width;
  const yRatio = domainHeight / height;
  return [
    domain.xmin + (x * xRatio),
    domain.ymin + (y * yRatio),
  ];
};

export const mapDomainToPixel = (x, y, domain, width, height) => {
  // optimization if domain is 0-1
  if (domain.xmin === 0 && domain.xmax === 1 && domain.ymin === 0 && domain.ymax === 1) {
    return [
      Math.trunc(x * width),
      Math.trunc(y * height),
    ];
  }

  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;

  const xRatio = (width - 1) / domainWidth;
  const yRatio = (height - 1) / domainHeight;
  return [
    Math.trunc((x - domain.xmin) * xRatio, width),
    Math.trunc((y - domain.ymin) * yRatio, height),
  ];
};

export const getPictureSizeFromWidth = (width, domain) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;
  const ratio = domainHeight / domainWidth;
  return [ width, Math.round(width * ratio) ];
};

export const getPictureSizeFromHeight = (height, domain) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;
  const ratio = domainWidth / domainHeight;
  return [ Math.round(height * ratio), height ];
};

export const getPictureSize = (max, domain) => {
  const domainWidth = domain.xmax - domain.xmin;
  const domainHeight = domain.ymax - domain.ymin;
  if (domainWidth >= domainHeight) {
    return getPictureSizeFromWidth(max, domain);
  }
  return getPictureSizeFromHeight(max, domain);
};

export const fillPicture = (buffer, width, height, r = 0, g = 0, b = 0, a = 255) => {
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const idx = (i + j * width) * 4;
      buffer[idx + 0] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }
};