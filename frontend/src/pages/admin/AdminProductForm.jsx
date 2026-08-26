import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';

const emptyForm = {
  name: '', description: '', shortDescription: '', category: '', price: '', discountPrice: '',
  stock: '', sku: '', materials: '', care: '', dimensions: '', weight: '', tags: '',
  isCustomizable: false, isFeatured: false, isBestSeller: false, isNewArrival: false, isActive: true,
};

const AdminProductForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [productId, setProductId] = useState(id);

  useEffect(() => {
    categoryService.getAll(true).then((res) => setCategories(res.categories));

    if (isEdit) {
      productService.getAdminAll({ limit: 1000 }).then((res) => {
        const p = res.products.find((prod) => prod._id === id);
        if (p) {
          setForm({
            name: p.name, description: p.description, shortDescription: p.shortDescription || '',
            category: p.category?._id || '', price: p.price, discountPrice: p.discountPrice || '',
            stock: p.stock, sku: p.sku || '', materials: p.materials?.join(', ') || '',
            care: p.care || '', dimensions: p.dimensions || '', weight: p.weight || '',
            tags: p.tags?.join(', ') || '', isCustomizable: p.isCustomizable, isFeatured: p.isFeatured,
            isBestSeller: p.isBestSeller, isNewArrival: p.isNewArrival, isActive: p.isActive,
          });
          setVariants(p.variants || []);
          setExistingImages(p.images || []);
        }
      });
    }
  }, [id, isEdit]);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const addVariant = () => setVariants([...variants, { name: 'Color', value: '', priceModifier: 0, stock: 0 }]);
  const updateVariant = (i, field, value) => {
    const next = [...variants];
    next[i] = { ...next[i], [field]: value };
    setVariants(next);
  };
  const removeVariant = (i) => setVariants(variants.filter((_, idx) => idx !== i));

  const handleRemoveExistingImage = async (imageId) => {
    if (!productId) return;
    try {
      await productService.removeImage(productId, imageId);
      setExistingImages(existingImages.filter((img) => img._id !== imageId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('variants', JSON.stringify(variants));
      newImages.forEach((file) => formData.append('images', file));

      let res;
      if (isEdit) {
        res = await productService.update(id, formData);
      } else {
        res = await productService.create(formData);
        setProductId(res.product._id);
      }
      toast.success(isEdit ? 'Product updated' : 'Product created');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-medium">Basic Information</h2>
          <input required placeholder="Product Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <textarea required placeholder="Full Description" value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={4} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage resize-none" />
          <input placeholder="Short Description (max 200 chars)" value={form.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} maxLength={200} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <select required value={form.category} onChange={(e) => handleChange('category', e.target.value)} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage bg-white">
            <option value="">Select Category</option>
            {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card grid sm:grid-cols-2 gap-4">
          <h2 className="font-medium sm:col-span-2">Pricing & Stock</h2>
          <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => handleChange('price', e.target.value)} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input type="number" placeholder="Discount Price (₹, optional)" value={form.discountPrice} onChange={(e) => handleChange('discountPrice', e.target.value)} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input required type="number" placeholder="Stock Quantity" value={form.stock} onChange={(e) => handleChange('stock', e.target.value)} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input placeholder="SKU" value={form.sku} onChange={(e) => handleChange('sku', e.target.value)} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
          <h2 className="font-medium">Details</h2>
          <input placeholder="Materials (comma-separated)" value={form.materials} onChange={(e) => handleChange('materials', e.target.value)} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input placeholder="Dimensions" value={form.dimensions} onChange={(e) => handleChange('dimensions', e.target.value)} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input placeholder="Care Instructions" value={form.care} onChange={(e) => handleChange('care', e.target.value)} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
          <input placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => handleChange('tags', e.target.value)} className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Variants (e.g. Color, Size)</h2>
            <button type="button" onClick={addVariant} className="text-sm text-sage-dark flex items-center gap-1"><Plus size={14} /> Add Variant</button>
          </div>
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-5 gap-2 mb-2 items-center">
              <input placeholder="Type" value={v.name} onChange={(e) => updateVariant(i, 'name', e.target.value)} className="border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage" />
              <input placeholder="Value" value={v.value} onChange={(e) => updateVariant(i, 'value', e.target.value)} className="border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage" />
              <input type="number" placeholder="+/- Price" value={v.priceModifier} onChange={(e) => updateVariant(i, 'priceModifier', e.target.value)} className="border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage" />
              <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => updateVariant(i, 'stock', e.target.value)} className="border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage" />
              <button type="button" onClick={() => removeVariant(i)} className="text-ink/40 hover:text-red-500"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h2 className="font-medium mb-4">Images</h2>
          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-4">
              {existingImages.map((img) => (
                <div key={img._id} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => handleRemoveExistingImage(img._id)} className="absolute top-1 right-1 bg-ink/70 text-cream rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setNewImages(Array.from(e.target.files))}
            className="text-sm"
          />
          <p className="text-xs text-ink/40 mt-2">Upload up to 6 images. New uploads will be added to existing ones.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-card grid sm:grid-cols-2 gap-3">
          {[
            ['isFeatured', 'Featured Product'],
            ['isBestSeller', 'Best Seller'],
            ['isNewArrival', 'New Arrival'],
            ['isCustomizable', 'Customizable'],
            ['isActive', 'Active (visible on store)'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form[key]} onChange={(e) => handleChange(key, e.target.checked)} />
              {label}
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
