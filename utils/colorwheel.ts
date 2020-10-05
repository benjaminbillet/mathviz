
import * as D3Color from 'd3-color';
import { convertUnitToRGBA } from './color';
import { BI_UNIT_DOMAIN } from './domain';
import { toDegree } from './math';
import { mapPixelToComplexDomain, saveImageBuffer } from './picture';
import { PlotBuffer } from './types';

export const plotColorWheel1 = (width: number, height: number): PlotBuffer => {
  const buffer = new Float32Array(width * height * 4);
  const palette = [
    [ 90, 200, 60 ],
    [ 20, 50, 165 ],
    [ 105, 25, 165 ],
    [ 230, 50, 35 ],
    [ 240, 175, 60 ],
    [ 255, 255, 85 ],
  ];
  const angle = 360 / palette.length; // we work in degree here
  
  const stripes = 5;
  const palettes = new Array(stripes).fill(0).map((_, i) => {
    return palette.map(color => {
      const hsl = D3Color.hsl(D3Color.rgb(...color));
      hsl.l *= 1 + ((stripes - 1 - i) / stripes * 0.5);
      hsl.s -= ((stripes - 1 - i) / (stripes * 4));
      const rgb = D3Color.rgb(hsl);
      return [ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b) ];
    });
  });

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const z = mapPixelToComplexDomain(i, j, width, height, BI_UNIT_DOMAIN);
      let color = [ 0, 0, 0 ];

      const idx = (i + j * width) * 4;
      buffer[idx + 3] = 255;

      const r = z.modulus();
      if (r < 1) {
        // we add pi because the argument is between [-pi, pi], and we use a modulo to ensure that 360˚ = 0˚
        const theta = toDegree(z.argument() + Math.PI) % 360;
        const paletteIdx = Math.trunc(r * palettes.length);
        const colorIdx = Math.trunc(theta / angle);
        color = palettes[paletteIdx][colorIdx];

        buffer[idx + 0] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
      }
    }
  }
  return buffer;
};


export const plotColorWheel2 = (width: number, height: number): PlotBuffer => {
  const buffer = new Float32Array(width * height * 4).fill(0);
  const palette = [
    [ 90, 200, 60 ],
    [ 20, 50, 165 ],
    [ 165, 65, 160 ],
    [ 230, 50, 35 ],
    [ 165, 220, 220 ],
    [ 255, 255, 85 ],
  ];
  const angle = 360 / palette.length; // we work in degree here


  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const z = mapPixelToComplexDomain(i, j, width, height, BI_UNIT_DOMAIN);
      let color = [ 0, 0, 0 ];

      const idx = (i + j * width) * 4;
      buffer[idx + 3] = 255;

      const r = z.modulus();
      if (r < 1) {
        // we add pi because the argument is between [-pi, pi], and we use a modulo to ensure that 360˚ = 0˚
        const theta = toDegree(z.argument() + Math.PI) % 360;
        const colorIdx = Math.trunc(theta / angle);
        color = palette[colorIdx];

        let blend = 1;
        let blend2 = 1;
        if (r < 0.25) {
          blend = (r * 4);
        } else if (r > 0.75) {
          blend2 = (1 - r) * 3;
        }

        buffer[idx + 0] = Math.min(255, color[0] * blend * blend2 + 255 * (1 - blend) * 2);
        buffer[idx + 1] = Math.min(255, color[1] * blend * blend2 + 255 * (1 - blend) * 2);
        buffer[idx + 2] = Math.min(255, color[2] * blend * blend2 + 255 * (1 - blend) * 2);
      }
    }
  }
  return buffer;
};

export const plotColorWheel3 = (width: number, height: number, lightFade: boolean): PlotBuffer => {
  const buffer = new Float32Array(width * height * 4).fill(0);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const z = mapPixelToComplexDomain(i, j, width, height, BI_UNIT_DOMAIN);

      const idx = (i + j * width) * 4;
      buffer[idx + 3] = 255;

      const r = z.modulus();
      if (r < 1) {
        // we add pi because the argument is between [-pi, pi], and we use a modulo to ensure that 360˚ = 0˚
        const theta = toDegree(z.argument() + Math.PI) % 360;
        
        const hsl = D3Color.hsl(theta, 1, lightFade ? 1 - r : 0.5);
        const rgb = D3Color.rgb(hsl);
        const color = [ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b) ];

        buffer[idx + 0] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
      }
    }
  }
  return buffer;
};

export const plotColorWheel4 = (width: number, height: number, nbStripes = 5): PlotBuffer => {
  const buffer = new Float32Array(width * height * 4).fill(0);

  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      const z = mapPixelToComplexDomain(i, j, width, height, BI_UNIT_DOMAIN);

      const idx = (i + j * width) * 4;
      buffer[idx + 3] = 255;

      const r = z.modulus();
      if (r < 1) {
        // we add pi because the argument is between [-pi, pi], and we use a modulo to ensure that 360˚ = 0˚
        const theta = toDegree(z.argument() + Math.PI) % 360;
        
        const stripe = Math.trunc(r * nbStripes) / 4;

        const hsl = D3Color.hsl(theta, 1, 0.33 + stripe / nbStripes);
        const rgb = D3Color.rgb(hsl);
        const color = [ Math.trunc(rgb.r), Math.trunc(rgb.g), Math.trunc(rgb.b) ];

        buffer[idx + 0] = color[0];
        buffer[idx + 1] = color[1];
        buffer[idx + 2] = color[2];
      }
    }
  }
  return buffer;
};


saveImageBuffer(plotColorWheel4(1000, 1000), 1000, 1000, 'machin4.png');