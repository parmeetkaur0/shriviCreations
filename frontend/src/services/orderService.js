import api from './api';

export const orderService = {
  create: (data) => api.post('/orders', data).then((r) => r.data),
  getMyOrders: () => api.get('/orders/my-orders').then((r) => r.data),
  getById: (id) => api.get(`/orders/${id}`).then((r) => r.data),
  track: (orderNumber) => api.get(`/orders/track/${orderNumber}`).then((r) => r.data),
  cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }).then((r) => r.data),

  // Admin
  getAll: (params) => api.get('/orders', { params }).then((r) => r.data),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data).then((r) => r.data),
};
