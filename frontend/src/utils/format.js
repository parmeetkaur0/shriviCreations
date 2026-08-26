export const formatPrice = (amount = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const truncate = (text = '', length = 100) =>
  text.length > length ? `${text.slice(0, length).trim()}…` : text;

export const getProductFinalPrice = (product) =>
  product?.discountPrice > 0 ? product.discountPrice : product?.price || 0;

export const statusLabel = (status = '') =>
  status
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const statusColor = (status) => {
  const map = {
    pending: 'bg-blush text-ink',
    confirmed: 'bg-sage-50 text-sage-dark',
    processing: 'bg-gold-light/40 text-gold-dark',
    shipped: 'bg-sage/20 text-sage-dark',
    out_for_delivery: 'bg-gold/20 text-gold-dark',
    delivered: 'bg-sage text-cream',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-200 text-gray-700',
  };
  return map[status] || 'bg-blush text-ink';
};
