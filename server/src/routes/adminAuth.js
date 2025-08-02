// routes/adminAuth.js
import express from 'express';
import { adminRegister, adminLogin } from '../controllers/adminAuth.js'; 
import { requireAdminKey } from '../middleware/requireAdminKey.js';
import { verifyToken } from '../middleware/auth.js';
import { logout } from '../controllers/authController.js';

const router = express.Router();
router.post('/register', requireAdminKey, adminRegister);
router.post('/login', adminLogin); 
router.post("/logout", verifyToken, logout);     

export default router; 
