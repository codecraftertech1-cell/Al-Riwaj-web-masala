// API Configuration - Connect React Frontend with Laravel Backend
// Using relative path - goes through Vite proxy to Laravel backend
const API_BASE_URL = '/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('admin_token');

// Helper function for API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Add token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    headers,
    ...options,
  };

  console.log('API Call:', url, config);

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log('API Response:', url, data);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', url, error);
    throw error;
  }
};

// Helper function for multipart/form-data API calls (file uploads)
const apiCallMultipart = async (endpoint, formData) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = getToken();
  const headers = {
    'Accept': 'application/json',
  };
  
  // Add token if available
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method: 'POST',
    headers,
    body: formData,
  };

  console.log('API Upload:', url, config);

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log('API Response:', url, data);
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', url, error);
    throw error;
  }
};

// ==================== PUBLIC API (Frontend - React) ====================

// Categories
export const getCategories = () => apiCall('/categories');
export const getCategory = (id) => apiCall(`/categories/${id}`);

// Products
export const getProducts = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/products${queryString ? `?${queryString}` : ''}`);
};
export const getFeaturedProducts = () => apiCall('/products?featured=true');
export const getProduct = (id) => apiCall(`/products/${id}`);

// Site Sections
export const getSections = () => apiCall('/sections');
export const getSectionByKey = (key) => apiCall(`/sections/${key}`);

// Media
export const getMedia = (category = '') => apiCall(`/media${category ? `?category=${category}` : ''}`);

// Distributors
export const getDistributors = (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  return apiCall(`/distributors${queryString ? `?${queryString}` : ''}`);
};

// ==================== ADMIN API (Backend - Laravel) ====================

// Categories (Admin)
export const createCategory = (data) => apiCall('/admin/categories', { method: 'POST', body: JSON.stringify(data) });
export const updateCategory = (id, data) => apiCall(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteCategory = (id) => apiCall(`/admin/categories/${id}`, { method: 'DELETE' });

// Products (Admin)
export const createProduct = (data) => apiCall('/admin/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id, data) => apiCall(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProduct = (id) => apiCall(`/admin/products/${id}`, { method: 'DELETE' });

// Site Sections (Admin)
export const createSection = (data) => apiCall('/admin/sections', { method: 'POST', body: JSON.stringify(data) });
export const updateSection = (id, data) => apiCall(`/admin/sections/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSection = (id) => apiCall(`/admin/sections/${id}`, { method: 'DELETE' });

// Media (Admin)
export const createMedia = (data) => apiCall('/admin/media', { method: 'POST', body: JSON.stringify(data) });
export const updateMedia = (id, data) => apiCall(`/admin/media/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteMedia = (id) => apiCall(`/admin/media/${id}`, { method: 'DELETE' });

// File Upload (Admin)
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiCallMultipart('/admin/media/upload', formData);
};

export const deleteImage = async (filePath) => {
  return apiCall('/admin/media/delete-file', { 
    method: 'POST', 
    body: JSON.stringify({ file_path: filePath }) 
  });
};

// Distributors (Admin)
export const createDistributor = (data) => apiCall('/admin/distributors', { method: 'POST', body: JSON.stringify(data) });
export const updateDistributor = (id, data) => apiCall(`/admin/distributors/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteDistributor = (id) => apiCall(`/admin/distributors/${id}`, { method: 'DELETE' });

// ==================== AUTH ====================
export const login = async (email, password) => {
  const response = await apiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  if (response.success && response.data.token) {
    localStorage.setItem('admin_token', response.data.token);
    localStorage.setItem('admin_user', JSON.stringify(response.data.user));
  }
  return response;
};

export const logout = async () => {
  try {
    await apiCall('/admin/auth/logout', { method: 'POST' });
  } catch (e) {
    console.log('Logout error:', e);
  }
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('admin_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('admin_token');
};

export default {
  // Public
  getCategories,
  getCategory,
  getProducts,
  getFeaturedProducts,
  getProduct,
  getSections,
  getSectionByKey,
  getMedia,
  getDistributors,
  // Admin
  createCategory,
  updateCategory,
  deleteCategory,
  createProduct,
  updateProduct,
  deleteProduct,
  createSection,
  updateSection,
  deleteSection,
  createMedia,
  updateMedia,
  deleteMedia,
  uploadImage,
  deleteImage,
  createDistributor,
  updateDistributor,
  deleteDistributor,
  // Auth
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};
