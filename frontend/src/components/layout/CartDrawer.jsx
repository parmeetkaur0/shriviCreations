import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { closeCartDrawer, updateItemQuantity, removeItemFromCart } from '../../store/slices/cartSlice';
import { formatPrice, getProductFinalPrice } from '../../utils/format';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const { cart, isDrawerOpen } = useSelector((state) => state.cart);
  const items = cart.items || [];

  const subtotal = items.reduce((sum, item) => {
    const price = getProductFinalPrice(item.product);
    return sum + price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeCartDrawer())}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 right-0 bottom-0 w-full sm:w-[420px] bg-cream flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10">
              <h2 className="font-display text-xl">Your Bag ({items.length})</h2>
              <button onClick={() => dispatch(closeCartDrawer())} aria-label="Close cart">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-3">
                  <p className="font-display text-xl text-ink/70">Your bag is empty</p>
                  <p className="text-sm text-ink/50">Time to find something handmade to love.</p>
                  <Link
                    to="/shop"
                    onClick={() => dispatch(closeCartDrawer())}
                    className="btn-primary mt-3"
                  >
                    Browse the Shop
                  </Link>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <li key={item._id} className="flex gap-4">
                      <Link
                        to={`/product/${item.product?.slug}`}
                        onClick={() => dispatch(closeCartDrawer())}
                        className="w-20 h-24 rounded-xl overflow-hidden bg-blush/40 shrink-0"
                      >
                        {item.product?.images?.[0] && (
                          <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-2">
                          <p className="text-sm font-medium text-ink truncate">{item.product?.name}</p>
                          <button
                            onClick={() => dispatch(removeItemFromCart(item._id))}
                            aria-label="Remove item"
                            className="text-ink/40 hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        {item.variant && <p className="text-xs text-ink/50 mt-0.5">{item.variant}</p>}
                        <p className="text-sm text-ink/70 mt-1">{formatPrice(getProductFinalPrice(item.product))}</p>

                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-ink/15 rounded-full">
                            <button
                              onClick={() => dispatch(updateItemQuantity({ itemId: item._id, quantity: item.quantity - 1 }))}
                              className="w-7 h-7 flex items-center justify-center"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-sm">{item.quantity}</span>
                            <button
                              onClick={() => dispatch(updateItemQuantity({ itemId: item._id, quantity: item.quantity + 1 }))}
                              className="w-7 h-7 flex items-center justify-center"
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-ink/10">
                <div className="flex justify-between text-sm text-ink/70 mb-1">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-ink/40 mb-4">Shipping and coupons calculated at checkout</p>
                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeCartDrawer())}
                  className="btn-primary w-full"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
