import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/format';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const load = (page = 1, kw = keyword) => {
    setLoading(true);
    productService
      .getAdminAll({ page, limit: 15, keyword: kw })
      .then((res) => {
        setProducts(res.products);
        setPagination({ page: res.page, pages: res.pages });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(1, keyword);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await productService.remove(id);
      toast.success('Product deleted');
      load(pagination.page);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Products</h1>
        <Link to="/admin/products/new" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-sm">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search products…"
            className="w-full border border-ink/15 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-sage bg-white"
          />
        </div>
      </form>

      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="py-8 text-center text-ink/40">Loading…</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-ink/40">No products found.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b border-ink/5">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-10 h-12 rounded-lg overflow-hidden bg-blush/40 shrink-0">
                      {p.images?.[0] && <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-medium">{p.name}</span>
                  </td>
                  <td className="py-3 px-4 text-ink/60">{p.category?.name}</td>
                  <td className="py-3 px-4">{formatPrice(p.discountPrice > 0 ? p.discountPrice : p.price)}</td>
                  <td className="py-3 px-4">
                    <span className={p.stock <= p.lowStockThreshold ? 'text-red-500 font-medium' : ''}>{p.stock}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-sage-50 text-sage-dark' : 'bg-blush text-ink/50'}`}>
                      {p.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-3">
                      <Link to={`/admin/products/${p._id}/edit`} className="text-ink/50 hover:text-sage-dark"><Edit2 size={15} /></Link>
                      <button onClick={() => handleDelete(p._id)} className="text-ink/50 hover:text-red-500"><Trash2 size={15} /></button>
                    </div>
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
            <button
              key={i}
              onClick={() => load(i + 1)}
              className={`w-9 h-9 rounded-full text-sm ${pagination.page === i + 1 ? 'bg-ink text-cream' : 'bg-white text-ink'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
