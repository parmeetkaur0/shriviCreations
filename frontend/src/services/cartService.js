import api from './api';

export const cartService = {
  get: () => api.get('/cart').then((r) => r.data),
  add: (productId, quantity = 1, variant) => api.post('/cart', { productId, quantity, variant }).then((r) => r.data),
  update: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity }).then((r) => r.data),
  remove: (itemId) => api.delete(`/cart/${itemId}`).then((r) => r.data),
  clear: () => api.delete('/cart').then((r) => r.data),
  applyCoupon: (code) => api.put('/cart/coupon', { code }).then((r) => r.data),
};
