import * as sharp from "sharp";

export const makeSharpThumbnail = (
  source: string,
  destination: string
): Promise<sharp.OutputInfo> =>
  sharp(source, { density: 600 })
    .resize(250, 250, { fit: "inside" })
    .png()
    .toFile(destination);
