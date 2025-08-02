import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import createError from '../utils/createError.js';
import BlacklistedToken from "../models/BlacklistedToken.js";

const signJwt = (user) => jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '1d' } 
);

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return next(createError(409, 'Email in use')); 
    const user = await User.create({ name, email, password, role });
    const token = signJwt(user);
    res.status(201).json({ token, user: { id: user._id, name, email, role } }); 
  } catch (err) {
    next(err);
  } 
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) 
      return next(createError(401, 'Invalid credentials'));
    const token = signJwt(user);
    res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await BlacklistedToken.create({ token });
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
