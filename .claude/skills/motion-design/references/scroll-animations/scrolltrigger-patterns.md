# GSAP ScrollTrigger Patterns

## Setup

```javascript
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

## Core Concepts

### Trigger Points

```javascript
scrollTrigger: {
  trigger: '.element',      // Element that triggers
  start: 'top 80%',         // [trigger position] [viewport position]
  end: 'bottom 20%',        // Where animation ends (for scrub)
}
```

| Start/End Value | Meaning |
|-----------------|---------|
| `top` | Top of element |
| `center` | Center of element |
| `bottom` | Bottom of element |
| `80%` | 80% down the viewport |
| `top+=100` | Top plus 100px |

### Toggle Actions

```javascript
toggleActions: 'play pause resume reset'
//              onEnter onLeave onEnterBack onLeaveBack
```

| Action | Behavior |
|--------|----------|
| `play` | Play forward |
| `pause` | Pause |
| `resume` | Continue from current |
| `reset` | Jump to start |
| `restart` | Play from start |
| `complete` | Jump to end |
| `reverse` | Play backward |
| `none` | Do nothing |

## Common Patterns

### Reveal Once

```javascript
gsap.from('.element', {
  opacity: 0,
  y: 30,
  duration: 0.25,
  ease: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  scrollTrigger: {
    trigger: '.element',
    start: 'top 85%',
    toggleActions: 'play none none none'  // Play once, never reset
  }
});
```

### Staggered Reveal

```javascript
gsap.from('.card', {
  opacity: 0,
  y: 20,
  duration: 0.25,
  stagger: 0.05,
  ease: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  scrollTrigger: {
    trigger: '.card-container',
    start: 'top 80%'
  }
});
```

### Pin While Animating

```javascript
gsap.to('.panel', {
  xPercent: -100,
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-section',
    start: 'top top',
    end: '+=3000',  // Scroll distance
    pin: true,
    scrub: 1
  }
});
```

### Batch Multiple Elements

More performant than individual triggers:

```javascript
ScrollTrigger.batch('.card', {
  onEnter: (elements) => {
    gsap.from(elements, {
      opacity: 0,
      y: 30,
      stagger: 0.05,
      duration: 0.25,
      ease: 'cubic-bezier(0.05, 0.7, 0.1, 1)'
    });
  },
  start: 'top 85%'
});
```

### Progress-Based Animation

```javascript
ScrollTrigger.create({
  trigger: '.section',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    // self.progress is 0 to 1
    document.querySelector('.progress').style.width =
      `${self.progress * 100}%`;
  }
});
```

### Scrub with Easing

```javascript
gsap.to('.element', {
  x: 500,
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: 'bottom center',
    scrub: true,  // true = instant, number = smoothing
    // scrub: 0.5 = 0.5s smoothing (can feel laggy)
  }
});
```

## Timeline with ScrollTrigger

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: '.section',
    start: 'top center',
    end: '+=500',
    scrub: true
  }
});

tl.from('.title', { opacity: 0, y: 20 })
  .from('.subtitle', { opacity: 0, y: 20 }, '-=0.1')
  .from('.cta', { opacity: 0, scale: 0.9 });
```

## Responsive Breakpoints

```javascript
ScrollTrigger.matchMedia({
  // Desktop
  '(min-width: 1024px)': function() {
    gsap.to('.parallax', {
      y: -200,
      scrollTrigger: { trigger: '.hero', scrub: true }
    });
  },

  // Mobile — disable parallax
  '(max-width: 1023px)': function() {
    // No parallax, just reveals
  }
});
```

## React Integration

```jsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Component = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.card', {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        scrollTrigger: {
          trigger: '.card-grid',
          start: 'top 80%'
        }
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup all ScrollTriggers
  }, []);

  return <div ref={containerRef}>...</div>;
};
```

## Debugging

```javascript
scrollTrigger: {
  markers: true,  // Shows start/end lines
  id: 'hero-trigger'  // Name in console
}

// Console commands
ScrollTrigger.getAll()  // List all triggers
ScrollTrigger.getById('hero-trigger')  // Get specific
```
