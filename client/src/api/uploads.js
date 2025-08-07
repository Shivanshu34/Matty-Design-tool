import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
});

// call Cloudinary‐delete endpoint
export const deleteImageCloud = (publicId, token) =>
  api.delete('/api/uploads/image', {
    data: { public_id: publicId },
    headers: { Authorization: `Bearer ${token}` }
  });
