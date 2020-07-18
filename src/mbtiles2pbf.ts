import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import rimraf from 'rimraf';

export const FileExtension = {
  PBF: '.pbf',
  MVT: '.mvt',
} as const;
type FileExtension = typeof FileExtension[keyof typeof FileExtension];

class mbtiles2pbf {
  private src: string;
  private dist: string;
  private ext: FileExtension;

  /**
   * Constructor
   * @param src string file path of mbtiles
   * @param dist string directory path for pbf vector tiles
   * @param ext string Extension for vectortiles. Default is ".pbf".
   */
  constructor(src: string, dist: string, ext?: FileExtension) {
    this.src = src;
    this.dist = dist;
    this.ext = ext ? ext : FileExtension.PBF;
  }

  run() {
    return new Promise<number>(
      (resolve: (value?: number) => void, reject: (reason?: any) => void) => {
        this.extract()
          .then((dist: string) => {
            return this.getFiles(dist);
          })
          .then((files: string[]) => {
            return this.gunzip(files);
          })
          .then((no_files: number) => {
            console.log(`${no_files} tiles were unzipped.`);
            resolve(no_files);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  extract() {
    return new Promise<string>(
      (resolve: (value?: string) => void, reject: (reason?: any) => void) => {
        try {
          if (fs.existsSync(this.dist)) {
            rimraf.sync(this.dist);
          }
          execSync(
            `mb-util ${this.src} ${this.dist} --scheme=xyz --image_format=pbf --silent`
          );
          console.log(`pbf files were extracted under ${this.dist}.`);
          resolve(this.dist);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  getFiles(dir: string) {
    return new Promise<string[]>(
      (resolve: (value?: string[]) => void, reject: (reason?: any) => void) => {
        try {
          let files: string[] = [];
          const dirents = fs.readdirSync(dir, { withFileTypes: true });
          dirents.forEach((dirent) => {
            const fp = path.join(dir, dirent.name);
            if (dirent.isDirectory()) {
              this.getFiles(fp).then((_files: string[]) => {
                _files.forEach((f: string) => {
                  files.push(f);
                });
              });
            } else {
              files.push(fp);
            }
          });
          resolve(files);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  gunzip(files: string[]) {
    return new Promise<number>(
      (resolve: (value?: number) => void, reject: (reason?: any) => void) => {
        try {
          files.forEach((f: string) => {
            var gzipContent = fs.readFileSync(f);
            var ext = path.extname(f);
            if (ext !== FileExtension.PBF) {
              return;
            }
            const binary = zlib.gunzipSync(gzipContent);
            let f2 = f;
            if (this.ext !== FileExtension.PBF) {
              f2 = f.replace(FileExtension.PBF, this.ext);
            }
            fs.writeFileSync(f2, binary);
            fs.unlinkSync(f);
            console.log(f2);
          });
          resolve(files.length);
        } catch (err) {
          reject(err);
        }
      }
    );
  }
}

export default mbtiles2pbf;
