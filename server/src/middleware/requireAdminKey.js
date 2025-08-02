import createError from '../utils/createError.js';

export function requireAdminKey(req, res, next) {
  const key = req.body.secretKey;
  if (!key) return next(createError(400, 'Missing admin secret key'));
  if (key !== process.env.ADMIN_SECRET_KEY) {
    return next(createError(401, 'Invalid admin key'));
  }
  next(); 
}
