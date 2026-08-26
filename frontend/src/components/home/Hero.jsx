import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import flower from '../../assets/hero.png';

const Hero = () => {
  return (
    <section className="relative   flex items-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${flower})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="lg:hidden absolute inset-0 z-0 bg-[linear-gradient(90deg,rgba(247,236,240,0.95)_0%,rgba(247,236,240,0.75)_45%,rgba(247,236,240,0.25)_100%)] sm:bg-transparent" />

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-[#9D5B6B]/10 rounded-tr-[120px] pointer-events-none z-10" />
      <div className="absolute top-[15%] right-[5%] w-3 h-3 bg-[#F7ECF0]/30 rounded-full animate-pulse z-10" />
      <div className="absolute bottom-[20%] left-[8%] w-4 h-4 bg-[#F7ECF0]/20 rounded-full animate-pulse delay-150 z-10" />
      <div className="absolute top-[30%] left-[4%] w-2 h-2 bg-[#F7ECF0]/40 rounded-full animate-pulse delay-300 z-10" />

      <div className="container-custom relative  py-8 sm:py-10 z-10 w-full">
        <div className="flex items-center min-h-[70vh]">

          <div className="w-full max-w-2xl rounded-[2rem]  sm:p-6 md:bg-transparent md:p-0 md:shadow-none">
            <div className="space-y-6 text-left">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="section-eyebrow mb-4 sm:mb-5 mt-10 text-[#9D5B6B] font-medium tracking-[0.15em] uppercase text-xs sm:text-sm"
            >
              ✦ Handmade in Small Batches ✦
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.95] text-[#2D1B1E] text-left"
            >
              Crochet Beauty
              <br />
              <span className="italic text-[#9D5B6B] relative inline-block">
                For Every 
              </span>
              <br />
              <span className="italic text-[#9D5B6B] relative inline-block">
                Moment
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="absolute -bottom-2 left-0 h-1 bg-[#F7ECF0]/30 rounded-full"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-5 sm:mt-6 text-[#2D1B1E]/75 max-w-md leading-relaxed text-sm sm:text-base lg:text-lg text-left"
            >
              Discover graceful crochet flowers, soft-toned gifts, and handcrafted keepsakes made to feel personal from the very first stitch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-7 sm:mt-9 flex flex-row flex-wrap gap-3 sm:gap-6 sm:items-center"
            >
              <Link
                to="/shop"
                className="group relative inline-flex h-12 flex-1 min-w-[0] items-center justify-center px-5 py-3.5 bg-[#9D5B6B] text-white/80 rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:bg-[#8A4E5E] hover:scale-105 hover:shadow-lg hover:shadow-[#9D5B6B]/40 overflow-hidden sm:flex-none sm:w-auto"
              >
                <span className="relative z-10">Shop the Collection</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#9D5B6B] to-[#B47383] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <svg
                  className="relative z-10 w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                to="/collections"
                className="group inline-flex lg:h-auto h-12 flex-1 min-w-[0] items-center justify-center px-5 py-3.5 border-2 border-[#9D5B6B] text-[#9D5B6B] rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:bg-white hover:text-[#2D1B1E] hover:scale-105 hover:shadow-lg hover:shadow-white/20 sm:flex-none sm:w-auto"
              >
                Explore Collections
                <svg
                  className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 sm:mt-10 flex flex-col gap-3  sm:flex-row sm:flex-wrap sm:gap-6 sm:items-center"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#2D1B1E]/60">
                <svg className="w-4 h-4 text-[#9D5B6B]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Handcrafted with love</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#2D1B1E]/60">
                <svg className="w-4 h-4 text-[#9D5B6B]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>100% satisfaction guaranteed</span>
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;