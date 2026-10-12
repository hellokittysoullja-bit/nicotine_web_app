# Parallax Patterns

## Overview

Parallax creates depth by moving background elements slower than foreground elements during scroll.

**Accessibility Warning:** Parallax is a common vestibular trigger. Always provide reduced-motion alternatives.

## Basic Parallax with GSAP

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Background moves slower (parallax effect)
gsap.to('.parallax-bg', {
  y: -150,  // Moves up as user scrolls down
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});
```

## Layered Parallax

Multiple layers at different speeds:

```javascript
const layers = [
  { selector: '.layer-1', speed: -50 },   // Slowest (furthest)
  { selector: '.layer-2', speed: -100 },
  { selector: '.layer-3', speed: -150 },  // Fastest (closest)
];

layers.forEach(layer => {
  gsap.to(layer.selector, {
    y: layer.speed,
    ease: 'none',
    scrollTrigger: {
      trigger: '.parallax-container',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  });
});
```

## CSS-Only Parallax

Using `perspective` and `translateZ`:

```css
.parallax-container {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  perspective: 1px;
  perspective-origin: center center;
}

.parallax-layer {
  position: absolute;
  inset: 0;
}

.parallax-back {
  transform: translateZ(-1px) scale(2);
}

.parallax-front {
  transform: translateZ(0);
}
```

**Note:** CSS parallax is less flexible but more performant.

## Framer Motion Parallax

```jsx
import { useScroll, useTransform, motion } from 'framer-motion';

const ParallaxSection = () => {
  const { scrollYProgress } = useScroll();

  // Map scroll 0-1 to y offset
  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="hero">
      <motion.div
        className="parallax-bg"
        style={{ y }}
      />
      <div className="content">
        <h1>Hero Title</h1>
      </div>
    </div>
  );
};
```

## Horizontal Parallax

Elements move horizontally during vertical scroll:

```javascript
gsap.to('.floating-element', {
  x: 200,
  ease: 'none',
  scrollTrigger: {
    trigger: '.section',
    start: 'top bottom',
    end: 'bottom top',
    scrub: true
  }
});
```

## Reduced Motion (Critical)

**Parallax MUST be disabled for reduced motion users.**

```javascript
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReduced) {
  // Initialize parallax only if motion is OK
  initParallax();
} else {
  // Static alternative
  document.querySelectorAll('.parallax-bg').forEach(el => {
    el.style.transform = 'none';
    el.style.position = 'relative';
  });
}
```

### React Implementation

```jsx
import { useReducedMotion } from 'framer-motion';

const ParallaxSection = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // No parallax if reduced motion
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -200]
  );

  return (
    <motion.div style={{ y }}>
      {/* content */}
    </motion.div>
  );
};
```

### CSS Reduced Motion

```css
.parallax-bg {
  transform: translateY(var(--parallax-offset, 0));
}

@media (prefers-reduced-motion: reduce) {
  .parallax-bg {
    transform: none !important;
  }
}
```

## Alternative to Parallax

For vestibular-friendly depth effects:

| Instead of | Use |
|------------|-----|
| Parallax scroll | Layered static images with shadows |
| Moving backgrounds | Subtle color gradients |
| 3D transforms | 2D opacity layering |
| Continuous motion | Triggered reveals (user-controlled) |

## Performance

1. **Transform only** — Never animate `top`, `left`, `margin`
2. **will-change: transform** — Use sparingly
3. **Limit layers** — 3-4 max for mobile
4. **Test on mobile** — Parallax often disabled on iOS Safari
5. **Use `scrub: true`** — Not `scrub: 0.5` (laggy on slow devices)

## Mobile Considerations

```javascript
ScrollTrigger.matchMedia({
  // Desktop: full parallax
  '(min-width: 1024px)': () => {
    gsap.to('.parallax-bg', {
      y: -150,
      scrollTrigger: { /* ... */ }
    });
  },

  // Mobile: reduced or no parallax
  '(max-width: 1023px)': () => {
    // Either simpler parallax or none
    gsap.set('.parallax-bg', { y: 0 });
  }
});
```
