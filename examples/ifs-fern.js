import { makeFernIfs, BARNSLEY_FERN_COEFFICIENTS, BARNSLEY_FERN_PROBABILITIES, BARNSLEY_FERN_DOMAIN, CYCLOSORUS_FERN_COEFFICIENTS, CULCITA_FERN_COEFFICIENTS, CULCITA_FERN_PROBABILITIES, CYCLOSORUS_FERN_PROBABILITIES, CULCITA_FERN_DOMAIN, CYCLOSORUS_FERN_DOMAIN } from '../ifs/barnsley-fern';
import { simpleIfsChaosPlot } from '../ifs/chaos-game';
import { createImage, saveImage } from '../utils/picture';

const plot = async (path, width, height, ifs, domain, iterations) => {
  const image = createImage(width, height);
  const buffer = image.getImage().data;

  simpleIfsChaosPlot(buffer, width, height, ifs, null, domain, iterations);

  await saveImage(image, path);
};


let ifs = makeFernIfs(BARNSLEY_FERN_COEFFICIENTS, BARNSLEY_FERN_PROBABILITIES);
plot('barnsley-fern.png', 512, 512, ifs, BARNSLEY_FERN_DOMAIN, 1000000);

ifs = makeFernIfs(CYCLOSORUS_FERN_COEFFICIENTS, CYCLOSORUS_FERN_PROBABILITIES);
plot('cyclosorus-fern.png', 512, 512, ifs, CYCLOSORUS_FERN_DOMAIN, 1000000);

ifs = makeFernIfs(CULCITA_FERN_COEFFICIENTS, CULCITA_FERN_PROBABILITIES);
plot('culcita-fern.png', 512, 512, ifs, CULCITA_FERN_DOMAIN, 1000000);
