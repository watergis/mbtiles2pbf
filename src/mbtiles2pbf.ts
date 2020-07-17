import {execSync} from 'child_process'
import fs from 'fs'
import path from 'path'
import zlib from 'zlib'
import rimraf from 'rimraf'

class mbtiles2pbf{
    private src: string
    private dist: string
    private ext: string

    /**
     * Constructor
     * @param src string file path of mbtiles
     * @param dist string directory path for pbf vector tiles
     * @param ext string Extension for vectortiles. Default is ".pbf".
     */
    constructor(src:string, dist:string, ext?: string){
        this.src = src
        this.dist = dist
        this.ext = (ext)?ext:'.pbf'
    }

    run(){
        return new Promise<number>((resolve: (value?:number) => void, reject: (reason?: any) => void) =>{
            this.extract()
            .then((dist:string) =>{return this.getFiles(dist)})
            .then((files:string[]) => {return this.gunzip(files)})
            .then((no_files:number)=>{
                console.log(`${no_files} tiles were unzipped.`)
                resolve(no_files)
            })
            .catch(err=> {reject(err)});
        })
    }

    extract(){
        return new Promise<string>((resolve: (value?:string) => void, reject: (reason?: any) => void) =>{
            if (fs.existsSync(this.dist)){
                rimraf.sync(this.dist)
            }
            execSync(`mb-util ${this.src} ${this.dist} --scheme=xyz --image_format=pbf --silent`)
            console.log(`pbf files were extracted under ${this.dist}.`)
            resolve(this.dist)
        })
    }

    getFiles(dir: string){
        return new Promise<string[]>((resolve: (value?:string[]) => void, reject: (reason?: any) => void) =>{
            let files: string[] = [];
            const dirents = fs.readdirSync(dir, {withFileTypes: true})
            dirents.forEach(dirent=>{
                const fp = path.join(dir, dirent.name)
                if (dirent.isDirectory()) {
                    this.getFiles(fp).then((_files:string[])=>{
                        _files.forEach((f:string)=>{
                            files.push(f)
                        })
                    });
                } else {
                    files.push(fp)
                }
            })
            resolve(files);
        });
    }

    gunzip(files:string[]){
        return new Promise<number>((resolve: (value?:number) => void, reject: (reason?: any) => void) =>{
            files.forEach((f:string)=>{
                var gzipContent = fs.readFileSync(f)
                var ext = path.extname(f)
                if (ext !== '.pbf'){
                    return
                }
                const binary = zlib.gunzipSync(gzipContent)
                let f2 = f
                if (this.ext !== '.pbf'){
                    f2 = f.replace('.pbf', this.ext)
                }
                fs.writeFileSync(f2, binary)
                fs.unlinkSync(f)
                console.log(f2)
            })
            resolve(files.length)
        });
    }
}

export default mbtiles2pbf