import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { productService } from '../../services/productService';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState({});

  const load = () => {
    setLoading(true);
    productService.getAdminAll({ limit: 100, sort: 'stock' }).then((res) => setProducts(res.products)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStockChange = (id, value) => setEditingStock({ ...editingStock, [id]: value });

  const handleSaveStock = async (product) => {
    const newStock = editingStock[product._id];
    if (newStock === undefined || newStock === '') return;
    try {
      const formData = new FormData();
      formData.append('stock', newStock);
      await productService.update(product._id, formData);
      toast.success(`Stock updated for ${product.name}`);
      const next = { ...editingStock };
      delete next[product._id];
      setEditingStock(next);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl mb-8">Inventory</h1>

      <div className="bg-white rounded-2xl shadow-card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 border-b border-ink/10">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Current Stock</th>
              <th className="py-3 px-4">Low Stock Threshold</th>
              <th className="py-3 px-4">Sold</th>
              <th className="py-3 px-4">Update Stock</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="py-8 text-center text-ink/40">Loading…</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p._id} className="border-b border-ink/5">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <div className="w-9 h-11 rounded-lg overflow-hidden bg-blush/40 shrink-0">
                      {p.images?.[0] && <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />}
                    </div>
                    {p.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className={p.stock <= p.lowStockThreshold ? 'text-red-500 font-medium' : ''}>{p.stock}</span>
                  </td>
                  <td className="py-3 px-4 text-ink/60">{p.lowStockThreshold}</td>
                  <td className="py-3 px-4 text-ink/60">{p.soldCount}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="New stock"
                        value={editingStock[p._id] ?? ''}
                        onChange={(e) => handleStockChange(p._id, e.target.value)}
                        className="w-24 border border-ink/15 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-sage"
                      />
                      <button onClick={() => handleSaveStock(p)} className="text-xs text-sage-dark hover:underline">Save</button>
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

export default AdminInventory;
