
# Scroll Animations

Scroll-triggered and scroll-linked motion patterns.

## Standards Reference

| Tool/API | Documentation |
|----------|---------------|
| GSAP ScrollTrigger | gsap.com/docs/v3/Plugins/ScrollTrigger |
| Intersection Observer | developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API |
| CSS scroll-driven | developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll-driven_animations |

## Two Types of Scroll Animation

| Type | Behavior | Use Case |
|------|----------|----------|
| **Scroll-triggered** | Animation plays when element enters viewport | Reveal animations, stagger |
| **Scroll-linked** | Animation progress tied to scroll position | Parallax, scrubbing, progress |

## Scroll-Triggered (Reveal on Scroll)

### Intersection Observer (Vanilla JS)

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Once only
      }
    });
  },
  { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 250ms cubic-bezier(0.05, 0.7, 0.1, 1),
              transform 250ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .animate-on-scroll {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
```

### GSAP ScrollTrigger (Triggered)

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

gsap.from('.card', {
  opacity: 0,
  y: 30,
  duration: 0.25, // medium-1
  ease: 'cubic-bezier(0.05, 0.7, 0.1, 1)', // emphasized-decelerate
  stagger: 0.05,
  scrollTrigger: {
    trigger: '.card-grid',
    start: 'top 80%',  // When top of trigger hits 80% of viewport
    toggleActions: 'play none none none'
  }
});
```

## Scroll-Linked (Scrubbing)

### GSAP ScrollTrigger (Scrub)

```javascript
gsap.to('.progress-bar', {
  scaleX: 1,
  ease: 'none', // Linear for scroll-linked
  scrollTrigger: {
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true  // Links animation to scroll position
  }
});
```

### Parallax

```javascript
gsap.to('.parallax-bg', {
  y: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true
  }
});
```

## Viewport-Aware Stagger

Prioritize above-the-fold content for faster perceived load.

```javascript
const cards = gsap.utils.toArray('.card');

// Determine which cards are above the fold
const foldPosition = window.innerHeight;
const aboveFold = cards.filter(card =>
  card.getBoundingClientRect().top < foldPosition
);
const belowFold = cards.filter(card =>
  card.getBoundingClientRect().top >= foldPosition
);

// Phase 1: Above fold — faster, tighter stagger
gsap.from(aboveFold, {
  opacity: 0,
  y: 16,
  duration: 0.2,  // short-4
  ease: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  stagger: 0.04   // Tighter
});

// Phase 2: Below fold — triggered on scroll
gsap.from(belowFold, {
  opacity: 0,
  y: 16,
  duration: 0.25, // medium-1
  ease: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  stagger: 0.05,
  scrollTrigger: {
    trigger: belowFold[0],
    start: 'top 85%'
  }
});
```

## Reduced Motion

**Critical:** Scroll animations often trigger vestibular issues.

```javascript
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReduced) {
  // Option 1: Disable all scroll animations
  ScrollTrigger.getAll().forEach(st => st.kill());
  gsap.set('.animate', { opacity: 1, y: 0 });

  // Option 2: Keep reveals, remove parallax
  // Reveals are OK (fade only), parallax is not
}
```

### Safe vs. Unsafe Scroll Animations

| Safe (Reduced Motion OK) | Unsafe (Disable) |
|--------------------------|------------------|
| Fade on scroll | Parallax |
| Progress indicator | Horizontal scroll hijack |
| Simple reveal | Zoom on scroll |
| Sticky headers | 3D transforms |

## Performance

1. **Use `will-change`** sparingly
2. **Animate transforms/opacity only** — avoid layout properties
3. **Use `scrub: true`** not `scrub: 0.5` for smoother scrubbing
4. **Batch observers** — one observer for multiple elements
5. **Kill ScrollTriggers** on unmount (React/SPA)

```javascript
// React cleanup
useEffect(() => {
  const ctx = gsap.context(() => {
    // ScrollTrigger animations here
  });
  return () => ctx.revert(); // Cleanup
}, []);
```

See `scroll-animations/scrolltrigger-patterns.md` for advanced GSAP patterns.
See `scroll-animations/intersection-observer.md` for vanilla JS patterns.
See `scroll-animations/scrubbing-media.md` for Lottie/video scrubbing.
See `scroll-animations/parallax.md` for parallax with accessibility.
