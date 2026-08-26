import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatPrice, getProductFinalPrice } from '../../utils/format';
import { addItemToCart, openCartDrawer } from '../../store/slices/cartSlice';
import { toggleWishlistItem } from '../../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistProducts = useSelector((state) => state.wishlist.wishlist.products);
  const isWishlisted = wishlistProducts?.some((p) => p._id === product._id);

  const finalPrice = getProductFinalPrice(product);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    dispatch(addItemToCart({ productId: product._id, quantity: 1 }));
    dispatch(openCartDrawer());
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to save items');
      navigate('/login');
      return;
    }
    dispatch(toggleWishlistItem({ productId: product._id, isWishlisted }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-blush/40 aspect-[4/5]">
          {product.images?.[0] ? (
            <img
              src={product.images[0].url}
              alt={product.images[0].alt || product.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/30 font-display text-sm">
              Shrivi Creations
            </div>
          )}

          {/* badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <span className="bg-gold text-cream text-[11px] font-medium px-2.5 py-1 rounded-full">
                -{discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="bg-ink/80 text-cream text-[11px] font-medium px-2.5 py-1 rounded-full">New</span>
            )}
          </div>

          {/* wishlist */}
          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="absolute top-3 right-3 w-9 h-9 rounded-full glass-panel flex items-center justify-center transition-transform hover:scale-110"
          >
            <Heart
              size={16}
              className={isWishlisted ? 'fill-gold text-gold' : 'text-ink'}
              strokeWidth={1.75}
            />
          </button>

          {/* quick add - slides up on hover (desktop), always visible on mobile via opacity */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className="w-full bg-cream/95 backdrop-blur text-ink text-sm font-medium py-2.5 rounded-full flex items-center justify-center gap-2 hover:bg-ink hover:text-cream transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={15} strokeWidth={1.75} />
              {product.inStock === false || product.stock === 0 ? 'Out of Stock' : 'Quick Add'}
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-2">
          <div>
            <h3 className="font-body text-[15px] text-ink leading-snug">{product.name}</h3>
            {product.ratingsCount > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="fill-gold text-gold" />
                <span className="text-xs text-ink/60">
                  {product.ratingsAverage?.toFixed(1)} ({product.ratingsCount})
                </span>
              </div>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="font-medium text-ink">{formatPrice(finalPrice)}</p>
            {hasDiscount && <p className="text-xs text-ink/40 line-through">{formatPrice(product.price)}</p>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
