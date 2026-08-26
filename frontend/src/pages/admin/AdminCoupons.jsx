import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { couponService } from '../../services/couponService';
import { formatDate } from '../../utils/format';

const emptyForm = { code: '', description: '', discountType: 'percentage', discountValue: '', minPurchaseAmount: '', maxDiscountAmount: '', usageLimit: 100, validUntil: '' };

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () => {
    setLoading(true);
    couponService.getAll().then((res) => setCoupons(res.coupons)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await couponService.create(form);
      toast.success('Coupon created');
      setShowForm(false);
      setForm(emptyForm);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await couponService.remove(id);
      toast.success('Coupon deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Coupons</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} /> New Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card mb-8 grid sm:grid-cols-2 gap-4 max-w-2xl">
          <div className="flex justify-between items-center sm:col-span-2">
            <h2 className="font-medium">New Coupon</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <input required placeholder="Coupon Code (e.g. WELCOME10)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage bg-white">
            <option value="percentage">Percentage Off</option>
            <option value="flat">Flat Amount Off</option>
          </select>
          <input required type="number" placeholder="Discount Value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input type="number" placeholder="Min Purchase Amount" value={form.minPurchaseAmount} onChange={(e) => setForm({ ...form, minPurchaseAmount: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input type="number" placeholder="Max Discount Amount (for %)" value={form.maxDiscountAmount} onChange={(e) => setForm({ ...form, maxDiscountAmount: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input type="number" placeholder="Usage Limit" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input required type="date" value={form.validUntil} onChange={(e) => setForm({ ...form, validUntil: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <button type="submit" className="btn-primary text-sm sm:col-span-2">Create Coupon</button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="py-3 px-4">Code</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Used</th>
              <th className="py-3 px-4">Valid Until</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-ink/40">Loading…</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-ink/40">No coupons yet.</td></tr>
            ) : (
              coupons.map((c) => (
                <tr key={c._id} className="border-b border-ink/5">
                  <td className="py-3 px-4 font-medium">{c.code}</td>
                  <td className="py-3 px-4">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                  <td className="py-3 px-4">{c.usedCount} / {c.usageLimit}</td>
                  <td className="py-3 px-4 text-ink/60">{formatDate(c.validUntil)}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${c.isActive ? 'bg-sage-50 text-sage-dark' : 'bg-blush text-ink/50'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button onClick={() => handleDelete(c._id)} className="text-ink/50 hover:text-red-500"><Trash2 size={15} /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCoupons;
