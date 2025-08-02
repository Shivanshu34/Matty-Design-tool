// src/utils/multerConfig.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'matty-designs',
    format: async (req, file) => 'png',   // force PNG export
    public_id: (req, file) => `${req.userId}_${Date.now()}`,
  }
});

export const upload = multer({ storage });
