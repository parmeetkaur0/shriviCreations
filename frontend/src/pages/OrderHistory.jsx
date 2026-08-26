import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatDate, formatPrice, statusColor, statusLabel } from '../utils/format';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getMyOrders().then((res) => setOrders(res.orders)).finally(() => setLoading(false));
  }, []);

  if (!loading && orders.length === 0) {
    return (
      <div className="container-custom py-24 text-center">
        <Package size={40} className="mx-auto text-ink/30 mb-4" strokeWidth={1.2} />
        <h1 className="font-display text-3xl mb-3">No Orders Yet</h1>
        <p className="text-ink/60 mb-8">Once you place an order, it'll show up here.</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-14">
      <h1 className="section-title mb-10">Your Orders</h1>

      {loading ? (
        <p className="text-sm text-ink/50">Loading your orders…</p>
      ) : (
        <ul className="space-y-5">
          {orders.map((order) => (
            <li key={order._id}>
              <Link
                to={`/orders/${order._id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-ink/10 rounded-2xl p-6 hover:border-sage transition-colors"
              >
                <div>
                  <p className="text-sm text-ink/50 mb-1">Order #{order.orderNumber}</p>
                  <p className="font-medium">{order.items.length} item{order.items.length > 1 ? 's' : ''} · {formatPrice(order.totalPrice)}</p>
                  <p className="text-xs text-ink/40 mt-1">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full w-fit ${statusColor(order.orderStatus)}`}>
                  {statusLabel(order.orderStatus)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
