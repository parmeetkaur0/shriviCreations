import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderService } from '../../services/orderService';
import { formatDate, formatPrice, statusColor, statusLabel } from '../../utils/format';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ orderStatus: '', trackingNumber: '', courierPartner: '', note: '' });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    orderService.getById(id).then((res) => {
      setOrder(res.order);
      setForm({
        orderStatus: res.order.orderStatus,
        trackingNumber: res.order.trackingNumber || '',
        courierPartner: res.order.courierPartner || '',
        note: '',
      });
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await orderService.updateStatus(id, form);
      toast.success('Order updated');
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-ink/50 text-sm">Loading order…</p>;
  if (!order) return null;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/orders" className="text-sm text-ink/50 hover:text-ink mb-4 inline-block">← Back to Orders</Link>
      <h1 className="font-display text-3xl mb-2">Order #{order.orderNumber}</h1>
      <p className="text-sm text-ink/50 mb-8">Placed on {formatDate(order.createdAt)} by {order.user?.name} ({order.user?.email})</p>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-medium mb-4">Items</h2>
          <ul className="divide-y divide-ink/10">
            {order.items.map((item, i) => (
              <li key={i} className="py-3 flex justify-between text-sm">
                <span>{item.name} {item.variant && `(${item.variant})`} × {item.quantity}</span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-ink/10 mt-3 pt-3 space-y-1 text-sm">
            <div className="flex justify-between text-ink/60"><span>Items</span><span>{formatPrice(order.itemsPrice)}</span></div>
            <div className="flex justify-between text-ink/60"><span>Shipping</span><span>{formatPrice(order.shippingPrice)}</span></div>
            {order.discountAmount > 0 && <div className="flex justify-between text-sage-dark"><span>Discount</span><span>-{formatPrice(order.discountAmount)}</span></div>}
            <div className="flex justify-between font-medium"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></div>
          </div>

          <h2 className="font-medium mt-6 mb-2">Shipping Address</h2>
          <p className="text-sm text-ink/70 leading-relaxed">
            {order.shippingAddress.fullName}<br />
            {order.shippingAddress.addressLine1}, {order.shippingAddress.addressLine2}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br />
            {order.shippingAddress.phone}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-medium mb-4">Update Order Status</h2>
          <div className="mb-4">
            <span className={`text-xs px-3 py-1.5 rounded-full ${statusColor(order.orderStatus)}`}>{statusLabel(order.orderStatus)}</span>
          </div>
          <form onSubmit={handleUpdate} className="space-y-4">
            <select value={form.orderStatus} onChange={(e) => setForm({ ...form, orderStatus: e.target.value })} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage bg-white">
              {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}
            </select>
            <input placeholder="Tracking Number" value={form.trackingNumber} onChange={(e) => setForm({ ...form, trackingNumber: e.target.value })} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
            <input placeholder="Courier Partner" value={form.courierPartner} onChange={(e) => setForm({ ...form, courierPartner: e.target.value })} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
            <textarea placeholder="Note (optional, shown in tracking history)" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage resize-none" />
            <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? 'Updating…' : 'Update Order'}</button>
          </form>

          <h2 className="font-medium mt-6 mb-3">Tracking History</h2>
          <ul className="space-y-2 text-xs text-ink/60">
            {order.trackingHistory?.slice().reverse().map((entry, i) => (
              <li key={i} className="border-l-2 border-sage/40 pl-3">
                <span className="font-medium text-ink">{statusLabel(entry.status)}</span> — {formatDate(entry.updatedAt)}
                {entry.note && <p>{entry.note}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;
