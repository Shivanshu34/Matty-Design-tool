import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_REACT_APP_API_URL,
  // withCredentials: true, // only if you use cookies/sessions
});

/**
 * Fetch all the current user's designs.
 * @param {string} token  JWT from Redux state
 */
export const getDesigns = (token) =>
  api.get('/api/designs', {
    headers: { Authorization: `Bearer ${token}` }
  });

/**
 * Fetch a single design by ID.
 * @param {string} id     Design _id
 * @param {string} token  JWT from Redux state
 */
export const getDesignById = (id, token) =>
  api.get(`/api/designs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

/**
 * Delete a specific design by ID.
 * @param {string} id     Design _id
 * @param {string} token  JWT from Redux state
 */
export const deleteDesign = (id, token) =>
  api.delete(`/api/designs/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

/**
 * Create a new design.
 * @param {object} designData  { title, jsonData, thumbnailUrl }
 * @param {string} token       JWT from Redux state
 */
export const createDesign = (designData, token) =>
  api.post('/api/designs', designData, {
    headers: { Authorization: `Bearer ${token}` }
  });

/**
 * Update an existing design.
 * @param {string} id          Design _id
 * @param {object} updatedData Partial design fields to update
 * @param {string} token       JWT from Redux state
 */
export const updateDesign = (id, updatedData, token) =>
  api.put(`/api/designs/${id}`, updatedData, {
    headers: { Authorization: `Bearer ${token}` }
  });

export default api;
