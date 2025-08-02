// controllers/adminAuth.js
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

export const adminRegister = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (await Admin.findOne({ email })) {
      return res.status(409).json({ message: 'Email already used' }); 
    }
    const admin = await Admin.create({ name, email, password });
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    res.status(201).json({ token, admin: { id: admin._id, name, email, role: 'admin' } });
  } catch (err) {
    next(err); 
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
    res.status(200).json({ token, admin: { id: admin._id, name: admin.name, email, role: 'admin' } });
  } catch (err) {
    next(err);
  }
};
