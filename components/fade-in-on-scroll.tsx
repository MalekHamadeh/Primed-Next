"use client";

import React, { useEffect, useRef, useState } from "react";

type FadeInOnScrollProps = {
  children: React.ReactNode;
  /** Optional delay in ms for staggering */
  delayMs?: number;
  /** Once visible, keep it visible */
  once?: boolean;
  /** Intersection threshold */
  threshold?: number;
  /** Root margin to trigger earlier/later */
  rootMargin?: string;
  /** Additional className to pass through */
  className?: string;
};

export default function FadeInOnScroll({
  children,
  delayMs = 0,
  once = true,
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
  className = "",
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);
  // Start hidden on both server and client to avoid hydration mismatches.
  // We'll reveal after mount via IntersectionObserver (or immediately if unsupported).
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      // Fallback: if IO isn't supported, reveal on next task to avoid sync state in effect.
      const timeoutId = window.setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delayMs > 0) {
              timerRef.current = window.setTimeout(
                () => setIsVisible(true),
                delayMs
              );
            } else {
              setIsVisible(true);
            }
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [delayMs, once, threshold, rootMargin]);

  return (
    <div
      ref={ref}
      className={`${className} ${
        isVisible ? "animate-fade-in" : "opacity-0 translate-y-[20px]"
      }`}
    >
      {children}
    </div>
  );
}
