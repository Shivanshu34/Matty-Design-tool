// src/utils/createError.js
export default function createError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}
