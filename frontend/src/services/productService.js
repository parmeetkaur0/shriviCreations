import api from './api';

export const productService = {
  getAll: (params) => api.get('/products', { params }).then((r) => r.data),
  getBySlug: (slug) => api.get(`/products/${slug}`).then((r) => r.data),
  getRelated: (slug) => api.get(`/products/${slug}/related`).then((r) => r.data),
  getFeatured: () => api.get('/products/featured').then((r) => r.data),
  getBestSellers: () => api.get('/products/best-sellers').then((r) => r.data),
  getNewArrivals: () => api.get('/products/new-arrivals').then((r) => r.data),

  // Admin
  getAdminAll: (params) => api.get('/products/admin/all', { params }).then((r) => r.data),
  create: (formData) =>
    api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id, formData) =>
    api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  remove: (id) => api.delete(`/products/${id}`).then((r) => r.data),
  removeImage: (id, imageId) => api.delete(`/products/${id}/images/${imageId}`).then((r) => r.data),
};
