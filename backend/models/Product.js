import mongoose from 'mongoose';
import slugify from 'slugify';

const variantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. "Color", "Size"
  value: { type: String, required: true }, // e.g. "Ivory", "Small"
  priceModifier: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  sku: { type: String },
});

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  alt: { type: String, default: '' },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, trim: true, maxlength: 200 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    images: [imageSchema],
    variants: [variantSchema],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, unique: true, sparse: true },
    materials: [{ type: String }],
    care: { type: String },
    dimensions: { type: String },
    weight: { type: String },
    isCustomizable: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    ratingsAverage: { type: Number, default: 0, min: 0, max: 5 },
    ratingsCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    seo: {
      metaTitle: String,
      metaDescription: String,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 7);
  }
  next();
});

productSchema.virtual('finalPrice').get(function () {
  return this.discountPrice > 0 ? this.discountPrice : this.price;
});

productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
