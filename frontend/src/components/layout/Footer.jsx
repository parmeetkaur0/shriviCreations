import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Instagram, Facebook, Mail, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("You're on the list! Watch your inbox for handmade updates.");
    setEmail('');
  };

  return (
    <footer className="bg-ink text-cream">
      <div className="container-custom py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl mb-3">Shrivi Creations</h3>
          <p className="text-cream/60 text-sm leading-relaxed max-w-sm mb-6">
            Every piece is hand-crocheted, stitch by stitch, in small batches — made to be kept, gifted, and loved for years.
          </p>
          <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-sm">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-cream/10 border border-cream/20 rounded-full px-5 py-3 text-sm placeholder:text-cream/40 outline-none focus:border-gold transition-colors"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="w-11 h-11 shrink-0 rounded-full bg-gold flex items-center justify-center hover:bg-gold-light transition-colors"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        <div>
          <h4 className="font-body text-sm tracking-[0.15em] uppercase text-cream/50 mb-5">Shop</h4>
          <ul className="space-y-3 text-sm text-cream/80">
            <li><Link to="/shop" className="hover:text-gold transition-colors">All Products</Link></li>
            <li><Link to="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
            <li><Link to="/shop?category=gift-boxes" className="hover:text-gold transition-colors">Gift Boxes</Link></li>
            <li><Link to="/custom-order" className="hover:text-gold transition-colors">Custom Orders</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-body text-sm tracking-[0.15em] uppercase text-cream/50 mb-5">Support</h4>
          <ul className="space-y-3 text-sm text-cream/80">
            <li><Link to="/orders" className="hover:text-gold transition-colors">Track Order</Link></li>
            <li><Link to="/profile" className="hover:text-gold transition-colors">My Account</Link></li>
            <li><a href="mailto:hello@shrivicreations.com" className="hover:text-gold transition-colors flex items-center gap-2"><Mail size={13}/> Contact Us</a></li>
            <li className="flex items-center gap-2 text-cream/60"><MapPin size={13}/> Made in India</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-custom py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream/40">© {new Date().getFullYear()} Shrivi Creations. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Instagram" className="text-cream/60 hover:text-gold transition-colors"><Instagram size={18}/></a>
            <a href="#" aria-label="Facebook" className="text-cream/60 hover:text-gold transition-colors"><Facebook size={18}/></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
