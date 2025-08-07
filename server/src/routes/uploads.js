// src/routes/uploads.js
import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { parser } from '../utils/multerConfig.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// upload new image
router.post('/image', verifyToken, parser.single('designImage'), uploadImage);

// delete by public_id
router.delete('/image', verifyToken, deleteImage);

export default router;
