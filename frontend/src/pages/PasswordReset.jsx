import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-24 flex justify-center">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display text-3xl mb-3">Reset Your Password</h1>
        {sent ? (
          <p className="text-ink/60 mt-4">
            If an account exists for <strong>{email}</strong>, a reset link has been sent. Please check your inbox.
          </p>
        ) : (
          <>
            <p className="text-ink/60 mb-8">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage"
              />
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}
        <Link to="/login" className="inline-block mt-8 text-sm text-sage-dark hover:underline">Back to Sign In</Link>
      </div>
    </div>
  );
};

export const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.resetPassword(token, password);
      localStorage.setItem('sc_token', res.token);
      toast.success('Password reset successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom py-24 flex justify-center">
      <div className="w-full max-w-md">
        <h1 className="font-display text-3xl mb-8 text-center">Set a New Password</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full border border-ink/15 rounded-xl px-4 py-3 text-sm outline-none focus:border-sage"
          />
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Resetting…' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};
