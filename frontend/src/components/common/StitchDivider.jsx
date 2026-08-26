import { useScrollReveal } from '../../hooks/useScrollReveal';

/**
 * The brand's signature visual element: a single hand-drawn thread
 * that loops like a crochet stitch, tracing itself in under section
 * titles as the page is scrolled. Used sparingly, once per section.
 */
const StitchDivider = ({ align = 'left', className = '' }) => {
  const [ref, isInView] = useScrollReveal();

  return (
    <span
      ref={ref}
      className={`stitch-underline ${isInView ? 'in-view' : ''} ${
        align === 'center' ? 'mx-auto' : ''
      } ${className}`}
    >
      <svg width="90" height="14" viewBox="0 0 90 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 7 C 14 1, 20 13, 32 7 S 50 1, 62 7 S 80 13, 88 7" />
      </svg>
    </span>
  );
};

export default StitchDivider;
