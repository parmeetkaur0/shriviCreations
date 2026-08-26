import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { categoryService } from '../../services/categoryService';

const emptyForm = { name: '', description: '', isFeatured: false, isActive: true, displayOrder: 0 };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);

  const load = () => {
    setLoading(true);
    categoryService.getAll(true).then((res) => setCategories(res.categories)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImage(null);
    setShowForm(true);
  };

  const openEdit = (cat) => {
    setForm({ name: cat.name, description: cat.description || '', isFeatured: cat.isFeatured, isActive: cat.isActive, displayOrder: cat.displayOrder });
    setEditingId(cat._id);
    setImage(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (image) formData.append('image', image);

      if (editingId) {
        await categoryService.update(editingId, formData);
        toast.success('Category updated');
      } else {
        await categoryService.create(formData);
        toast.success('Category created');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await categoryService.remove(id);
      toast.success('Category deleted');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Categories</h1>
        <button onClick={openNew} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card mb-8 space-y-4 max-w-lg">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">{editingId ? 'Edit Category' : 'New Category'}</h2>
            <button type="button" onClick={() => setShowForm(false)}><X size={18} /></button>
          </div>
          <input required placeholder="Category Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage resize-none" />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="text-sm" />
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
          </div>
          <button type="submit" className="btn-primary text-sm">Save Category</button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="py-8 text-center text-ink/40">Loading…</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat._id} className="border-b border-ink/5">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-blush/40 shrink-0">
                      {cat.image?.url && <img src={cat.image.url} alt={cat.name} className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-medium">{cat.name}</span>
                  </td>
                  <td className="py-3 px-4">{cat.isFeatured ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${cat.isActive ? 'bg-sage-50 text-sage-dark' : 'bg-blush text-ink/50'}`}>
                      {cat.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <button onClick={() => openEdit(cat)} className="text-ink/50 hover:text-sage-dark"><Edit2 size={15} /></button>
                      <button onClick={() => handleDelete(cat._id)} className="text-ink/50 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
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

export default AdminCategories;
