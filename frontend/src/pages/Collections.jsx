import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { categoryService } from '../services/categoryService';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=700&q=80';

const Collections = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => setCategories(res.categories || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-custom py-14">
      <section className="relative overflow-hidden rounded-[2rem] bg-sage-50 px-6 sm:px-10 py-10 sm:py-14">
        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
        <div className="absolute bottom-0 -left-10 h-48 w-48 rounded-full bg-sage/20 blur-3xl" />

        <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-10 items-center">
          <div>
            <p className="section-eyebrow mb-4">Explore</p>
            <h1 className="section-title max-w-2xl">Our Collections</h1>
            <p className="mt-4 max-w-xl text-ink/65 text-sm sm:text-base leading-relaxed">
              Every collection is a small world of its own — browse by mood, occasion, and handmade detail.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-primary">
                Shop All
              </Link>
              <Link to="/about" className="btn-secondary">
                Our Story
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-panel rounded-2xl p-5">
              <p className="section-eyebrow mb-3">Signature Feel</p>
              <p className="font-display text-3xl text-ink">Handcrafted</p>
              <p className="mt-2 text-sm text-ink/60">Each piece is crocheted in small batches with care.</p>
            </div>

            <div className="glass-panel rounded-2xl p-5">
              <p className="section-eyebrow mb-3">Bestseller</p>
              <p className="font-display text-3xl text-ink">Gift-ready</p>
              <p className="mt-2 text-sm text-ink/60">Beautiful finishes for birthdays, occasions, and keepsakes.</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-12">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton aspect-[16/10] rounded-[1.75rem]" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-ink/20 py-16 text-center">
            <p className="font-display text-2xl text-ink/60">No collections found</p>
            <p className="text-ink/40 text-sm mt-2">Please check back soon for new arrivals.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.05 }}
                className={i === 0 ? 'md:col-span-2' : ''}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group relative block overflow-hidden rounded-[1.75rem] shadow-card"
                >
                  <img
                    src={cat.image?.url || FALLBACK_IMG}
                    alt={cat.name}
                    className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${i === 0 ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent" />

                  <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-cream/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-ink">
                    <Sparkles size={12} />
                    {i === 0 ? 'Featured' : 'Collection'}
                  </div>

                  <div className="absolute left-5 right-5 bottom-5 flex items-end justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl sm:text-3xl text-cream">{cat.name}</h3>
                      {cat.description && (
                        <p className="mt-2 max-w-lg text-cream/80 text-sm sm:text-base line-clamp-2">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/35 bg-cream/15 text-cream backdrop-blur-sm transition-transform duration-300 group-hover:translate-x-1">
                      <ArrowRight size={18} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Collections;
