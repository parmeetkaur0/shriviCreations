import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { closeSearch } from '../../store/slices/uiSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { productService } from '../../services/productService';
import { formatPrice, getProductFinalPrice } from '../../utils/format';

const SearchOverlay = () => {
  const isOpen = useSelector((state) => state.ui.isSearchOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debounced = useDebounce(keyword, 400);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }
    setLoading(true);
    productService
      .getAll({ keyword: debounced, limit: 6 })
      .then((res) => setResults(res.products))
      .finally(() => setLoading(false));
  }, [debounced]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    dispatch(closeSearch());
    navigate(`/shop?keyword=${encodeURIComponent(keyword)}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-cream/95 backdrop-blur-md"
        >
          <div className="container-custom pt-24 sm:pt-32">
            <button
              onClick={() => dispatch(closeSearch())}
              className="absolute top-6 right-6 sm:top-10 sm:right-10"
              aria-label="Close search"
            >
              <X size={26} strokeWidth={1.5} />
            </button>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 border-b-2 border-ink pb-4">
                <Search size={22} strokeWidth={1.5} className="text-ink/50" />
                <input
                  autoFocus
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Search crochet flowers, bags, bouquets…"
                  className="flex-1 bg-transparent font-display text-2xl sm:text-3xl outline-none placeholder:text-ink/30"
                />
              </div>
            </form>

            <div className="max-w-2xl mx-auto mt-8">
              {loading && <p className="text-sm text-ink/50">Searching…</p>}
              {!loading && results.length > 0 && (
                <ul className="divide-y divide-ink/10">
                  {results.map((product) => (
                    <li key={product._id}>
                      <button
                        onClick={() => {
                          dispatch(closeSearch());
                          navigate(`/product/${product.slug}`);
                        }}
                        className="w-full flex items-center gap-4 py-3 text-left hover:bg-ink/5 rounded-lg px-2 transition-colors"
                      >
                        <div className="w-14 h-16 rounded-lg overflow-hidden bg-blush/40 shrink-0">
                          {product.images?.[0] && (
                            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{product.name}</p>
                          <p className="text-xs text-ink/50">{formatPrice(getProductFinalPrice(product))}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
