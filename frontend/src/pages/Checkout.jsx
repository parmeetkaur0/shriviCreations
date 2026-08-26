import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchCart, clearCartItems } from '../store/slices/cartSlice';
import { authService } from '../services/authService';
import { couponService } from '../services/couponService';
import { paymentService } from '../services/paymentService';
import { orderService } from '../services/orderService';
import { formatPrice, getProductFinalPrice } from '../utils/format';

const emptyAddress = { fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India' };

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const items = cart.items || [];

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [newAddress, setNewAddress] = useState(emptyAddress);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
    authService.getMe().then((res) => {
      const addrs = res.user.addresses || [];
      setAddresses(addrs);
      const def = addrs.find((a) => a.isDefault) || addrs[0];
      if (def) setSelectedAddressId(def._id);
      else setShowNewAddressForm(true);
    });
  }, [dispatch]);

  const subtotal = items.reduce((sum, item) => sum + getProductFinalPrice(item.product) * item.quantity, 0);
  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 79;
  const total = Math.max(subtotal + shipping - couponDiscount, 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await couponService.validate(couponCode, subtotal);
      setCouponDiscount(res.discount);
      setAppliedCoupon(res.coupon.code);
      toast.success(`Coupon applied! You saved ${formatPrice(res.discount)}`);
    } catch (err) {
      toast.error(err.message);
      setCouponDiscount(0);
      setAppliedCoupon(null);
    }
  };

  const getShippingAddress = () => {
    if (showNewAddressForm) return newAddress;
    return addresses.find((a) => a._id === selectedAddressId);
  };

  const validateAddress = (addr) => {
    if (!addr) return false;
    return ['fullName', 'phone', 'addressLine1', 'city', 'state', 'postalCode'].every((f) => addr[f]?.trim());
  };

  const finalizeOrder = async (paymentResult) => {
    try {
      const shippingAddress = getShippingAddress();
      const res = await orderService.create({
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon,
        paymentResult,
      });
      dispatch(clearCartItems());
      toast.success('Order placed successfully!');
      navigate(`/orders/${res.order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPlacing(false);
    }
  };

  const handlePlaceOrder = async () => {
    const shippingAddress = getShippingAddress();
    if (!validateAddress(shippingAddress)) {
      toast.error('Please provide a complete shipping address');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setPlacing(true);

    if (paymentMethod === 'cod') {
      await finalizeOrder(null);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      toast.error('Unable to load payment gateway. Please check your connection.');
      setPlacing(false);
      return;
    }

    try {
      const { order, keyId } = await paymentService.createOrder(couponDiscount);

      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Shrivi Creations',
        description: 'Handmade with love',
        order_id: order.id,
        handler: async (response) => {
          try {
            await paymentService.verify(response);
            await finalizeOrder({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              status: 'success',
            });
          } catch (err) {
            toast.error(err.message);
            setPlacing(false);
          }
        },
        modal: { ondismiss: () => setPlacing(false) },
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#9AA68C' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.message);
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom py-24 text-center bg-[#F7ECF0]">
        <h1 className="font-display text-3xl mb-3">Nothing to Checkout</h1>
        <Link to="/shop" className="btn-primary mt-4">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container-custom py-14">
      <h1 className="section-title mb-10">Checkout</h1>

      <div className="grid lg:grid-cols-[1fr_380px] gap-12">
        <div className="space-y-10">
          <section>
            <h2 className="font-display text-xl mb-5">Shipping Address</h2>

            {addresses.length > 0 && !showNewAddressForm && (
              <div className="space-y-3 mb-4">
                {addresses.map((addr) => (
                  <label
                    key={addr._id}
                    className={`block border rounded-2xl p-4 cursor-pointer transition-colors ${
                      selectedAddressId === addr._id ? 'border-sage bg-sage-50' : 'border-ink/15'
                    }`}
                  >
                    <div className="flex gap-3">
                      <input
                        type="radio"
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                        className="mt-1"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{addr.fullName} · {addr.phone}</p>
                        <p className="text-ink/60 mt-0.5">
                          {addr.addressLine1}, {addr.addressLine2 ? `${addr.addressLine2}, ` : ''}
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {!showNewAddressForm ? (
              <button onClick={() => setShowNewAddressForm(true)} className="text-sm text-sage-dark hover:underline">
                + Add a new address
              </button>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4 border border-ink/15 rounded-2xl p-5">
                <input placeholder="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
                <input placeholder="Phone Number" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
                <input placeholder="Address Line 1" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
                <input placeholder="Address Line 2 (optional)" value={newAddress.addressLine2} onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage sm:col-span-2" />
                <input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
                <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
                <input placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
                <input placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} className="border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage" />
                {addresses.length > 0 && (
                  <button onClick={() => setShowNewAddressForm(false)} className="text-sm text-ink/50 hover:underline text-left sm:col-span-2">
                    Cancel, use existing address
                  </button>
                )}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-display text-xl mb-5">Payment Method</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer ${paymentMethod === 'razorpay' ? 'border-sage bg-sage-50' : 'border-ink/15'}`}>
                <input type="radio" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} />
                <span className="text-sm font-medium">Pay Online (Cards, UPI, Netbanking)</span>
              </label>
              <label className={`flex items-center gap-3 border rounded-2xl p-4 cursor-pointer ${paymentMethod === 'cod' ? 'border-sage bg-sage-50' : 'border-ink/15'}`}>
                <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>
            </div>
          </section>
        </div>

        <div className="bg-blush/30 rounded-3xl p-7 h-fit">
          <h2 className="font-display text-xl mb-5">Order Summary</h2>
          <ul className="space-y-3 mb-5 max-h-52 overflow-y-auto">
            {items.map((item) => (
              <li key={item._id} className="flex justify-between text-sm">
                <span className="text-ink/70 truncate pr-2">{item.product?.name} × {item.quantity}</span>
                <span className="shrink-0">{formatPrice(getProductFinalPrice(item.product) * item.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 mb-5">
            <input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 border border-ink/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-sage bg-cream"
            />
            <button onClick={handleApplyCoupon} className="btn-secondary text-sm px-4 py-2">Apply</button>
          </div>

          <div className="space-y-2 text-sm border-t border-ink/15 pt-4">
            <div className="flex justify-between text-ink/70"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-ink/70"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sage-dark"><span>Coupon ({appliedCoupon})</span><span>-{formatPrice(couponDiscount)}</span></div>
            )}
          </div>
          <div className="border-t border-ink/15 mt-3 pt-3 flex justify-between font-medium">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>

          <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary w-full mt-6 disabled:opacity-60">
            {placing ? 'Processing…' : paymentMethod === 'cod' ? 'Place Order' : `Pay ${formatPrice(total)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
