import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Circle, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import { orderService } from '../services/orderService';
import { formatDate, formatPrice, statusColor, statusLabel } from '../utils/format';

const TIMELINE_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const load = () => {
    setLoading(true);
    orderService.getById(id).then((res) => setOrder(res.order)).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      await orderService.cancel(id, 'Cancelled by customer from account page');
      toast.success('Order cancelled');
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="container-custom py-20 text-center text-ink/50">Loading order…</div>;
  if (!order) return null;

  const isCancelled = order.orderStatus === 'cancelled';
  const currentStepIndex = TIMELINE_STEPS.indexOf(order.orderStatus);
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.orderStatus);

  return (
    <div className="container-custom py-14 max-w-4xl">
      <Link to="/orders" className="text-sm text-ink/50 hover:text-ink mb-6 inline-block">← Back to Orders</Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-3xl">Order #{order.orderNumber}</h1>
          <p className="text-sm text-ink/50 mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusColor(order.orderStatus)}`}>
          {statusLabel(order.orderStatus)}
        </span>
      </div>

      {!isCancelled && (
        <div className="mb-12 bg-blush/30 rounded-3xl p-7">
          <div className="flex items-center justify-between relative">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={step} className="flex-1 flex flex-col items-center relative z-10">
                {i <= currentStepIndex ? (
                  <CheckCircle2 size={24} className="text-sage-dark fill-sage-50" />
                ) : (
                  <Circle size={24} className="text-ink/20" />
                )}
                <p className={`text-[11px] mt-2 text-center ${i <= currentStepIndex ? 'text-ink' : 'text-ink/40'}`}>
                  {statusLabel(step)}
                </p>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`absolute top-3 left-1/2 w-full h-0.5 ${i < currentStepIndex ? 'bg-sage-dark' : 'bg-ink/15'}`}
                  />
                )}
              </div>
            ))}
          </div>

          {order.trackingNumber && (
            <div className="mt-8 flex items-center gap-3 text-sm border-t border-ink/10 pt-5">
              <Truck size={18} className="text-sage-dark" />
              <span>Tracking No: <strong>{order.trackingNumber}</strong>{order.courierPartner && ` via ${order.courierPartner}`}</span>
            </div>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_320px] gap-10">
        <div>
          <h2 className="font-display text-xl mb-5">Items</h2>
          <ul className="divide-y divide-ink/10">
            {order.items.map((item, i) => (
              <li key={i} className="py-4 flex gap-4">
                <div className="w-16 h-20 rounded-xl overflow-hidden bg-blush/40 shrink-0">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{item.name}</p>
                  {item.variant && <p className="text-xs text-ink/50">{item.variant}</p>}
                  <p className="text-sm text-ink/60 mt-1">{item.quantity} × {formatPrice(item.price)}</p>
                </div>
              </li>
            ))}
          </ul>

          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling} className="btn-secondary text-sm mt-6">
              {cancelling ? 'Cancelling…' : 'Cancel Order'}
            </button>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-display text-xl mb-4">Shipping To</h2>
            <p className="text-sm text-ink/70 leading-relaxed">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
              {order.shippingAddress.phone}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl mb-4">Payment Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-ink/70"><span>Items</span><span>{formatPrice(order.itemsPrice)}</span></div>
              <div className="flex justify-between text-ink/70"><span>Shipping</span><span>{order.shippingPrice === 0 ? 'Free' : formatPrice(order.shippingPrice)}</span></div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-sage-dark"><span>Discount</span><span>-{formatPrice(order.discountAmount)}</span></div>
              )}
              <div className="flex justify-between font-medium border-t border-ink/10 pt-2 mt-2">
                <span>Total</span><span>{formatPrice(order.totalPrice)}</span>
              </div>
            </div>
            <p className="text-xs text-ink/40 mt-3">
              {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.isPaid ? 'Paid Online' : 'Payment Pending'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
