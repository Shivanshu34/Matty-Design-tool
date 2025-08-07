// src/controllers/uploadController.js
import cloudinary from '../utils/cloudinary.js';
import createError from '../utils/createError.js';

// existing upload handler (multer + CloudinaryStorage)
export const uploadImage = async (req, res, next) => {
  try {
    // multer-storage-cloudinary puts:
    //  req.file.path      → the secure URL
    //  req.file.filename  → the public_id on Cloudinary
    const { path: url, filename: public_id } = req.file;
    res.json({ url, public_id });
  } catch (err) {
    next(err);
  }
};

// new DELETE handler
export const deleteImage = async (req, res, next) => {
  try {
    const { public_id } = req.body;
    if (!public_id) return next(createError(400, 'public_id required'));
    await cloudinary.uploader.destroy(public_id);
    res.json({ message: 'Image removed from Cloudinary' });
  } catch (err) {
    next(err);
  }
};
