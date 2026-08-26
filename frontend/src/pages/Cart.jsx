import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { fetchCart, updateItemQuantity, removeItemFromCart } from '../store/slices/cartSlice';
import { formatPrice, getProductFinalPrice } from '../utils/format';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useSelector((state) => state.cart);
  const items = cart.items || [];

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const subtotal = items.reduce((sum, item) => sum + getProductFinalPrice(item.product) * item.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;

  if (!loading && items.length === 0) {
    return (
      <div className="container-custom py-24 text-center">
        <h1 className="font-display text-3xl mb-3">Your Bag is Empty</h1>
        <p className="text-ink/60 mb-8">Looks like you haven't added anything handmade yet.</p>
        <Link to="/shop" className="btn-primary">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-14">
      <h1 className="section-title mb-10">Your Bag</h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-12">
        <ul className="divide-y divide-ink/10">
          {items.map((item) => (
            <li key={item._id} className="py-6 flex gap-5">
              <Link to={`/product/${item.product?.slug}`} className="w-24 h-28 rounded-xl overflow-hidden bg-blush/40 shrink-0">
                {item.product?.images?.[0] && (
                  <img src={item.product.images[0].url} alt={item.product.name} className="w-full h-full object-cover" />
                )}
              </Link>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link to={`/product/${item.product?.slug}`} className="font-medium hover:text-sage-dark transition-colors">
                      {item.product?.name}
                    </Link>
                    {item.variant && <p className="text-xs text-ink/50 mt-1">{item.variant}</p>}
                    <p className="text-sm text-ink/70 mt-1">{formatPrice(getProductFinalPrice(item.product))}</p>
                  </div>
                  <button
                    onClick={() => dispatch(removeItemFromCart(item._id))}
                    className="text-ink/40 hover:text-red-500 transition-colors h-fit"
                    aria-label="Remove"
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <div className="flex items-center border border-ink/15 rounded-full w-fit mt-4">
                  <button
                    onClick={() => dispatch(updateItemQuantity({ itemId: item._id, quantity: item.quantity - 1 }))}
                    className="w-8 h-9 flex items-center justify-center"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(updateItemQuantity({ itemId: item._id, quantity: item.quantity + 1 }))}
                    className="w-8 h-9 flex items-center justify-center"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="bg-blush/30 rounded-3xl p-7 h-fit">
          <h2 className="font-display text-xl mb-5">Order Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            {subtotal < 999 && (
              <p className="text-xs text-gold-dark">Add {formatPrice(999 - subtotal)} more for free shipping</p>
            )}
          </div>
          <div className="border-t border-ink/15 mt-4 pt-4 flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(subtotal + shipping)}</span>
          </div>
          <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
