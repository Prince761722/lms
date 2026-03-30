import path from "path";
import multer from "multer";

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB

  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (_req, file, cb) => {
      const uniqueName = Date.now() + "-" + file.originalname;
      cb(null, uniqueName);
    },
  }),

  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".webp" &&
      ext !== ".mp4" &&
      ext !== ".gif"
    ) {
      return cb(new Error(`Only images & mp4 allowed! ${ext}`));
    }

    cb(null, true);
  },
});

export default upload;