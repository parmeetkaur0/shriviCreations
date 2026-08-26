import { useEffect, useState } from 'react';
import { categoryService } from '../../services/categoryService';

const ShopFilters = ({ filters, onChange }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService.getAll().then((res) => setCategories(res.categories));
  }, []);

  return (
    <aside className="space-y-8">
      <div>
        <h3 className="font-display text-lg mb-4">Category</h3>
        <ul className="space-y-2.5">
          <li>
            <button
              onClick={() => onChange({ category: '' })}
              className={`text-sm transition-colors ${!filters.category ? 'text-ink font-medium' : 'text-ink/60 hover:text-ink'}`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => {
            const categoryValue = cat.slug || cat.name;

            return (
              <li key={cat._id}>
                <button
                  onClick={() => onChange({ category: categoryValue })}
                  className={`text-sm transition-colors ${filters.category === categoryValue ? 'text-ink font-medium' : 'text-ink/60 hover:text-ink'}`}
                >
                  {cat.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h3 className="font-display text-lg mb-4">Price Range</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage"
          />
          <span className="text-ink/40">—</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="w-full border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage"
          />
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg mb-4">Sort By</h3>
        <select
          value={filters.sort || '-createdAt'}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-sage bg-cream"
        >
          <option value="-createdAt">Newest First</option>
          <option value="price">Price: Low to High</option>
          <option value="-price">Price: High to Low</option>
          <option value="-soldCount">Best Selling</option>
          <option value="-ratingsAverage">Top Rated</option>
        </select>
      </div>
    </aside>
  );
};

export default ShopFilters;
