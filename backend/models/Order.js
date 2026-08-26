import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  variant: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  addressLine1: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, default: 'India' },
});

const trackingHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  note: { type: String },
  updatedAt: { type: Date, default: Date.now },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    paymentMethod: { type: String, enum: ['razorpay', 'cod'], default: 'razorpay' },
    paymentResult: {
      razorpay_order_id: String,
      razorpay_payment_id: String,
      razorpay_signature: String,
      status: String,
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    couponCode: { type: String },
    totalPrice: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    trackingHistory: [trackingHistorySchema],
    trackingNumber: { type: String },
    courierPartner: { type: String },
    estimatedDelivery: { type: Date },
    deliveredAt: { type: Date },
    cancelReason: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.orderNumber = 'SC' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 90 + 10);
    this.trackingHistory.push({ status: 'pending', note: 'Order placed successfully' });
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
