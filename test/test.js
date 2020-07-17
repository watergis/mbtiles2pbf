const {Mbtiles2Pbf} = require('../dist/index')
const { expect } = require('chai')
const rimraf = require('rimraf')

const src = __dirname + '/test.mbtiles'
const dist = __dirname + '/tiles'

describe('extract vector tiles', ()=>{
    it('extract to pbf', async ()=>{
        const mbtile2pbf = new Mbtiles2Pbf(src, dist)
        const res = await mbtile2pbf.run()
        expect(res).equal(37);
        rimraf.sync(dist)
    })
    it('extract to mvt', async ()=>{
        const mbtile2pbf = new Mbtiles2Pbf(src, dist, '.mvt')
        const res = await mbtile2pbf.run()
        expect(res).equal(37);
        rimraf.sync(dist)
    })
})