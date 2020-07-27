# mbtiles2pbf
![](https://github.com/watergis/mbtiles2pbf/workflows/Node.js%20Package/badge.svg)

This module will extract pbf files from mbtile by using Nodejs.

## Installation

```
npm install @watergis/mbtiles2pbf
```

## Execute

```js
const {Mbtiles2Pbf, FileExtension} = require('@watergis/mbtiles2pbf');

const src = __dirname + '/test.mbtiles'
const dist = __dirname + '/tiles'

const mbtile2pbf = new Mbtiles2Pbf(src, dist, FileExtension.MVT);
mbtile2pbf.run()
.then(no_files=>{console.log(no_files)})
.catch(err=>{console.log(err)})
```

## Test

```
npm test
```