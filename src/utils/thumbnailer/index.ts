import { makeKritaThumbnail } from "./krita";
import { makeBmpThumbnail } from "./bmp";
import { makeSharpThumbnail } from "./sharp";
import * as fs from "fs-extra";
import * as os from "os";
import * as path from "path";
import * as timers from "timers";
import * as util from "util";

export async function makeThumbnail(
  source: string,
  destination: string,
  timeoutLength = 100
): Promise<void> {
  const ext = path.extname(source).toLowerCase();
  const tmpdir = os.tmpdir();
  const tmpPath = path.join(tmpdir, path.basename(source));
  const timeout = util.promisify(timers.setTimeout);
  await timeout(timeoutLength);
  fs.copyFileSync(source, tmpPath);
  switch (ext) {
    case ".kra":
      await makeKritaThumbnail(source, destination);
      break;
    case ".bmp":
      await makeBmpThumbnail(source, destination);
      break;
    default:
      await makeSharpThumbnail(source, destination);
  }
  fs.remove(tmpPath);
}
