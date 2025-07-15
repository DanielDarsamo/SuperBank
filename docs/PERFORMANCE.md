# Performance Guidelines

## Performance Targets

### Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Custom Metrics
- **Initial Load Time**: < 2s
- **Interaction Response Time**: < 100ms
- **Time to Interactive (TTI)**: < 3s

## Optimization Strategies

### Code Splitting
```typescript
// Dynamic imports for route-based splitting
const AccountOpening = dynamic(() => import('./account-opening/page'), {
  loading: () => <LoadingSpinner />,
});

// Component-based splitting
const FAQModal = lazy(() => import('@/components/ui/faq-modal'));
```

### Image Optimization
```tsx
// Next.js Image component with optimization
import Image from 'next/image';

<Image
  src="/hero-image.jpg"
  alt="Banking services"
  width={800}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for duplicate dependencies
npm run bundle-analyzer
```

### Caching Strategies
```typescript
// Service Worker for offline caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// API response caching
const cache = new Map();
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes
    return cached.data;
  }
  return null;
};
```

## Performance Monitoring

### Real User Monitoring (RUM)
```typescript
// Performance metrics collection
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    if (entry.entryType === 'navigation') {
      console.log('Page Load Time:', entry.loadEventEnd - entry.loadEventStart);
    }
  }
});

observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] });
```

### Custom Performance Tracking
```typescript
// Track interaction response times
const trackInteraction = (name: string, startTime: number) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration > 100) {
    console.warn(`Slow interaction: ${name} took ${duration}ms`);
  }
  
  // Send to analytics
  analytics.track('interaction_performance', {
    name,
    duration,
    timestamp: Date.now(),
  });
};
```

## Optimization Checklist

### JavaScript
- [ ] Remove unused code (tree shaking)
- [ ] Minimize bundle size
- [ ] Use dynamic imports for code splitting
- [ ] Implement lazy loading for components
- [ ] Optimize third-party libraries

### CSS
- [ ] Remove unused CSS
- [ ] Use CSS-in-JS for component-scoped styles
- [ ] Minimize critical CSS
- [ ] Use CSS containment where appropriate

### Images
- [ ] Use WebP format where supported
- [ ] Implement responsive images
- [ ] Add proper alt text
- [ ] Use lazy loading for below-fold images
- [ ] Optimize image sizes

### Network
- [ ] Enable gzip/brotli compression
- [ ] Use CDN for static assets
- [ ] Implement proper caching headers
- [ ] Minimize HTTP requests
- [ ] Use HTTP/2 server push

### Runtime Performance
- [ ] Avoid memory leaks
- [ ] Optimize re-renders
- [ ] Use React.memo for expensive components
- [ ] Implement virtual scrolling for large lists
- [ ] Debounce user inputs

## Testing Performance

### Lighthouse Audits
```bash
# Run Lighthouse CI
npm run lighthouse

# Performance budget
lighthouse --budget-path=budget.json https://your-app.com
```

### Load Testing
```bash
# Artillery load testing
artillery run load-test.yml

# K6 performance testing
k6 run performance-test.js
```

### Performance Budget
```json
{
  "budget": [
    {
      "resourceType": "script",
      "budget": 400
    },
    {
      "resourceType": "total",
      "budget": 1600
    },
    {
      "timingType": "first-contentful-paint",
      "budget": 2000
    }
  ]
}
```

## Monitoring Tools

### Development
- Chrome DevTools Performance tab
- React DevTools Profiler
- Bundle Analyzer
- Lighthouse

### Production
- Google Analytics Core Web Vitals
- New Relic Browser Monitoring
- DataDog RUM
- Custom performance tracking

## Common Performance Issues

### React-Specific
- Unnecessary re-renders
- Large component trees
- Inefficient state updates
- Missing key props in lists

### General Web
- Blocking JavaScript
- Large images
- Too many HTTP requests
- Inefficient CSS selectors
- Memory leaks

### Solutions
```typescript
// Memoization for expensive calculations
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// Callback memoization
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);

// Component memoization
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* expensive rendering */}</div>;
});
```