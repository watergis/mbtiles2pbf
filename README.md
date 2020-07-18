# mbtiles2pbf
![](https://github.com/watergis/mbtiles2pbf/workflows/Node.js%20Package/badge.svg)

This module will extract pbf files from mbtile by using mbutil.

## Requirements

This module depends on [MBUtil](https://github.com/mapbox/mbutil) of Python. Please install it before executing.

Git checkout (requires git)
```sh
git clone git://github.com/mapbox/mbutil.git
cd mbutil
# get usage
./mb-util -h
```

Then to install the mb-util command globally:
```sh
sudo python setup.py install
# then you can run:
mb-util
```

Python installation (requires easy_install)
```sh
easy_install mbutil
mb-util -h
```

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