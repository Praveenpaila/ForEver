import { Router } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { uploadImage } from "../controllers/uploadController.js";
import auth from "../middlewares/auth.js";
import adminOnly from "../middlewares/admin.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ storage });

router.post("/image", auth, adminOnly, upload.single("image"), uploadImage);

export default router;
