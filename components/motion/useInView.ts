"use client";

import { useEffect, useRef, useState } from "react";

/**
 * True once the element is sufficiently on screen. With `once` (default) it
 * stays true after the first sighting, so a drawing draws once per page view.
 */
export function useInView<T extends Element>({ threshold = 0.35, once = true }: { threshold?: number; once?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) setInView(false);
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold, once]);

  return [ref, inView] as const;
}
