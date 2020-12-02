import { mkdirs } from '../../utils/fs';
import { applyScanlineError } from '../../effects/scanlineError';
import { applyComposite } from '../../effects/composite';
import { applyCrt } from '../../effects/crt';
import { applyDensityMap } from '../../effects/densityMap';
import { applyInterference } from '../../effects/interference';
import { applyVhs } from '../../effects/vhs';
import { applyWormhole } from '../../effects/wormhole';
import { applyAgate } from '../../effects/agate';
import { manhattan, makeAkritean, makeMinkowski, manhattan2d, makeAkritean2d, makeMinkowski2d, euclidean2d } from '../../utils/distance';
import { applyColorSampling } from '../../effects/colorSampling';
import { applyIcification } from '../../effects/icification';
import { applyGlowingEdges } from '../../effects/glowingEdges';
import { applyBloom } from '../../effects/bloom';
import { applyWarp } from '../../effects/warp';
import { applyNormalMap } from '../../effects/normalMap';
import { applyHypersat } from '../../effects/hypersat';
import { plotEffect } from '../util';
import { applyVoronoid } from '../../effects/voronoid';
import { applyVoroshard } from '../../effects/voroshard';
import { applyVortex } from '../../effects/vortex';
import { applySoup1, applySoup2, applySoup3, applySoup4 } from '../../effects/soup';
import { applyRasteroid } from '../../effects/rasteroid';

const OUTPUT_DIRECTORY = `${__dirname}/../../output/effects`;
mkdirs(OUTPUT_DIRECTORY);

const sourcePath = `${__dirname}/../ada-big.png`;

plotEffect(applyScanlineError, sourcePath, `${OUTPUT_DIRECTORY}/effect-scanlineerror.png`);
plotEffect(applyComposite, sourcePath, `${OUTPUT_DIRECTORY}/effect-composite.png`);
plotEffect(applyCrt, sourcePath, `${OUTPUT_DIRECTORY}/effect-crt.png`);
plotEffect(applyDensityMap, sourcePath, `${OUTPUT_DIRECTORY}/effect-densitymap.png`);
plotEffect(applyInterference, sourcePath, `${OUTPUT_DIRECTORY}/effect-interference.png`);
plotEffect(applyVhs, sourcePath, `${OUTPUT_DIRECTORY}/effect-vhs.png`);

plotEffect(applyVoronoid, sourcePath, `${OUTPUT_DIRECTORY}/effect-voronoid-euclidean.png`);
plotEffect(applyVoronoid, sourcePath, `${OUTPUT_DIRECTORY}/effect-voronoid-manhattan.png`, manhattan2d);
plotEffect(applyVoronoid, sourcePath, `${OUTPUT_DIRECTORY}/effect-voronoid-akritean.png`, makeAkritean2d(0.5));
plotEffect(applyVoronoid, sourcePath, `${OUTPUT_DIRECTORY}/effect-voronoid-minkowski.png`, makeMinkowski2d(0.5));

plotEffect(applyVoroshard, sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-euclidean.png`);
plotEffect(applyVoroshard, sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-manhattan.png`, 0.2, manhattan2d);
plotEffect(applyVoroshard, sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-akritean.png`, 0.2, makeAkritean2d(0.5));
plotEffect(applyVoroshard, sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-minkowski.png`, 0.2, makeMinkowski2d(0.5));
plotEffect(applyVoroshard, sourcePath, `${OUTPUT_DIRECTORY}/effect-voroshard-euclidean-d=0.1.png`, 0.2, euclidean2d, 0.1);

plotEffect(applyVortex, sourcePath, `${OUTPUT_DIRECTORY}/effect-vortex-i=6.png`, 6);
plotEffect(applyVortex, sourcePath, `${OUTPUT_DIRECTORY}/effect-vortex-i=2000.png`, 2000);

plotEffect(applyWormhole, sourcePath, `${OUTPUT_DIRECTORY}/effect-wormhole.png`);

plotEffect(applyAgate, sourcePath, `${OUTPUT_DIRECTORY}/effect-agate-euclidean.png`);
plotEffect(applyAgate, sourcePath, `${OUTPUT_DIRECTORY}/effect-agate-manhattan.png`, manhattan);
plotEffect(applyAgate, sourcePath, `${OUTPUT_DIRECTORY}/effect-agate-akritean.png`, makeAkritean(0.5));
plotEffect(applyAgate, sourcePath, `${OUTPUT_DIRECTORY}/effect-agate-minkowski.png`, makeMinkowski(0.7));

plotEffect(applyColorSampling, sourcePath, `${OUTPUT_DIRECTORY}/effect-colorsampling.png`);
plotEffect(applyGlowingEdges, sourcePath, `${OUTPUT_DIRECTORY}/effect-glowingedges.png`);
plotEffect(applyBloom, sourcePath, `${OUTPUT_DIRECTORY}/effect-bloom.png`);
plotEffect(applyIcification, sourcePath, `${OUTPUT_DIRECTORY}/effect-icification.png`);
plotEffect(applyWarp, sourcePath, `${OUTPUT_DIRECTORY}/effect-warp.png`, 1, 5, 2);
plotEffect(applyNormalMap, sourcePath, `${OUTPUT_DIRECTORY}/effect-normalmap.png`);
plotEffect(applyHypersat, sourcePath, `${OUTPUT_DIRECTORY}/effect-hypersat.png`);

plotEffect(applySoup1, sourcePath, `${OUTPUT_DIRECTORY}/effect-soup1.png`);
plotEffect(applySoup2, sourcePath, `${OUTPUT_DIRECTORY}/effect-soup2.png`);
plotEffect(applySoup3, sourcePath, `${OUTPUT_DIRECTORY}/effect-soup3.png`);
plotEffect(applySoup4, sourcePath, `${OUTPUT_DIRECTORY}/effect-soup4.png`);

plotEffect(applyRasteroid, sourcePath, `${OUTPUT_DIRECTORY}/effect-rasteroid-euclidian.png`);
plotEffect(applyRasteroid, sourcePath, `${OUTPUT_DIRECTORY}/effect-rasteroid-manhattan.png`, manhattan);
plotEffect(applyRasteroid, sourcePath, `${OUTPUT_DIRECTORY}/effect-rasteroid-akritean.png`, makeAkritean(0.5));
plotEffect(applyRasteroid, sourcePath, `${OUTPUT_DIRECTORY}/effect-rasteroid-minkowski.png`, makeMinkowski(0.7));

