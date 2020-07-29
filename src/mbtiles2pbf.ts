import fs from 'fs-extra';
import Database from 'better-sqlite3';
import zlib from 'zlib';

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
          .then((no_files: number) => {
            console.log(`${no_files} tiles were generated.`);
            resolve(no_files);
          })
          .catch((err) => {
            reject(err);
          });
      }
    );
  }

  extract() {
    return new Promise<number>(
      (resolve: (value?: number) => void, reject: (reason?: any) => void) => {
        try {
          const db = new Database(this.src, { readonly: true });
          const count = db.prepare('SELECT count(*) FROM tiles').get()[
            'count(*)'
          ];

          let c = 0;
          for (const r of db.prepare('SELECT * FROM tiles').iterate()) {
            const buf = zlib.unzipSync(r.tile_data);
            const z = r.zoom_level;
            const x = r.tile_column;
            const y = (1 << z) - r.tile_row - 1;
            fs.mkdirsSync(`${this.dist}/${z}/${x}`);
            fs.writeFileSync(`${this.dist}/${z}/${x}/${y}${this.ext}`, buf);
            this.report(++c, count, `${this.dist}/${z}/${x}/${y}${this.ext}`);
          }

          let metadata: { [key: string]: string } = {};
          var rows: Array<{ [key: string]: string }> = db
            .prepare('SELECT name, value FROM metadata')
            .all();
          rows.forEach((row: { [key: string]: string }) => {
            metadata[row.name] = row.value;
          });
          fs.writeFileSync(
            `${this.dist}/metadata.json`,
            JSON.stringify(metadata, null, 4)
          );

          db.close();
          resolve(c);
        } catch (err) {
          reject(err);
        }
      }
    );
  }

  report(c: number, count: number, path: string) {
    if (c === count || c % 1000 === 0) {
      console.log(
        `${c} of ${count} (${Math.round((c * 100.0) / count)}%) ${path}`
      );
    }
  }
}

export default mbtiles2pbf;
