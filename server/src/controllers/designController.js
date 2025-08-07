import Design from '../models/Design.js';
import createError from '../utils/createError.js';
import cloudinary from '../utils/cloudinary.js';

/**
 * GET /api/designs
 * Fetch all designs for the logged-in user
 */
export const getDesigns = async (req, res, next) => {
  try {
    const designs = await Design.find({ userId: req.userId }) 
      .sort({ createdAt: -1 });
    res.json(designs);
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/designs
 * Save a new design
 * Expects { title, jsonData, thumbnailUrl? } in req.body
 */
export const createDesign = async (req, res, next) => {
  try {
    const { title, jsonData, thumbnailUrl = '' } = req.body;
    if (!title || !jsonData) {
      return next(createError(400, 'Title and jsonData are required'));
    }
    const design = await Design.create({
      userId: req.userId,
      title,
      jsonData,
      thumbnailUrl
    });
    res.status(201).json(design);
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/designs/:id
 * Fetch a single design by its ID, but only if it belongs to the current user.
 */
export const getDesignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Find the design that matches both the ID and the current user
    //console.log(id," ","User id:",req.userId);
    const design = await Design.findOne({ _id: id, userId: req.userId });
    if (!design) {
      return next(createError(404, 'Design not found'));
    }
    //console.log(design);
    res.json(design);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/designs/:id
 * Update an existing design (only if it belongs to the user)
 */
export const updateDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const design = await Design.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    );
    if (!design) return next(createError(404, 'Design not found'));
    res.json(design);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/designs/:id
 * Delete a design by ID (only if it belongs to the user)
 */
export const deleteDesign = async (req, res, next) => {
  try {
    const { id } = req.params;
    // only delete your own
    const design = await Design.findOne({ _id: id, userId: req.userId });
    if (!design) return next(createError(404, 'Design not found'));

    // walk the JSON tree looking for image nodes with public_id
    const children = design.jsonData.children || [];
    children.forEach((el) => {
      if (el?.type === 'image' && el.public_id) {
        // fire-and-forget
        cloudinary.uploader.destroy(el.public_id).catch(console.error); 
      }
    });

    await design.deleteOne();
    res.json({ message: 'Design and its images removed.' });
  } catch (err) {
    next(err);
  }
};
