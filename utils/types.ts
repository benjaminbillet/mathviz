import { Matrix } from "mathjs";
import { ComplexNumber } from "./complex";

export type RealToRealFunction = (x: number) => number;
export type BiRealToRealFunction = (x: number, y: number) => number;
export type ComplexToRealFunction = (z: ComplexNumber) => number;
export type ComplexToComplexFunction = (z: ComplexNumber) => ComplexNumber;
export type Affine2D = ComplexToComplexFunction;
export type Transform2D = ComplexToComplexFunction;

export type RealParametricFunction = (t: number) => number;
export type ComplexParametricFunction = (t: number) => ComplexNumber;

export type IterableComplexFunction = () => ComplexNumber;
export type IterableRealFunction = () => number;
export type IterableColorFunction = () => Color;

export type TransformMaker = () => Transform2D;
export type NoiseFunction1D = RealToRealFunction;
export type NoiseFunction2D = BiRealToRealFunction;
export type NoiseMaker2D = (freq: number) => NoiseFunction2D;

export type Noise2DPostProcess2D = (intensity: number, coords: Float32Array) => number;
export type Noise2DPreProcess2D = (coords: Float32Array) => void;


export type RealPredicate = (x: number) => boolean;
export type ComplexPredicate = (z: ComplexNumber) => boolean;

export type Palette = Color[];

export type BWColor = number;

export type Color = [ number, number, number, number? ];
export type ColorMap = Color[];
export type ColorMapFunction = (x: number) => Color;

export type ComplexToColorFunction = (z: ComplexNumber) => number | Color;

export type RealToBoolFunction = (x: number) => boolean;
export type ComplexToBoolFunction = (z: ComplexNumber) => boolean;

export type PlotDomain = {
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
};

export type Kernel = Float32Array | Uint8Array | Uint16Array | Uint32Array | number[];

export type PlotBuffer = Float32Array | Uint8Array | Uint16Array | Uint32Array | number[];
export type ARGBBuffer = Float32Array | Int32Array | number[];


export type PixelPlotter = (x: number, y: number, color: Color, ...otherArgs: any[]) => void;
export type ComplexPlotter = (z: ComplexNumber, color: Color, ...otherArgs: any[]) => void;


export type Polygon = ComplexNumber[];
export type Rectangle = { xmin: number, xmax: number, ymin: number, ymax: number };
export type Box = Rectangle;
export type Circle = { center: ComplexNumber, radius: number };

export type ColorSteal = (x: number, y: number, point: number, iteration: number) => Color;

export type OrbitTrap = {
  isTrapped: ComplexPredicate,
  interpolateTrap: ComplexToColorFunction,
  untrappedValue: Color | BWColor,
};

export type Index<T> = {
  [key: string]: T,
};
export type Struct = {
  [key: string]: any,
};

export type TransformMatrix = {
  push: () => void,
  pop: () => Matrix,
  transform: (...transforms: Matrix[]) => Matrix
  apply: ComplexToComplexFunction,
};


export type Wrapper<T> = (x: T) => T;
export type Adapter<A, B> = (x: A) => B;
export type Optional<T> = T | undefined | null;
export type Collection<T> = T[] | Uint8Array; // TODO other typed array

export type Ifs = {
  functions: Affine2D[],
  probabilities: number[],
};

export type SingleChannelHistogram = Uint32Array;
export type ColorHistogram = SingleChannelHistogram[];


export type DistanceFunction1D = (x1: number, x2: number) => number;
export type DistanceFunction2D = (x1: number, y1: number, x2: number, y2: number) => number;


export type Effect = (input: PlotBuffer, width: number, height: number, ...args: any[]) => PlotBuffer;

export type EasingFunction = RealToRealFunction;
export type Attractor = ComplexToComplexFunction;

export type BlendFunction = (buf1: PlotBuffer, buf2: PlotBuffer) => PlotBuffer;

export type VectorFieldFunction = (z: ComplexNumber, iteration: number, time: number) => ComplexNumber;
export type VectorFieldTimeFunction = (z: ComplexNumber, iteration: number) => number;


export type CellularAutomataGrid = Uint8Array | Uint16Array | Uint32Array | number[];
export type NextCellStateFunction = (stateGrid: CellularAutomataGrid, gridWidth: number, gridHeight: number, currentState: number, x: number, y: number) => number;
export type CellularAutomataIterationPostProcessor = (grid: CellularAutomataGrid, width: number, height: number) => void;

export type NeighborForEachFunction = (state: number, x: number, y: number, grid: CellularAutomataGrid) => void;
export type NeighborReduceFunction = (result: number, state: number, x: number, y: number, grid: CellularAutomataGrid) => number;
export type NeighborIterator = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborForEachFunction) => void;
export type NeighborReducer = (grid: CellularAutomataGrid, width: number, height: number, centerX: number, centerY: number, range: number, func: NeighborReduceFunction, initialValue: number) => number;

export type AnimationAccumulator = {
  accumulate: (frame: PlotBuffer) => Promise<void>,
  finish: () => Promise<void>,
};
export type RenderFrameFunction = (value: number, iteration: number, frameFile: string) => void;


export type Logger = (...args: any[]) => void;

export type BinaryMorphOperation = (x: number, y: number, idx: number) => number;