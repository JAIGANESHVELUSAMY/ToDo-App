import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Task API calls
export const getTasks = () => api.get('/api/tasks');
export const createTask = (taskData) => api.post('/api/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/api/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);

export default api;