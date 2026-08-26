import dotenv from 'dotenv';
import slugify from 'slugify';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();
await connectDB();

const categoriesData = [
  { name: 'Crochet Flowers', description: 'Handcrafted crochet flowers for every occasion', isFeatured: true },
  { name: 'Bouquets', description: 'Everlasting crochet bouquets that never wilt', isFeatured: true },
  { name: 'Bags', description: 'Stylish handmade crochet bags and totes', isFeatured: true },
  { name: 'Hair Accessories', description: 'Delicate crochet hair clips, bows and scrunchies' },
  { name: 'Bracelets', description: 'Boho crochet bracelets and wristwear' },
  { name: 'Home Decor', description: 'Crochet coasters, wall hangings, and decor pieces' },
  { name: 'Gift Boxes', description: 'Curated crochet gift boxes for loved ones', isFeatured: true },
  { name: 'Custom Orders', description: 'Personalized crochet creations made just for you' },
];

const run = async () => {
  try {
    console.log('Seeding database...');

    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({
        name: process.env.ADMIN_NAME || 'Shrivi Admin',
        email: process.env.ADMIN_EMAIL || 'admin@shrivicreations.com',
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
        role: 'admin',
      });
      console.log('✔ Admin user created:', process.env.ADMIN_EMAIL);
    } else {
      console.log('ℹ Admin user already exists, skipping');
    }

    for (const categoryData of categoriesData) {
      await Category.findOneAndUpdate(
        { name: categoryData.name },
        { $set: { ...categoryData, slug: slugify(categoryData.name, { lower: true, strict: true }) } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    const categories = await Category.find();
    console.log(`✔ ${categories.length} categories ready`);

    const categoryByName = new Map(categories.map((category) => [category.name, category._id]));
    const productDefinitions = [
      ['Crochet Flowers', 'Sunlit Daisy Stem', 'A cheerful hand-crocheted daisy stem to brighten a shelf or gift box.', 399],
      ['Crochet Flowers', 'Lavender Bloom Pair', 'A pair of soft lavender crochet blooms made to last season after season.', 449],
      ['Bouquets', 'Ivory Rose Crochet Bouquet', 'A timeless bouquet of hand-crocheted ivory roses, perfect for gifting.', 1499],
      ['Bouquets', 'Wildflower Weekend Bouquet', 'A colorful everlasting bouquet inspired by a walk through a summer garden.', 1699],
      ['Bags', 'Sage Green Tote Bag', 'A spacious, sturdy crochet tote lined with cotton fabric for daily use.', 1899],
      ['Bags', 'Marigold Market Bag', 'A bright, roomy market bag with a comfortable handmade crochet handle.', 1299],
      ['Hair Accessories', 'Blush Daisy Hair Clip Set', 'A set of three delicate crochet daisy hair clips in blush tones.', 499],
      ['Hair Accessories', 'Pearl Bow Scrunchie', 'A soft crochet scrunchie finished with a charming pearl-tone bow.', 349],
      ['Bracelets', 'Seashell Friendship Bracelet', 'A lightweight crochet bracelet with a tiny seashell-inspired detail.', 299],
      ['Bracelets', 'Rainbow Thread Cuff', 'A colorful handwoven crochet cuff that adds a joyful everyday accent.', 329],
      ['Home Decor', 'Petal Coaster Set', 'A set of four floral crochet coasters to bring texture to your table.', 599],
      ['Home Decor', 'Willow Wall Hanging', 'A delicate crochet wall hanging with a calm botanical silhouette.', 899],
      ['Gift Boxes', 'Little Joy Gift Box', 'A curated box of small crochet keepsakes ready for gifting.', 999],
      ['Gift Boxes', 'Celebration Gift Box', 'A thoughtful handmade collection for birthdays, milestones, and thank-yous.', 1499],
      ['Custom Orders', 'Personalized Floral Keepsake', 'A made-to-order crochet floral keepsake designed around your story.', 799],
      ['Custom Orders', 'Custom Color Gift Set', 'A coordinated crochet gift set made in your preferred colors and style.', 1199],
    ].map(([categoryName, name, description, price]) => ({
      name,
      description,
      shortDescription: description,
      category: categoryByName.get(categoryName),
      price,
      stock: 20,
      materials: ['Cotton yarn', 'Handmade with care'],
      tags: [categoryName.toLowerCase(), 'handmade', 'gift'],
      images: [],
    }));

    const sampleProducts = productDefinitions.map((productData) => ({
      ...productData,
      isFeatured: ['Bouquets', 'Bags', 'Gift Boxes'].some((categoryName) => productData.tags.includes(categoryName.toLowerCase())),
      isBestSeller: productData.name.includes('Rose') || productData.name.includes('Daisy'),
    }));

    for (const productData of sampleProducts) {
      const existingProduct = await Product.findOne({ name: productData.name });
      if (existingProduct) {
        existingProduct.category = productData.category;
        existingProduct.slug = slugify(productData.name, { lower: true, strict: true });
        await existingProduct.save();
      }

      await Product.findOneAndUpdate(
        { name: productData.name },
        {
          $setOnInsert: { ...productData, slug: slugify(productData.name, { lower: true, strict: true }) },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`✔ ${sampleProducts.length} sample products ready`);

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

run();
