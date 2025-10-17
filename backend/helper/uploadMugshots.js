import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

export const uploadMugshots = upload.fields([
  { name: "mugshot_front", maxCount: 1 },
  { name: "mugshot_left", maxCount: 1 },
  { name: "mugshot_right", maxCount: 1 },
]);
