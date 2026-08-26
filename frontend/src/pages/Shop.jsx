import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import ShopFilters from '../components/product/ShopFilters';
import { ProductGridSkeleton } from '../components/common/Skeletons';
import { productService } from '../services/productService';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const filters = {
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || '-createdAt',
    keyword: searchParams.get('keyword') || '',
    page: searchParams.get('page') || '1',
  };

  const updateFilters = useCallback(
    (partial) => {
      const next = new URLSearchParams(searchParams);
      Object.entries(partial).forEach(([key, value]) => {
        if (value) next.set(key, value);
        else next.delete(key);
      });
      next.set('page', '1');
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const goToPage = (page) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', page);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sort) params.sort = filters.sort;
    if (filters.keyword) params.keyword = filters.keyword;
    params.page = filters.page;
    params.limit = 12;

    productService
      .getAll(params)
      .then((res) => {
        setProducts(Array.isArray(res?.products) ? res.products : []);
        setPagination({ page: res.page, pages: res.pages, total: res.total });
      })
      .catch(() => {
        setProducts([]);
        setPagination({ page: 1, pages: 1, total: 0 });
      })
      .finally(() => setLoading(false));
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="container-custom py-14 bg-[#F7ECF0]">
      <div className="mb-10">
        <p className="section-eyebrow mb-2">
          {filters.keyword ? `Search results for "${filters.keyword}"` : 'The Collection'}
        </p>
         </div>

      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden flex items-center gap-2 mb-6 btn-secondary text-sm px-5 py-2.5"
      >
        <SlidersHorizontal size={15} /> Filters
      </button>

      <div className="grid lg:grid-cols-[240px_1fr] gap-10">
        <div className="hidden lg:block">
          <ShopFilters filters={filters} onChange={updateFilters} />
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-[80%] max-w-xs bg-cream p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-display text-xl">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}><X size={20} /></button>
              </div>
              <ShopFilters filters={filters} onChange={updateFilters} />
            </div>
          </div>
        )}

        <div>
          {loading ? (
            <ProductGridSkeleton count={9} />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-ink/60 mb-2">No pieces found</p>
              <p className="text-ink/40 text-sm">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center gap-2 mt-14">
                  {Array.from({ length: pagination.pages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i + 1)}
                      className={`w-10 h-10 rounded-full text-sm transition-colors ${
                        pagination.page === i + 1 ? 'bg-ink text-cream' : 'bg-blush/40 text-ink hover:bg-blush'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
