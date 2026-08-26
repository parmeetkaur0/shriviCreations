import { useLayoutEffect, useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHeading from '../common/SectionHeading';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: '01',
    title: 'Choosing the Yarn',
    desc: 'Every piece begins with hand-selected cotton and natural fiber yarns, chosen for softness, durability, and color depth.',
  },
  {
    n: '02',
    title: 'Stitch by Stitch',
    desc: 'Each flower, petal, or panel is crocheted by hand — a slow process that can take anywhere from hours to days per piece.',
  },
  {
    n: '03',
    title: 'Shaping & Finishing',
    desc: 'Pieces are steamed, shaped, and finished with wire, lining, or hardware depending on the design.',
  },
  {
    n: '04',
    title: 'Quality Checked & Packed',
    desc: 'Every item is inspected by hand before being wrapped and readied for its new home.',
  },
];

const INDENTS = [0, 70, 140, 210];

const HandmadeProcess = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const glowPathRef = useRef(null);
  const circleRefs = useRef([]);
  const cardRefs = useRef([]);
  const [isReady, setIsReady] = useState(false);

  // Function to build and update the path
  const buildPath = () => {
    const container = containerRef.current;
    const path = pathRef.current;
    const glowPath = glowPathRef.current;
    
    if (!container || !path || !glowPath) return null;

    const containerRect = container.getBoundingClientRect();
    const points = circleRefs.current
      .filter(el => el)
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          x: r.left - containerRect.left + r.width / 2,
          y: r.top - containerRect.top + r.height / 2,
        };
      });

    if (points.length < 2) return null;

    // Create smooth curved path
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      // Use bezier curves for thread-like flow
      const midY = (a.y + b.y) / 2;
      const dx = (b.x - a.x) * 0.3;
      d += ` C ${a.x + dx} ${a.y + (b.y - a.y) * 0.3}, ${b.x - dx} ${b.y - (b.y - a.y) * 0.3}, ${b.x} ${b.y}`;
    }

    path.setAttribute('d', d);
    glowPath.setAttribute('d', d);

    return path.getTotalLength();
  };

  // Setup animation
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (!isReady) return;

    let ctx;
    let animationFrame;

    const initAnimation = () => {
      const length = buildPath();
      if (!length) return;

      const path = pathRef.current;
      const glowPath = glowPathRef.current;
      
      // Set initial state
      gsap.set([path, glowPath], {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0
      });

      // Create the animation timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: 1.2,
          invalidateOnRefresh: true,
        }
      });

      // Fade in and draw the thread
      tl.to(path, {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 2,
        ease: 'power2.inOut'
      })
      .to(glowPath, {
        strokeDashoffset: 0,
        opacity: 0.3,
        duration: 2,
        ease: 'power2.inOut'
      }, 0);

      // Animate heading
      gsap.fromTo(
        '.pp-header > *',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: 'top 85%' 
          },
        }
      );

      // Animate circles
      circleRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.1,
            ease: 'back.out(2.5)',
            scrollTrigger: { 
              trigger: el, 
              start: 'top 85%' 
            },
          }
        );
      });

      // Animate cards
      cardRefs.current.forEach((el, index) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0, x: 30, y: 15 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.7,
            delay: index * 0.1 + 0.2,
            ease: 'power3.out',
            scrollTrigger: { 
              trigger: el, 
              start: 'top 88%' 
            },
          }
        );
      });

      return tl;
    };

    // Initialize animation
    ctx = gsap.context(() => {
      animationFrame = requestAnimationFrame(() => {
        const tl = initAnimation();
        
        // Handle resize
        const handleResize = () => {
          const newLength = buildPath();
          if (newLength && pathRef.current && glowPathRef.current) {
            gsap.set([pathRef.current, glowPathRef.current], {
              strokeDasharray: newLength,
              strokeDashoffset: newLength,
            });
            ScrollTrigger.refresh();
          }
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          if (tl) tl.kill();
        };
      });
    }, sectionRef);

    // Refresh ScrollTrigger after animation setup
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      ctx && ctx.revert();
    };
  }, [isReady]);

  return (
    <section ref={sectionRef} className="py-16 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-secondary">
      <div className="container-custom">
        <div className="pp-header">
          <SectionHeading
            eyebrow="Our Craft"
            title="How Each Piece Comes to Life"
            align="center"
          />
        </div>

        <div ref={containerRef} className="relative z-0 max-w-4xl mx-auto mt-16">
          {/* Connecting thread path */}
          <svg
            className="absolute inset-0 z-0 w-full h-full pointer-events-none overflow-visible"
            aria-hidden="true"
            style={{ minHeight: '500px' }}
          >
            {/* Glow path - thicker and softer */}
            <path
              ref={glowPathRef}
              fill="none"
              stroke="#f1b7cc"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
              style={{ filter: 'blur(3px)' }}
            />
            {/* Main thread path */}
            <path
              ref={pathRef}
              fill="none"
              stroke="#a95d79"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0"
            />
          </svg>

          <div className="relative z-10 flex flex-col gap-8 sm:gap-10 md:gap-14">
            {steps.map((step, i) => (
              <div
                key={step.n}
                className="relative flex flex-col sm:flex-row items-start gap-4 sm:gap-5 md:gap-6"
                style={{
                  marginLeft:
                    i > 0 ? `clamp(10px, ${i * 2.5}vw, ${INDENTS[i]}px)` : 0,
                }}
              >
                {/* Circle Number */}
                <div
                  ref={(el) => (circleRefs.current[i] = el)}
                  className="relative z-20 w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-full bg-[#F7ECF0] text-[#2C1810] font-playfair font-bold flex items-center justify-center shadow-md text-sm sm:text-base transition-all duration-300 hover:scale-110 hover:shadow-lg border-2 border-[#a95d79]/20"
                >
                  {step.n}
                </div>

                {/* Card */}
                <div
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="relative flex-1 w-full bg-white/90 backdrop-blur-sm border border-[#F7ECF0] rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500 p-4 sm:p-5 md:p-6"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-playfair font-bold text-base sm:text-lg md:text-xl text-[#2C1810] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#2C1810]/60 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Right accent bar */}
                  <span className="hidden md:block absolute right-0 top-6 bottom-6 w-1 rounded-full bg-[#a95d79]/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HandmadeProcess;