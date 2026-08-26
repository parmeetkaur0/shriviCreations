import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to an element and a boolean indicating
 * whether it has scrolled into view. Used to drive scroll-triggered
 * fade/slide animations and the signature stitch-line underline draw.
 */
export const useScrollReveal = (options = { threshold: 0.2, triggerOnce: true }) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.triggerOnce) observer.unobserve(node);
        } else if (!options.triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold: options.threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [options.threshold, options.triggerOnce]);

  return [ref, isInView];
};
