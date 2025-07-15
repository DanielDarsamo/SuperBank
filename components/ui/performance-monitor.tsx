'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PerformanceMetrics {
  loadTime: number;
  interactionTime: number;
  memoryUsage: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    // Monitor initial load time
    const loadTime = performance.now();
    
    // Monitor interaction response time
    let interactionStart = 0;
    const handleInteractionStart = () => {
      interactionStart = performance.now();
    };
    
    const handleInteractionEnd = () => {
      if (interactionStart > 0) {
        const interactionTime = performance.now() - interactionStart;
        if (interactionTime > 100) {
          console.warn(`Slow interaction detected: ${interactionTime.toFixed(2)}ms`);
        }
        interactionStart = 0;
      }
    };

    // Add event listeners for interaction monitoring
    document.addEventListener('click', handleInteractionStart);
    document.addEventListener('keydown', handleInteractionStart);
    document.addEventListener('transitionend', handleInteractionEnd);
    document.addEventListener('animationend', handleInteractionEnd);

    // Monitor memory usage (if available)
    const getMemoryUsage = () => {
      if ('memory' in performance) {
        return (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      }
      return 0;
    };

    // Set initial metrics
    setMetrics({
      loadTime,
      interactionTime: 0,
      memoryUsage: getMemoryUsage()
    });

    // Performance warnings
    if (loadTime > 2000) {
      toast.error('Slow page load detected. Please check your connection.');
    }

    // Cleanup
    return () => {
      document.removeEventListener('click', handleInteractionStart);
      document.removeEventListener('keydown', handleInteractionStart);
      document.removeEventListener('transitionend', handleInteractionEnd);
      document.removeEventListener('animationend', handleInteractionEnd);
    };
  }, []);

  // Only render in development
  if (process.env.NODE_ENV !== 'development' || !metrics) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded font-mono z-50">
      <div>Load: {metrics.loadTime.toFixed(0)}ms</div>
      <div>Memory: {metrics.memoryUsage.toFixed(1)}MB</div>
    </div>
  );
}