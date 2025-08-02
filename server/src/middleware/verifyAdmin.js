// middleware/verifyAdmin.js
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const verifyAdmin = async (req, res, next) => {
  //console.log("Hii");
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];
  //console.log(token);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
     //console.log(admin); 
    req.admin = admin;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
