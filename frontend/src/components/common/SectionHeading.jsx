import { motion } from 'framer-motion';
import StitchDivider from './StitchDivider';

const SectionHeading = ({ eyebrow, title, subtitle, align = 'left' }) => (
  <div className={align === 'center' ? 'text-center max-w-2xl mx-auto' : ''}>
    {eyebrow && (
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="section-eyebrow mb-3"
      >
        {eyebrow}
      </motion.p>
    )}
    <motion.h2
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className="section-title"
    >
      {title}
    </motion.h2>
    <StitchDivider align={align} />
    {subtitle && <p className="mt-5 text-ink/70 leading-relaxed">{subtitle}</p>}
  </div>
);

export default SectionHeading;
