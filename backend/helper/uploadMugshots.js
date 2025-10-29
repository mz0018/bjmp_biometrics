import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const uploadDir = "uploads/mugshots";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.memoryStorage();
export const uploadMugshots = multer({ storage }).fields([
  { name: "mugshot_front", maxCount: 1 },
  { name: "mugshot_left", maxCount: 1 },
  { name: "mugshot_right", maxCount: 1 },
]);

export const saveMugshotAsWebP = async (file, filenameBase) => {
  const filename = `${filenameBase}.webp`;              
  const outputPath = path.join(uploadDir, filename);  

  await sharp(file.buffer)
    .resize(600)
    .toFormat("webp", { quality: 70 })
    .toFile(outputPath);

  return filename;                                     
};
