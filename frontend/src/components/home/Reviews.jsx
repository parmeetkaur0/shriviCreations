import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionHeading from '../common/SectionHeading';

const testimonials = [
  {
    name: 'Ananya R.',
    text: 'The bouquet looked even better in person than in photos. You can tell real care went into every petal.',
    rating: 5,
  },
  {
    name: 'Meera K.',
    text: 'Ordered the tote bag for daily use and it has held up beautifully. Compliments every time I carry it.',
    rating: 5,
  },
  {
    name: 'Priya S.',
    text: 'Custom order came out exactly how I imagined. Communication was lovely throughout the process.',
    rating: 5,
  },
];

const Reviews = () => (
  <section className="py-20 sm:py-28 bg-cream">
    <div className="container-custom">
      <SectionHeading eyebrow="Kind Words" title="Loved by Our Customers" align="center" />

      <div className="mt-14 grid md:grid-cols-3 gap-7">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white/60 rounded-3xl p-8 shadow-card"
          >
            <div className="flex gap-1 mb-4">
              {Array.from({ length: t.rating }).map((_, idx) => (
                <Star key={idx} size={14} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="text-ink/75 leading-relaxed text-[15px] mb-5">"{t.text}"</p>
            <p className="font-display text-lg text-ink">{t.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
