import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/product/ProductCard';
import { ProductGridSkeleton } from '../components/common/Skeletons';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  const products = wishlist.products || [];

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  return (
    <div className="container-custom py-14 bg-[#F7ECF0]">
      <h1 className="section-title mb-10">Your Wishlist</h1>

      {loading ? (
        <ProductGridSkeleton count={4} />
      ) : products.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-ink/60 mb-3">Your wishlist is empty</p>
          <p className="text-ink/40 text-sm mb-8">Save pieces you love for later.</p>
          <Link to="/shop" className="btn-primary">Explore the Shop</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
