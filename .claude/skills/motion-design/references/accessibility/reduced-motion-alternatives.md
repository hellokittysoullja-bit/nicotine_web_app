# Reduced Motion Alternatives

## Complete Mapping

| Full Motion | Reduced Alternative | Notes |
|-------------|---------------------|-------|
| Slide + fade | Fade only | Remove translation |
| Scale from 0 | Scale from 0.95 | Minimal scale |
| Scale from 0.5 | Instant or fade | Avoid large scale changes |
| Spring bounce | Ease-out, no overshoot | Remove bounce |
| Container transform | Cross-fade | Simpler transition |
| Shared axis | Fade through | No spatial movement |
| Parallax scroll | Static or disable | No parallax |
| Rotation | Fade or static | Rotation triggers vestibular |
| Zoom/scale | Fade | Scale triggers vestibular |
| Continuous spin | Static + pulse opacity | Spinners simplified |
| Stagger reveal | Simultaneous fade | No stagger timing |
| 3D transforms | 2D fade | No depth changes |

## Duration Adjustments

| Standard Duration | Reduced Duration |
|-------------------|------------------|
| 500ms+ | 100ms |
| 300-500ms | 100ms |
| 200-300ms | 100ms |
| <200ms | Keep (already short) |

## Implementation Patterns

### CSS Pattern
```css
.element {
  transition: transform 300ms ease-out, opacity 300ms ease-out;
  transform: translateY(20px);
  opacity: 0;
}

.element.visible {
  transform: translateY(0);
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .element {
    transition: opacity 100ms ease-out;
    transform: none;
  }
}
```

### JavaScript Pattern
```javascript
const getAnimationConfig = () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return {
    duration: reduced ? 100 : 300,
    transform: reduced ? {} : { y: 20 },
    opacity: 0,
    endState: { opacity: 1, y: 0 }
  };
};
```

### React Pattern
```jsx
import { useReducedMotion } from 'framer-motion';

const AnimatedComponent = () => {
  const reduced = useReducedMotion();

  const variants = {
    hidden: {
      opacity: 0,
      y: reduced ? 0 : 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduced ? 0.1 : 0.3
      }
    }
  };

  return <motion.div variants={variants} />;
};
```

## Spinner Alternative

```jsx
// Full motion spinner
const Spinner = () => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
  />
);

// Reduced motion spinner
const ReducedSpinner = () => (
  <motion.div
    animate={{ opacity: [0.5, 1, 0.5] }}
    transition={{ repeat: Infinity, duration: 1.5 }}
  />
);
```

## Safe by Default Approach

Build reduced-motion first, enhance for full motion:

```css
/* Base: reduced motion (safe default) */
.element {
  opacity: 0;
  transition: opacity 100ms;
}

.element.visible {
  opacity: 1;
}

/* Enhanced: full motion */
@media (prefers-reduced-motion: no-preference) {
  .element {
    transform: translateY(20px);
    transition: transform 300ms ease-out, opacity 300ms ease-out;
  }

  .element.visible {
    transform: translateY(0);
  }
}
```
