import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IndianRupee, ShoppingCart, Package, Users, AlertTriangle } from 'lucide-react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import { formatPrice, formatDate, statusColor, statusLabel } from '../../utils/format';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboard().then((res) => setData(res)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink/50 text-sm">Loading dashboard…</p>;
  if (!data) return null;

  const { stats, lowStockProducts, recentOrders, topProducts } = data;

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-10">
        <StatCard label="Total Revenue" value={formatPrice(stats.totalRevenue)} icon={IndianRupee} accent="gold" />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingCart} accent="sage" />
        <StatCard label="Products" value={stats.totalProducts} icon={Package} accent="sage" />
        <StatCard label="Customers" value={stats.totalUsers} icon={Users} accent="sage" />
        <StatCard label="Pending Orders" value={stats.pendingOrders} icon={AlertTriangle} accent="blush" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-display text-lg mb-5">Recent Orders</h2>
          <ul className="divide-y divide-ink/10">
            {recentOrders.map((order) => (
              <li key={order._id} className="py-3 flex items-center justify-between">
                <div>
                  <Link to={`/admin/orders/${order._id}`} className="text-sm font-medium hover:text-sage-dark">
                    #{order.orderNumber}
                  </Link>
                  <p className="text-xs text-ink/50">{order.user?.name} · {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatPrice(order.totalPrice)}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${statusColor(order.orderStatus)}`}>
                    {statusLabel(order.orderStatus)}
                  </span>
                </div>
              </li>
            ))}
            {recentOrders.length === 0 && <p className="text-sm text-ink/40 py-3">No orders yet.</p>}
          </ul>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-display text-lg mb-5 flex items-center gap-2">
            <AlertTriangle size={16} className="text-gold-dark" /> Low Stock Alerts
          </h2>
          <ul className="divide-y divide-ink/10">
            {lowStockProducts.map((p) => (
              <li key={p._id} className="py-3 flex items-center justify-between">
                <span className="text-sm">{p.name}</span>
                <span className="text-sm font-medium text-red-500">{p.stock} left</span>
              </li>
            ))}
            {lowStockProducts.length === 0 && <p className="text-sm text-ink/40 py-3">All products well stocked.</p>}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card mt-8">
        <h2 className="font-display text-lg mb-5">Top Selling Products</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topProducts.map((p) => (
            <div key={p._id} className="text-center">
              <div className="aspect-square rounded-xl overflow-hidden bg-blush/40 mb-2">
                {p.images?.[0] && <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />}
              </div>
              <p className="text-xs font-medium truncate">{p.name}</p>
              <p className="text-xs text-ink/50">{p.soldCount} sold</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
