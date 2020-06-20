import { decode } from "@vingle/bmp-js";
import * as fs from "fs-extra";
import * as sharp from "sharp";

export async function makeBmpThumbnail(source: string, destination: string): Promise<void> {
  const buf = fs.readFileSync(source);
  const bitmap = decode(buf, true);

  await sharp(bitmap.data, {
    raw: {
      width: bitmap.width,
      height: bitmap.height,
      channels: 4
    }
  })
    .resize(250, 250, { fit: "inside" })
    .png()
    .toFile(destination);
}
