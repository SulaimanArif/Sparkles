import axios from 'axios';

// Use relative URL when served from Django, or full URL for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set up auth token if it exists
const token = localStorage.getItem('auth_token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
}

// Helper to set auth token
api.setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Token ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Auth API endpoints
export const authAPI = {
  login: (username, password) => api.post('/auth/login/', { username, password }),
  logout: () => api.post('/auth/logout/'),
  checkAuth: () => api.get('/auth/check/'),
};

// Playlists API
export const playlistsAPI = {
  getAll: () => api.get('/playlists/'),
  getById: (id) => api.get(`/playlists/${id}/`),
  create: (data) => api.post('/playlists/', data),
  update: (id, data) => api.put(`/playlists/${id}/`, data),
  delete: (id) => api.delete(`/playlists/${id}/`),
  getVideos: (id) => api.get(`/playlists/${id}/videos/`),
};

// Videos API
export const videosAPI = {
  getAll: () => api.get('/videos/'),
  getById: (id) => api.get(`/videos/${id}/`),
  create: (data) => api.post('/videos/', data),
  update: (id, data) => api.put(`/videos/${id}/`, data),
  delete: (id) => api.delete(`/videos/${id}/`),
};

export default api;
