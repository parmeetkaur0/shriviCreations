import api from './api';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard').then((r) => r.data),
  getSalesReport: (params) => api.get('/admin/reports/sales', { params }).then((r) => r.data),
};

export const userService = {
  getAll: (params) => api.get('/users', { params }).then((r) => r.data),
  getById: (id) => api.get(`/users/${id}`).then((r) => r.data),
  update: (id, data) => api.put(`/users/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/users/${id}`).then((r) => r.data),
  updateProfile: (formData) =>
    api.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  addAddress: (data) => api.post('/users/addresses', data).then((r) => r.data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data).then((r) => r.data),
  removeAddress: (id) => api.delete(`/users/addresses/${id}`).then((r) => r.data),
};

export const bannerService = {
  getAll: (all = false) => api.get('/banners', { params: all ? { all: true } : {} }).then((r) => r.data),
  create: (formData) =>
    api.post('/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  update: (id, formData) =>
    api.put(`/banners/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data),
  remove: (id) => api.delete(`/banners/${id}`).then((r) => r.data),
};
