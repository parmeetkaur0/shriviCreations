import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Minus, Plus, Truck, ShieldCheck, RotateCcw, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { addItemToCart, openCartDrawer } from '../store/slices/cartSlice';
import { toggleWishlistItem } from '../store/slices/wishlistSlice';
import { useRecentlyViewed } from '../hooks/useRecentlyViewed';
import { formatPrice, getProductFinalPrice } from '../utils/format';
import ProductGallery from '../components/product/ProductGallery';
import ProductCard from '../components/product/ProductCard';
import ProductReviews from '../components/product/ProductReviews';
import { ProductDetailsSkeleton } from '../components/common/Skeletons';

const ProductDetails = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistProducts = useSelector((state) => state.wishlist.wishlist.products);
  const { recentlyViewed, trackView } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    productService
      .getBySlug(slug)
      .then((res) => {
        setProduct(res.product);
        trackView(res.product);
        setSelectedVariant(res.product.variants?.[0] || null);
        return productService.getRelated(slug);
      })
      .then((res) => setRelated(res.products))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading || !product) {
    return (
      <div className="container-custom py-14">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  const isWishlisted = wishlistProducts?.some((p) => p._id === product._id);
  const finalPrice = getProductFinalPrice(product);
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.price;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    dispatch(addItemToCart({ productId: product._id, quantity, variant: selectedVariant?.value }));
    dispatch(openCartDrawer());
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to save items');
      navigate('/login');
      return;
    }
    dispatch(toggleWishlistItem({ productId: product._id, isWishlisted }));
  };

  return (
    <div className="container-custom py-10 sm:py-14">
      {/* Breadcrumb */}
      <div className="text-xs text-ink/50 mb-8 flex items-center gap-2">
        <Link to="/" className="hover:text-ink">Home</Link> /
        <Link to="/shop" className="hover:text-ink">Shop</Link> /
        <span className="text-ink">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        <ProductGallery images={product.images} />

        <div>
          <p className="section-eyebrow mb-3">{product.category?.name}</p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink leading-tight">{product.name}</h1>

          {product.ratingsCount > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.ratingsAverage) ? 'fill-gold text-gold' : 'text-ink/20'} />
                ))}
              </div>
              <span className="text-sm text-ink/60">
                {product.ratingsAverage.toFixed(1)} ({product.ratingsCount} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-5">
            <span className="font-display text-3xl text-ink">{formatPrice(finalPrice)}</span>
            {hasDiscount && <span className="text-ink/40 line-through text-lg">{formatPrice(product.price)}</span>}
          </div>

          <p className="mt-5 text-ink/70 leading-relaxed">{product.shortDescription || product.description}</p>

          {product.variants?.length > 0 && (
            <div className="mt-7">
              <p className="text-sm font-medium mb-3">{product.variants[0].name}</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v._id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      selectedVariant?._id === v._id ? 'bg-ink text-cream border-ink' : 'border-ink/20 text-ink hover:border-ink'
                    }`}
                  >
                    {v.value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center border border-ink/15 rounded-full">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-11 flex items-center justify-center" aria-label="Decrease quantity">
                <Minus size={15} />
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-11 flex items-center justify-center" aria-label="Increase quantity">
                <Plus size={15} />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <button
              onClick={handleWishlist}
              aria-label="Toggle wishlist"
              className="w-11 h-11 shrink-0 rounded-full border border-ink/15 flex items-center justify-center hover:border-gold transition-colors"
            >
              <Heart size={18} className={isWishlisted ? 'fill-gold text-gold' : 'text-ink'} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-9 border-t border-ink/10 pt-7">
            <div className="text-center">
              <Truck size={20} className="mx-auto mb-2 text-sage-dark" strokeWidth={1.5} />
              <p className="text-xs text-ink/60">Free shipping over ₹999</p>
            </div>
            <div className="text-center">
              <ShieldCheck size={20} className="mx-auto mb-2 text-sage-dark" strokeWidth={1.5} />
              <p className="text-xs text-ink/60">Secure checkout</p>
            </div>
            <div className="text-center">
              <RotateCcw size={20} className="mx-auto mb-2 text-sage-dark" strokeWidth={1.5} />
              <p className="text-xs text-ink/60">Easy returns</p>
            </div>
          </div>

          {(product.materials?.length > 0 || product.care || product.dimensions) && (
            <div className="mt-8 border-t border-ink/10 pt-7 space-y-3 text-sm">
              {product.materials?.length > 0 && (
                <p><span className="font-medium">Materials: </span><span className="text-ink/60">{product.materials.join(', ')}</span></p>
              )}
              {product.dimensions && (
                <p><span className="font-medium">Dimensions: </span><span className="text-ink/60">{product.dimensions}</span></p>
              )}
              {product.care && (
                <p><span className="font-medium">Care: </span><span className="text-ink/60">{product.care}</span></p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Full description */}
      <div className="max-w-3xl mt-16">
        <h2 className="font-display text-2xl mb-4">Product Story</h2>
        <p className="text-ink/70 leading-relaxed whitespace-pre-line">{product.description}</p>
      </div>

      {/* Reviews */}
      <div className="max-w-3xl mt-16">
        <ProductReviews productId={product._id} />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Recently viewed */}
      {recentlyViewed.filter((p) => p._id !== product._id).length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl mb-8">Recently Viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {recentlyViewed
              .filter((p) => p._id !== product._id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
