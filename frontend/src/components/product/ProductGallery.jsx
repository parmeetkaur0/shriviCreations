import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductGallery = ({ images = [] }) => {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-3xl bg-blush/40 flex items-center justify-center">
        <span className="font-display text-ink/30">Shrivi Creations</span>
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-square rounded-3xl overflow-hidden bg-blush/40 relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={images[active].url}
            alt={images[active].alt || 'Product image'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                active === i ? 'border-gold' : 'border-transparent'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
