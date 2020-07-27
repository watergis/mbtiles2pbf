/* eslint-env jest */

import { Mbtiles2Pbf, FileExtension } from '../src/index';
import rimraf from 'rimraf';

const src = __dirname + '/test.mbtiles';
const dist = __dirname + '/tiles';

describe('extract vector tiles', (): void => {
  test('extract to pbf', async () => {
    const mbtile2pbf = new Mbtiles2Pbf(src, dist, FileExtension.PBF);
    const res = await mbtile2pbf.run();
    expect(res).toBe(36);
    rimraf.sync(dist);
  });
  test('extract to mvt', async () => {
    const mbtile2pbf = new Mbtiles2Pbf(src, dist, FileExtension.MVT);
    const res = await mbtile2pbf.run();
    expect(res).toBe(36);
    rimraf.sync(dist);
  });
});
