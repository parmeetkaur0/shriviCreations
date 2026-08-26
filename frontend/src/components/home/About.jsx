import { motion } from 'framer-motion';
import SectionHeading from '../common/SectionHeading';
import flowerVideo from '../../assets/flower.mp4';
import logo from '../../assets/logo.png';

const About = () => (
  <section className="py-20 sm:py-28 bg-sage-50">
    <div className="container-custom grid md:grid-cols-2 gap-14 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="order-2 md:order-1"
      >
        <div className="relative overflow-hidden rounded-[28px] shadow-card bg-cream border border-ink/10">
          <video
            src={flowerVideo}
            autoPlay
            loop
            muted
            playsInline
            className="h-[340px] sm:h-[420px] w-full object-center object-cover"
          />
          <div className="absolute bottom-1 right-1 rounded-full bg-white/85 backdrop-blur-sm px-3 py-2 shadow-sm">
            <img src={logo} alt="Shrivi Creations" className="h-8 w-auto object-contain" />
          </div>
        </div>
      </motion.div>

      <div className="order-1 md:order-2">
        <SectionHeading
          eyebrow="Our Story"
          title="A Small Studio, Stitched with Intention"
        />
        <p className="mt-6 text-ink/70 leading-relaxed">
          Shrivi Creations began at a kitchen table with a single hook and a skein of cotton yarn. What
          started as a way to slow down has grown into a small studio devoted to handmade pieces that
          feel personal — each one shaped by hand, never mass-produced.
        </p>
        <p className="mt-4 text-ink/70 leading-relaxed">
          We work in small batches, choose natural fibers, and take the time real craft asks for. No two
          pieces are ever quite identical, and that's exactly the point.
        </p>
      </div>
    </div>
  </section>
);

export default About;
