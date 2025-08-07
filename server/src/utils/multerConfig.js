// src/utils/multerConfig.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'matty-designs',
    format: async (req, file) => 'png',   
    public_id: (req, file) => `${req.userId || 'anon'}_${Date.now()}`,
  },
});

// create the multer instance
const upload = multer({ storage });

// export it both as default and as a named “parser”
export const parser = upload;
export default upload;
