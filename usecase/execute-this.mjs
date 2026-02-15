#!/usr/bin/env node

import pkg from '../dist/index.js';
const { Mbtiles2Pbf, FileExtension } = pkg;
await (new Mbtiles2Pbf(
  `test.mbtiles`, // src
  `tiles`, // dest
  FileExtension.PBF)
).run();
