import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';
import ProductCard from '../product/ProductCard';
import { ProductGridSkeleton } from '../common/Skeletons';

const ProductSection = ({ eyebrow, title, subtitle, fetcher, viewAllLink }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(1);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetcher()
      .then((res) => {
        if (mounted) setProducts(Array.isArray(res?.products) ? res.products : []);
      })
      .catch((fetchError) => {
        if (mounted) setError(fetchError.message);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [fetcher]);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) setVisibleCount(4);
      else if (window.innerWidth >= 640) setVisibleCount(2);
      else setVisibleCount(1);
    };

    updateVisibleCount();
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, []);

  useEffect(() => {
    setStartIndex(0);
  }, [products.length]);

  const visibleProducts = useMemo(() => {
    if (products.length <= visibleCount) return products;
    return products.slice(startIndex, startIndex + visibleCount);
  }, [products, startIndex, visibleCount]);

  const hasMore = products.length > visibleCount;
  const canShowPrev = startIndex > 0;
  const canShowNext = startIndex + visibleCount < products.length;

  const moveProducts = (direction) => {
    if (!hasMore) return;

    const nextIndex = direction === 'next' ? startIndex + visibleCount : startIndex - visibleCount;
    const maxStart = Math.max(0, products.length - visibleCount);
    setStartIndex(Math.max(0, Math.min(nextIndex, maxStart)));
  };

  if (!loading && (error || products.length === 0)) return null;

  return (
    <section className="py-20 sm:py-24">
      <div className="container-custom">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {viewAllLink && (
            <Link to={viewAllLink} className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-sage-dark transition-colors">
              View All <ArrowRight size={15} />
            </Link>
          )}
        </div>

        <div className="mt-12">
          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {visibleProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center items-center gap-2">
                  <button
                    onClick={() => moveProducts('prev')}
                    disabled={!canShowPrev}
                    className="rounded-full border border-ink/15 bg-white p-2 text-ink/70 transition hover:-translate-y-0.5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous products"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    onClick={() => moveProducts('next')}
                    disabled={!canShowNext}
                    className="rounded-full border border-ink/15 bg-white p-2 text-ink/70 transition hover:-translate-y-0.5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next products"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
