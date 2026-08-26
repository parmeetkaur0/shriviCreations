import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const images = [
  'https://images.unsplash.com/photo-1591129841117-3adfd313e34f?w=400&q=80',
  'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&q=80',
  'https://images.unsplash.com/photo-1519638399535-1b036603ac77?w=400&q=80',
  'https://images.unsplash.com/photo-1611310912385-c56a9068a2b8?w=400&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80',
  'https://images.unsplash.com/photo-1522204523234-8729aa6e3d5f?w=400&q=80',
];

const InstagramGallery = () => (
  <section className="py-20 sm:py-24">
    <div className="container-custom">
      <SectionHeading eyebrow="@shrivicreations" title="Follow Along" align="center" />

      <div className="mt-12 grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
        {images.map((src, i) => (
          <motion.a
            href="#"
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="group relative aspect-square rounded-xl overflow-hidden bg-blush/40"
          >
            <img src={src} alt="Instagram post" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/30 transition-colors flex items-center justify-center">
              <Instagram size={20} className="text-cream opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default InstagramGallery;
