# Intersection Observer Patterns

## Overview

Intersection Observer is a native browser API for detecting when elements enter/exit the viewport. Zero dependencies, excellent performance.

## Basic Setup

```javascript
const observer = new IntersectionObserver(callback, options);

// Options
const options = {
  root: null,           // Viewport (null = browser viewport)
  rootMargin: '0px',    // Margin around root
  threshold: 0          // 0-1, when to trigger (0 = any pixel visible)
};

// Callback
const callback = (entries, observer) => {
  entries.forEach(entry => {
    // entry.isIntersecting — boolean
    // entry.intersectionRatio — 0 to 1
    // entry.target — the observed element
  });
};
```

## Common Patterns

### Reveal on Scroll (Once)

```javascript
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Stop observing
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('[data-reveal]').forEach(el => {
  revealObserver.observe(el);
});
```

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(20px);
  transition:
    opacity 250ms cubic-bezier(0.05, 0.7, 0.1, 1),
    transform 250ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

[data-reveal].visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Staggered Reveal

```javascript
const staggerObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries.filter(e => e.isIntersecting);

    visible.forEach((entry, index) => {
      // Stagger delay: 50ms per item
      entry.target.style.transitionDelay = `${index * 50}ms`;
      entry.target.classList.add('visible');
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.card').forEach(el => {
  staggerObserver.observe(el);
});
```

### Lazy Load Images

```javascript
const lazyObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        observer.unobserve(img);
      }
    });
  },
  { rootMargin: '100px' }  // Load 100px before visible
);

document.querySelectorAll('img.lazy').forEach(img => {
  lazyObserver.observe(img);
});
```

### Progress Tracking

```javascript
const progressObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      // Use intersectionRatio for progress
      const progress = entry.intersectionRatio;
      document.querySelector('.progress').style.width =
        `${progress * 100}%`;
    });
  },
  { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
  // Threshold at every 1% for smooth progress
);
```

### Viewport-Aware Stagger

```javascript
const foldPosition = window.innerHeight;

const aboveFoldObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Faster animation for above-fold
        entry.target.style.transitionDuration = '200ms';
        entry.target.style.transitionDelay = `${i * 40}ms`;
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0 }
);

const belowFoldObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Standard animation for below-fold
        entry.target.style.transitionDuration = '250ms';
        entry.target.style.transitionDelay = `${i * 50}ms`;
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll('.card').forEach(card => {
  const rect = card.getBoundingClientRect();
  if (rect.top < foldPosition) {
    aboveFoldObserver.observe(card);
  } else {
    belowFoldObserver.observe(card);
  }
});
```

## React Hook

```jsx
import { useEffect, useRef, useState } from 'react';

const useInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.once) {
            observer.unobserve(element);
          }
        } else if (!options.once) {
          setIsInView(false);
        }
      },
      {
        threshold: options.threshold ?? 0.2,
        rootMargin: options.rootMargin ?? '0px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [options.once, options.threshold, options.rootMargin]);

  return [ref, isInView];
};

// Usage
const Card = () => {
  const [ref, isInView] = useInView({ once: true, threshold: 0.2 });

  return (
    <div
      ref={ref}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'none' : 'translateY(20px)',
        transition: 'all 250ms cubic-bezier(0.05, 0.7, 0.1, 1)'
      }}
    >
      Content
    </div>
  );
};
```

## Reduced Motion

```javascript
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReduced) {
  // Skip animations, just show content
  document.querySelectorAll('[data-reveal]').forEach(el => {
    el.classList.add('visible');
    el.style.transition = 'none';
  });
} else {
  // Set up observers
  initRevealObservers();
}
```

## Performance Tips

1. **One observer for many elements** — Don't create an observer per element
2. **Unobserve after trigger** — For one-time animations
3. **Use rootMargin** — Trigger before visible for smoother experience
4. **Disconnect on unmount** — Prevent memory leaks
5. **Batch class changes** — Use `requestAnimationFrame` if adding many classes
