import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import { categoryService } from '../../services/categoryService';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=500&q=80';

const CategoryShowcase = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService
      .getAll()
      .then((res) => setCategories(Array.isArray(res?.categories) ? res.categories.slice(0, 8) : []))
      .catch(() => setCategories([]));
  }, []);

  if (categories.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-cream">
      <div className="container-custom">
        <SectionHeading eyebrow="Browse" title="Shop by Category" align="center" />

        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-7">
          {categories.map((cat, i) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link to={`/shop?category=${cat.slug}`} className="group block text-center">
                <div className="aspect-square rounded-full overflow-hidden bg-blush/40 mb-4 shadow-card">
                  <img
                    src={cat.image?.url || FALLBACK_IMG}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <p className="font-body text-sm text-ink group-hover:text-sage-dark transition-colors">{cat.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
