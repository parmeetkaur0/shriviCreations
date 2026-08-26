import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { formatDate, formatPrice, statusColor, statusLabel } from '../../utils/format';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const load = (page = 1) => {
    setLoading(true);
    orderService.getAll({ page, limit: 20, keyword, status }).then((res) => {
      setOrders(res.orders);
      setPagination({ page: res.page, pages: res.pages });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFilter = (e) => {
    e.preventDefault();
    load(1);
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Orders</h1>

      <form onSubmit={handleFilter} className="flex flex-wrap gap-3 mb-6">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by order number…"
            className="border border-ink/15 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-sage bg-white w-64"
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage bg-white">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
        </select>
        <button type="submit" className="btn-secondary text-sm px-5 py-2">Filter</button>
      </form>

      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="py-3 px-4">Order</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-ink/40">Loading…</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-ink/40">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">
                    <Link to={`/admin/orders/${order._id}`} className="font-medium hover:text-sage-dark">#{order.orderNumber}</Link>
                  </td>
                  <td className="py-3 px-4 text-ink/60">{order.user?.name}<br /><span className="text-xs">{order.user?.email}</span></td>
                  <td className="py-3 px-4 text-ink/60">{formatDate(order.createdAt)}</td>
                  <td className="py-3 px-4">{formatPrice(order.totalPrice)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColor(order.orderStatus)}`}>{statusLabel(order.orderStatus)}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }).map((_, i) => (
            <button key={i} onClick={() => load(i + 1)} className={`w-9 h-9 rounded-full text-sm ${pagination.page === i + 1 ? 'bg-ink text-cream' : 'bg-white text-ink'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
