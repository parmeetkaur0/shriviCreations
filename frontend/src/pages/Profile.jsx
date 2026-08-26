import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LogOut, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { setUser, logout } from '../store/slices/authSlice';
import { userService } from '../services/adminService';

const emptyAddress = { label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false };

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState(emptyAddress);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name, phone: user.phone || '' });
      setAddresses(user.addresses || []);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      const res = await userService.updateProfile(formData);
      dispatch(setUser(res.user));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await userService.addAddress(addressForm);
      setAddresses(res.addresses);
      setShowAddressForm(false);
      setAddressForm(emptyAddress);
      toast.success('Address added');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRemoveAddress = async (id) => {
    try {
      const res = await userService.removeAddress(id);
      setAddresses(res.addresses);
      toast.success('Address removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="container-custom py-14 max-w-3xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="section-title">My Account</h1>
          <p className="text-ink/60 mt-2">{user?.email}</p>
        </div>
        <button onClick={() => dispatch(logout())} className="flex items-center gap-2 text-sm text-ink/60 hover:text-red-500 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="flex gap-6 border-b border-ink/10 mb-8">
        {['profile', 'addresses'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 text-sm capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-gold text-ink font-medium' : 'border-transparent text-ink/50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-md">
          <div>
            <label className="text-sm font-medium block mb-2">Full Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Phone Number</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      )}

      {tab === 'addresses' && (
        <div>
          <div className="space-y-4 mb-6">
            {addresses.map((addr) => (
              <div key={addr._id} className="border border-ink/10 rounded-2xl p-5 flex justify-between gap-4">
                <div className="text-sm">
                  <p className="font-medium">{addr.fullName} {addr.isDefault && <span className="text-xs text-sage-dark ml-2">(Default)</span>}</p>
                  <p className="text-ink/60 mt-1">{addr.addressLine1}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                  <p className="text-ink/60">{addr.phone}</p>
                </div>
                <button onClick={() => handleRemoveAddress(addr._id)} className="text-ink/40 hover:text-red-500 h-fit" aria-label="Remove address">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {!showAddressForm ? (
            <button onClick={() => setShowAddressForm(true)} className="flex items-center gap-2 text-sm text-sage-dark hover:underline">
              <Plus size={15} /> Add New Address
            </button>
          ) : (
            <form onSubmit={handleAddAddress} className="grid sm:grid-cols-2 gap-4 border border-ink/15 rounded-2xl p-5">
              <input required placeholder="Full Name" value={addressForm.fullName} onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
              <input required placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
              <input required placeholder="Address Line 1" value={addressForm.addressLine1} onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
              <input required placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
              <input required placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
              <input required placeholder="Postal Code" value={addressForm.postalCode} onChange={(e) => setAddressForm({ ...addressForm, postalCode: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                Set as default
              </label>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" className="btn-primary text-sm">Save Address</button>
                <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary text-sm">Cancel</button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
