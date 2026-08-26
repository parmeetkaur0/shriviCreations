import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="container-custom py-32 text-center">
    <p className="font-display text-8xl text-sage/40 mb-4">404</p>
    <h1 className="font-display text-3xl mb-3">This Page Unraveled</h1>
    <p className="text-ink/60 mb-8">The page you're looking for doesn't exist or has moved.</p>
    <Link to="/" className="btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
