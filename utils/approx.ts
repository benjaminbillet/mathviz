const TWO_PI = 2 * Math.PI;
const TWO_OVER_PI = 2 / Math.PI;
const FOUR_OVER_PI = 4 / Math.PI;
const FOUR_OVER_PI_SQUARED = 4 / (Math.PI * Math.PI);
const INVERSE_TWO_PI =  1 / (2 * Math.PI);
const HALF_PI = Math.PI / 2;
const HALF_PI_MINUS_TWOPI = Math.PI / 2 - TWO_PI;


export const log2 = (() => {
  const a = new ArrayBuffer(8);
  const i = new Int32Array(a);
  const f = new Float32Array(a);

  return (number: number) => {
    f[0] = number;
    i[1] = (i[0] & 0x007FFFFF) | 0x3f000000;
    const t = i[0] * 1.1920928955078125e-7;
    return t - 124.22551499 - 1.498030302 * f[1] - 1.72587999 / (0.3520887068 + f[1]);
  };
})();

export const fasterLog2 = (() => {
  const a = new ArrayBuffer(4);
  const i = new Int32Array(a);
  const f = new Float32Array(a);

  return (number: number) => {
    f[0] = number;
    const t = i[0] * 1.1920928955078125e-7;
    return t - 126.94269504;
  };
})();

export const log = (number: number): number => {
  return 0.6931471805599453 * log2(number);
};

export const fasterLog = (number: number): number => {
  return 0.6931471805599453 * fasterLog2(number);
};

export const log10 = (number: number): number => {
  return 0.30102999566398114 * log2(number);
};

export const fasterLog10 = (number: number): number => {
  return 0.30102999566398114 * fasterLog2(number);
};

export const pow2 = (() => {
  const a = new ArrayBuffer(4);
  const i = new Int32Array(a);
  const f = new Float32Array(a);

  return (number: number) => {
    const offset = (number < 0) ? 1 : 0;
    const clipNumber = (number < -126) ? -126 : number;
    const w = clipNumber | 0;
    const z = clipNumber - w + offset;

    i[0] = ( (1 << 23) * (clipNumber + 121.2740575 + 27.7280233 / (4.84252568 - z) - 1.49012907 * z) );

    return f[0];
  };
})();

export const fasterPow2 = (() => {
  const a = new ArrayBuffer(4);
  const i = new Int32Array(a);
  const f = new Float32Array(a);

  return (number: number) => {
    const clipNumber = (number < -126) ? -126 : number;
    i[0] = ( (1 << 23) * (clipNumber + 126.94269504) );
    return f[0];
  };
})();

export const exp = (number: number): number => {
  return pow2(1.442695040 * number);
};

export const fasterExp = (number: number): number => {
  return fasterPow2(1.442695040 * number);
};

export const rsqrt = (() => {
  const buf = new ArrayBuffer(4);
  const f32 = new Float32Array(buf);
  const u32 = new Uint32Array(buf);

  return (number: number) => {
    const x2 = 0.5 * (f32[0] = number);
    u32[0] = (0x5f3759df - (u32[0] >> 1)); // what the fuck?
    let y = f32[0];
    y = y * ( 1.5 - ( x2 * y * y ) ); // 1st iteration
    return y;
  };
})();

export const sqrt = (number: number): number => {
  return 1.0 / rsqrt(number);
};


const halfsin = (() => {
  const q = 0.78444488374548933;
  const a = new ArrayBuffer(16);
  const i = new Int32Array(a);
  const f = new Float32Array(a);
  return (number: number) => {
    f[0] = 0.20363937680730309;
    f[1] = 0.015124940802184233;
    f[2] = -0.0032225901625579573;
    f[3] = number;
    const sign = i[3] & 0x80000000;
    i[3] = i[3] & 0x7FFFFFFF;
    const qpprox = FOUR_OVER_PI * number - FOUR_OVER_PI_SQUARED * number * f[3];
    const qpproxsq = qpprox * qpprox;
    i[0] |= sign;
    i[1] |= sign;
    i[2] ^= sign;
    return q * qpprox + qpproxsq * (f[0] + qpproxsq * (f[1] + qpproxsq * f[2]));
  };
})();

export const sin = (number: number): number => {
  const k = (number * INVERSE_TWO_PI) | 0;
  const half = (number < 0) ? -0.5 : 0.5;
  return halfsin((half + k) * TWO_PI - number);
};

