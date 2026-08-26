import api from './api';

export const categoryService = {
  getAll: (all = false) => api.get('/categories', { params: all ? { all: true } : {} }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/categories/${slug}`).then((r) => r.data),
  create: (formData) =>
    api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id, formData) =>
    api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  remove: (id) => api.delete(`/categories/${id}`).then((r) => r.data),
};
