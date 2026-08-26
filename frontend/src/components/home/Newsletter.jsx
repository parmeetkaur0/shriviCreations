import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success('Welcome to the Shrivi Creations circle!');
    setEmail('');
  };

  return (
    <section className="py-20 sm:py-24 bg-blush/40">
      <div className="container-custom text-center max-w-xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="font-display text-3xl sm:text-4xl text-ink"
        >
          Stay in the Loop
        </motion.h2>
        <p className="mt-4 text-ink/60">
          New arrivals, restocks, and the occasional behind-the-scenes look at the studio — straight to your inbox.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 bg-cream border border-ink/15 rounded-full px-6 py-3.5 text-sm outline-none focus:border-gold transition-colors"
          />
          <button type="submit" className="btn-gold">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