const fasterHalfsin = (() => {
  const q = 0.78444488374548933;
  const a = new ArrayBuffer(8);
  const i = new Int32Array(a);
  const f = new Float32Array(a);

  return (number: number) => {
    f[0] = 0.22308510060189463;
    f[1] = number;
    const sign = i[1] & 0x80000000;
    i[1] &= 0x7FFFFFFF;
    const qpprox = FOUR_OVER_PI * number - FOUR_OVER_PI_SQUARED * number * f[1];
    i[0] |= sign;
    return qpprox * (q + f[0] * qpprox);
  };
})();

export const fasterSin = (number: number): number => {
  const k = (number * INVERSE_TWO_PI) | 0;
  const half = (number < 0) ? -0.5 : 0.5;
  return fasterHalfsin((half + k) * TWO_PI - number);
};

export const sinh = (number: number): number => {
  return 0.5 * (exp(number) - exp(-number));
};

export const fasterSinh = (number: number): number => {
  return 0.5 * (fasterExp(number) - fasterExp(-number));
};

/* export const asin = (x) => {
  const negate = x < 0 ? 1 : 0;
  x = Math.abs(x);
  let ret = -0.0187293;
  ret *= x;
  ret += 0.0742610;
  ret *= x;
  ret -= 0.2121144;
  ret *= x;
  ret += 1.5707288;
  ret = 3.14159265358979*0.5 - sqrt(1.0 - x)*ret;
  return ret - 2 * negate * ret;
}*/


const halfcos = (number: number): number => {
  const offset = (number > HALF_PI) ? HALF_PI_MINUS_TWOPI : HALF_PI;
  return halfsin(number + offset);
};

const fasterHalfcos = (() => {
  const p = 0.54641335845679634;
  const a = new ArrayBuffer(4);
  const i = new Int32Array(a);
  const f = new Float32Array(a);

  return (number: number) => {
    f[0] = number;
    i[0] &= 0x7FFFFFFF;
    const qpprox = 1.0 - TWO_OVER_PI * f[0];
    return qpprox + p * qpprox * (1.0 - qpprox * qpprox);
  };
})();

export const cos = (number: number): number => {
  return sin(number + HALF_PI);
};

export const fasterCos = (number: number): number => {
  return fasterSin(number + HALF_PI);
};

export const cosh = (number: number): number => {
  return 0.5 * (exp(number) + exp(-number));
};

export const fasterCosh = (number: number): number => {
  return 0.5 * (fasterExp(number) + fasterExp(-number));
};

/* export const acos = (x) => {
  const negate = x < 0 ? 1 : 0;
  x = Math.abs(x);
  let ret = -0.0187293;
  ret = ret * x;
  ret = ret + 0.0742610;
  ret = ret * x;
  ret = ret - 0.2121144;
  ret = ret * x;
  ret = ret + 1.5707288;
  ret = ret * sqrt(1.0-x);
  ret = ret - 2 * negate * ret;
  return negate * 3.14159265358979 + ret;
};*/


export const tan = (number: number): number => {
  const k = (number * INVERSE_TWO_PI) | 0;
  const half = (number < 0) ? -0.5 : 0.5;
  const newNumber = number - (half + k) * TWO_PI;
  return halfsin(newNumber) / halfcos(newNumber);
};

export const fasterTan = (number: number): number => {
  const k = (number * INVERSE_TWO_PI) | 0;
  const half = (number < 0) ? -0.5 : 0.5;
  const newNumber = number - (half + k) * TWO_PI;
  return fasterHalfsin(newNumber) / fasterHalfcos(newNumber);
};

export const tanh = (number: number): number => {
  return -1.0 + 2.0 / (1.0 + exp(-2.0 * number));
};

export const fasterTanh = (number: number): number => {
  return -1.0 + 2.0 / (1.0 + fasterExp(-2.0 * number));
};

export const atan2 = (y: number, x: number): number => {
  const sign = 1.0 - ((y < 0.0 ? 1 : 0) << 1);
  let absYandR = y * sign + 2.220446049250313e-16;
  const partSignX = ((x < 0.0 ? 1 : 0) << 1); // [0.0/2.0]
  const signX = 1.0 - partSignX; // [1.0/-1.0]
  absYandR = (x - signX * absYandR) / (signX * x + absYandR);
  return ((partSignX + 1.0) * 0.7853981634 + (0.1821 * absYandR * absYandR - 0.9675) * absYandR) * sign;
}