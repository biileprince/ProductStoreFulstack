import axios from 'axios';

// Create base URL from environment variable
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      return Promise.reject({
        message: error.response.data.message || 'Server error',
        status: error.response.status
      });
    } else if (error.request) {
      return Promise.reject({ message: 'Network error' });
    } else {
      return Promise.reject({ message: 'Request failed' });
    }
  }
);

// Define API endpoints
const PRODUCTS_API = `${baseURL}/api/products`;

export const getProducts = async () => {
  const response = await api.get(PRODUCTS_API);
  return response.data.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`${PRODUCTS_API}/${id}`);
  return response.data.data;
};

export const createProduct = async (formData) => {
  const response = await api.post(PRODUCTS_API, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const updateProduct = async (id, formData) => {
  const response = await api.put(`${PRODUCTS_API}/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data.data;
};

export const deleteProduct = async (id) => {
  const response = await api.delete(`${PRODUCTS_API}/${id}`);
  return response.data.data;
};