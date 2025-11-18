import multer from "multer";
import sharp from "sharp";

const storage = multer.memoryStorage();
export const uploadMugshots = multer({ storage }).fields([
  { name: "mugshot_front", maxCount: 1 },
  { name: "mugshot_left", maxCount: 1 },
  { name: "mugshot_right", maxCount: 1 },
]);

export const processMugshot = async (file) => {
  const buffer = await sharp(file.buffer)
    .resize(600)          
    .webp({ quality: 70 })
    .toBuffer();

  return buffer;
};
