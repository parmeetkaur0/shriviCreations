import api from './api';

export const couponService = {
  validate: (code, cartTotal) => api.post('/coupons/validate', { code, cartTotal }).then((r) => r.data),
  getAll: () => api.get('/coupons').then((r) => r.data),
  create: (data) => api.post('/coupons', data).then((r) => r.data),
  update: (id, data) => api.put(`/coupons/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/coupons/${id}`).then((r) => r.data),
};
