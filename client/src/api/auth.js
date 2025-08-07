// src/api/auth.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL, // ensure this is correctly set in .env (e.g., http://localhost:5000)
});

// Authentication
export const registerUser = (data) => api.post('/api/auth/register', data); 
export const loginUser = (data) => api.post('/api/auth/login', data);
// export const UserSignIn = (data) => api.post('/api/auth/login', data);
// export const UserSignUp = (data) => api.post('/api/auth/register', data); 

export default api;
