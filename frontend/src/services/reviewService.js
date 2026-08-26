import api from './api';

export const reviewService = {
  getForProduct: (productId) => api.get(`/reviews/product/${productId}`).then((r) => r.data),
  create: (productId, formData) =>
    api.post(`/reviews/product/${productId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id, data) => api.put(`/reviews/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/reviews/${id}`).then((r) => r.data),
  reply: (id, reply) => api.put(`/reviews/${id}/reply`, { reply }).then((r) => r.data),
};
