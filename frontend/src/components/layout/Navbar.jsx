import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import logo from '../../assets/logo.png';
import { openCartDrawer } from '../../store/slices/cartSlice';
import { toggleMobileMenu, closeMobileMenu, toggleSearch } from '../../store/slices/uiSlice';
import { useAuth } from '../../hooks/useAuth';
import SearchOverlay from './SearchOverlay';
import MobileMenu from './MobileMenu';

const navLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections' },
  { label: 'About', to: '/about' },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const isMobileMenuOpen = useSelector((state) => state.ui.isMobileMenuOpen);
  const cartCount = useSelector((state) => state.cart.cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0);
  const wishlistCount = useSelector((state) => state.wishlist.wishlist.products?.length || 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled ? 'bg-[#F7ECF0]/85 backdrop-blur-md shadow-card py-3' : 'bg-[#F5E8EB] py-5'
        }`}
      >
        <nav className="container-custom flex items-center justify-between">
          <button
            className="md:hidden text-ink"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label="Open menu"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>

          <NavLink
            to="/"
            className={"flex items-center group relative rounded-full px-2 py-1 transition-all duration-300"}
                

            aria-label="Go to homepage"
          >
            <img
              src={logo}
              alt="Shrivi Creations"
              className="h-16 w-20 sm:h-14 object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="absolute -bottom-1 left-2 right-2 h-[2px] rounded-full bg-gold opacity-0 transition-all duration-300 group-hover:opacity-100" />
          </NavLink>

          <div className="hidden md:flex items-center gap-9">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `group relative py-1 text-md tracking-wide transition-all duration-300 ${
                    isActive ? 'text-ink' : 'text-ink/70 hover:-translate-y-0.5 hover:text-ink'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <motion.span whileHover={{ y: -1 }} className="inline-block">
                      {link.label}
                    </motion.span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-gold"
                      />
                    )}
                    {!isActive && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => dispatch(toggleSearch())}
              aria-label="Search"
              className="p-2 hover:bg-ink/5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? '/wishlist' : '/login')}
              aria-label="Wishlist"
              className="p-2 hover:bg-ink/5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm relative hidden sm:inline-flex"
            >
              <Heart size={19} strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate(isAuthenticated ? '/profile' : '/login')}
              aria-label="Account"
              className="p-2 hover:bg-ink/5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hidden sm:inline-flex"
            >
              <User size={19} strokeWidth={1.5} />
            </button>
            <button
              onClick={() => dispatch(openCartDrawer())}
              aria-label="Cart"
              className="p-2 hover:bg-ink/5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm relative"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-cream text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>{isMobileMenuOpen && <MobileMenu />}</AnimatePresence>
      <SearchOverlay />
    </>
  );
};

export default Navbar;
