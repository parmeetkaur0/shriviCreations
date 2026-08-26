import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { bannerService } from '../../services/adminService';

const emptyForm = { title: '', subtitle: '', buttonText: 'Shop Now', buttonLink: '/shop', isActive: true, displayOrder: 0 };

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);

  const load = () => {
    setLoading(true);
    bannerService.getAll(true).then((res) => setBanners(res.banners)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error('Please choose a banner image');
      return;
    }
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('image', image);
      await bannerService.create(formData);
      toast.success('Banner created');
      setShowForm(false);
      setForm(emptyForm);
      setImage(null);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await bannerService.remove(id);
      toast.success('Banner deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Banners</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} /> New Banner
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card mb-8 space-y-4 max-w-lg">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">New Banner</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input placeholder="Subtitle" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input placeholder="Button Text" value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input placeholder="Button Link" value={form.buttonLink} onChange={(e) => setForm({ ...form, buttonLink: e.target.value })} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input required type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm" />
          <button type="submit" className="btn-primary text-sm">Save Banner</button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : banners.length === 0 ? (
        <p className="text-sm text-ink/50">No banners yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {banners.map((b) => (
            <div key={b._id} className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="aspect-[16/9] bg-blush/40">
                <img src={b.image.url} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{b.title}</p>
                  <p className="text-xs text-ink/50 mt-1">{b.subtitle}</p>
                </div>
                <button onClick={() => handleDelete(b._id)} className="text-ink/40 hover:text-red-500"><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
