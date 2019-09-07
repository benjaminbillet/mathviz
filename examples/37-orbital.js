import { mkdirs } from '../utils/fs';
import { generateOrbitals } from '../automata/orbital';
import { plotAutomata } from './util';

const OUTPUT_DIRECTORY = `${__dirname}/../output/automata`;
mkdirs(OUTPUT_DIRECTORY);

const width = 1024;
const height = 1024;

plotAutomata(`${OUTPUT_DIRECTORY}/orbital1.png`, width, height, () => generateOrbitals(width, height, 100));
plotAutomata(`${OUTPUT_DIRECTORY}/orbital2.png`, width, height, () => generateOrbitals(width, height, 1100));
plotAutomata(`${OUTPUT_DIRECTORY}/orbital3.png`, width, height, () => generateOrbitals(width, height, 1400));
plotAutomata(`${OUTPUT_DIRECTORY}/orbital4.png`, width, height, () => generateOrbitals(width, height, 4000));

