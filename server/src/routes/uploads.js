// src/routes/uploads.js
import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { upload } from '../utils/multerConfig.js';

const router = express.Router();

router.post(
  '/image',
  verifyToken,
  upload.single('designImage'),
  (req, res) => {
    // multer + cloudinary returns `req.file`
    const url = req.file.path;          // cloudinary URL
    res.json({ url });
  }
);

export default router;
