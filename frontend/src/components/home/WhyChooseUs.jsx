import { motion } from 'framer-motion';
import { Sparkles, Leaf, PackageCheck, HeartHandshake } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const features = [
  { icon: Sparkles, title: '100% Handmade', desc: 'No machines, no shortcuts — every piece is crocheted by hand.' },
  { icon: Leaf, title: 'Natural Materials', desc: 'Soft cotton and natural fiber yarns chosen for quality and longevity.' },
  { icon: PackageCheck, title: 'Made to Order', desc: 'Small batches mean fresher pieces and room for customization.' },
  { icon: HeartHandshake, title: 'Made with Care', desc: 'Each order is packed thoughtfully, ready to be gifted or kept.' },
];

const WhyChooseUs = () => (
  <section className="py-20 sm:py-28 bg-sage-50 text-ink">
    <div className="container-custom">
      <SectionHeading eyebrow="Why Shrivi Creations" title="Handmade, Done Properly" align="center" />

      <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group text-center rounded-[24px] bg-white/60 p-5 shadow-sm transition-all duration-300 hover:shadow-card"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 280, damping: 18 }}
              className="w-14 h-14 mx-auto rounded-full bg-cream/10 flex items-center justify-center mb-5"
            >
              <f.icon size={22} strokeWidth={1.5} className="text-gold" />
            </motion.div>
            <motion.h3
              whileHover={{ color: '#8b5e3c' }}
              transition={{ duration: 0.2 }}
              className="font-display text-lg mb-2"
            >
              {f.title}
            </motion.h3>
            <p className="text-sm text-ink/60 leading-relaxed transition-colors duration-300 group-hover:text-ink/80">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
