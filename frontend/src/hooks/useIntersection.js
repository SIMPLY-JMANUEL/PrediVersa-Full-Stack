/**
 * Custom hook for intersection observer
 * Optimized for performance with proper cleanup
 */
import { useState, useEffect, useRef, useCallback } from 'react';

export function useIntersection(
  elementRef,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  } = {}
) {
  const [isVisible, setIsVisible] = useState(false);
  const frozen = useRef(false);

  const updateEntry = useCallback(
    ([entry]) => {
      if (frozen.current && entry.isIntersecting) return;

      setIsVisible(entry.isIntersecting);

      if (freezeOnceVisible && entry.isIntersecting) {
        frozen.current = true;
      }
    },
    [freezeOnceVisible]
  );

  useEffect(() => {
    const node = elementRef?.current; // DOM node
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen.current || !node) {
      return;
    }

    const observerParams = { threshold, root, rootMargin };
    const observer = new window.IntersectionObserver(
      updateEntry,
      observerParams
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible, updateEntry]);

  return isVisible;
}

/**
 * Hook for performance monitoring
 */
export function usePerformanceMonitor(componentName) {
  useEffect(() => {
    if (!window.performance) return;

    const startTime = window.performance.now();

    return () => {
      const endTime = window.performance.now();
      const renderTime = endTime - startTime;

      // Log performance metrics
      if (renderTime > 16) {
        // More than one frame (60fps)
        console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
      }

      // Send to analytics if available
      if (window.gtag) {
        window.gtag('event', 'component_render_time', {
          event_category: 'performance',
          event_label: componentName,
          value: Math.round(renderTime),
        });
      }
    };
  }, [componentName]);
}

/**
 * Hook for reduced motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}
