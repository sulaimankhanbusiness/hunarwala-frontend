'use client';

import { useEffect, useRef } from 'react';

interface Props {
  children: React.ReactNode;
  delay?: number;        // ms
  className?: string;
}

/**
 * Wraps children in a div that fades + slides up when scrolled into view.
 * Uses IntersectionObserver — no library needed.
 */
export default function ScrollReveal({ children, delay = 0, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.classList.remove('sr-hidden');
          el.classList.add('sr-visible');
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`sr-hidden ${className}`}>
      {children}
    </div>
  );
}
