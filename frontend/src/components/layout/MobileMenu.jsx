import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { X, Heart, User, Package } from 'lucide-react';
import { closeMobileMenu } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'Custom Order', to: '/custom-order' },
  { label: 'About Us', to: '/about' },
];

const MobileMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const close = () => dispatch(closeMobileMenu());

  const go = (path) => {
    close();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 bottom-0 w-[82%] max-w-sm bg-cream p-7 flex flex-col"
      >
        <div className="flex items-center justify-between mb-10">
          <span className="font-display text-xl text-ink">Shrivi Creations</span>
          <button onClick={close} aria-label="Close menu">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex flex-col gap-6">
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => go(link.to)}
              className="text-left font-display text-2xl text-ink hover:text-sage-dark transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-ink/10 flex flex-col gap-4">
          <button onClick={() => go(isAuthenticated ? '/wishlist' : '/login')} className="flex items-center gap-3 text-ink/80">
            <Heart size={18} strokeWidth={1.5} /> Wishlist
          </button>
          <button onClick={() => go(isAuthenticated ? '/profile' : '/login')} className="flex items-center gap-3 text-ink/80">
            <User size={18} strokeWidth={1.5} /> Account
          </button>
          <button onClick={() => go('/orders')} className="flex items-center gap-3 text-ink/80">
            <Package size={18} strokeWidth={1.5} /> Order Tracking
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default MobileMenu;
