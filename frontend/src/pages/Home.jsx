import { useCallback } from 'react';
import Hero from '../components/home/Hero';
import CategoryShowcase from '../components/home/CategoryShowcase';
import ProductSection from '../components/home/ProductSection';
import About from '../components/home/About';
import HandmadeProcess from '../components/home/HandmadeProcess';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Reviews from '../components/home/Reviews';
import InstagramGallery from '../components/home/InstagramGallery';
import Newsletter from '../components/home/Newsletter';
import { productService } from '../services/productService';

const Home = () => {
  const fetchFeatured = useCallback(() => productService.getFeatured(), []);
  const fetchBestSellers = useCallback(() => productService.getBestSellers(), []);

  return (
    <>
      <Hero />
      <CategoryShowcase />
      <ProductSection
        eyebrow="Handpicked"
        title="Featured Pieces"
        subtitle="A curated edit of our favorite pieces this season."
        fetcher={fetchFeatured}
        viewAllLink="/shop"
      />
      <About />
      <ProductSection
        eyebrow="Customer Favorites"
        title="Best Sellers"
        subtitle="The pieces our community keeps coming back for."
        fetcher={fetchBestSellers}
        viewAllLink="/shop?sort=-soldCount"
      />
      <HandmadeProcess />
      <WhyChooseUs />
      <Newsletter />
    </>
  );
};

export default Home;
