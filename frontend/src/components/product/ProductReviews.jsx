import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/reviewService';
import { formatDate } from '../../utils/format';

const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} stars`}>
        <Star size={22} className={n <= value ? 'fill-gold text-gold' : 'text-ink/20'} />
      </button>
    ))}
  </div>
);

const ProductReviews = ({ productId }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => {
    setLoading(true);
    reviewService
      .getForProduct(productId)
      .then((res) => setReviews(res.reviews))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error('Please write a short comment');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('title', title);
      formData.append('comment', comment);
      await reviewService.create(productId, formData);
      toast.success('Review submitted, thank you!');
      setShowForm(false);
      setTitle('');
      setComment('');
      setRating(5);
      loadReviews();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-2xl">Customer Reviews ({reviews.length})</h2>
        {isAuthenticated && (
          <button onClick={() => setShowForm((s) => !s)} className="btn-secondary text-sm px-5 py-2.5">
            Write a Review
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-blush/30 rounded-2xl p-6 mb-8 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Your Rating</label>
            <StarInput value={rating} onChange={setRating} />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Review title (optional)"
            className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage bg-cream"
          />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={4}
            className="w-full border border-ink/15 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-sage bg-cream resize-none"
          />
          <button type="submit" disabled={submitting} className="btn-primary text-sm">
            {submitting ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-ink/50">No reviews yet. Be the first to share your thoughts!</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((r) => (
            <li key={r._id} className="border-b border-ink/10 pb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sage/30 flex items-center justify-center font-medium text-sm">
                    {r.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{r.user?.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={11} className="fill-gold text-gold" />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-ink/40">{formatDate(r.createdAt)}</span>
              </div>
              {r.title && <p className="text-sm font-medium mb-1">{r.title}</p>}
              <p className="text-sm text-ink/70 leading-relaxed">{r.comment}</p>
              {r.isVerifiedPurchase && (
                <span className="inline-block mt-2 text-[11px] text-sage-dark bg-sage-50 px-2 py-0.5 rounded-full">
                  Verified Purchase
                </span>
              )}
              {r.adminReply && (
                <div className="mt-3 bg-blush/30 rounded-xl p-3">
                  <p className="text-xs font-medium text-ink/70 mb-1">Reply from Shrivi Creations</p>
                  <p className="text-xs text-ink/60">{r.adminReply}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductReviews;
