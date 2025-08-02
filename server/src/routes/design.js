import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getDesigns,
  createDesign,
  updateDesign,
  deleteDesign
} from '../controllers/designController.js';

const router = express.Router();

// all /api/designs routes require a valid JWT
router.use(verifyToken);

router
  .route('/')
  .get(getDesigns)      // GET    /api/designs
  .post(createDesign);  // POST   /api/designs

router
  .route('/:id')
  .put(updateDesign)    // PUT    /api/designs/:id
  .delete(deleteDesign);// DELETE /api/designs/:id

export default router;
