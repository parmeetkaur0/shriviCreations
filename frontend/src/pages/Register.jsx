import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const res = await register(form);
    if (res.meta.requestStatus === 'fulfilled') {
      toast.success('Account created! Welcome to Shrivi Creations.');
      navigate('/');
    } else {
      toast.error(res.payload || 'Registration failed');
    }
  };

  return (
    <div className="container-custom py-20 flex justify-center bg-[#F7ECF0]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl">Join Shrivi Creations</h1>
          <p className="text-ink/60 mt-2 text-sm">Create an account to start your handmade journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium block mb-2">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage transition-colors"
              placeholder="+91 98765 43210"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage transition-colors"
              placeholder="At least 6 characters"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-dark font-medium hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
