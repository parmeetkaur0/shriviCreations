import api from './api';

export const paymentService = {
  createOrder: (discountAmount = 0) => api.post('/payment/create-order', { discountAmount }).then((r) => r.data),
  verify: (data) => api.post('/payment/verify', data).then((r) => r.data),
};
