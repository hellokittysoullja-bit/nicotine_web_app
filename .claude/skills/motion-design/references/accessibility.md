
# Motion Accessibility

WCAG 2.1 compliance and reduced motion implementation.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| WCAG 2.1 | w3.org/WAI/WCAG21/Understanding/animation-from-interactions |
| WCAG 2.3.3 | Animation from Interactions (AAA) |
| M3 Accessibility | m3.material.io/styles/motion/accessibility |

## Requirements

### WCAG 2.3.3 (AAA)
Motion can be disabled unless essential to functionality.

### Key Rules
1. **Honor `prefers-reduced-motion`** — Always check user preference
2. **No flashing > 3Hz** — Seizure risk
3. **Provide pause/stop** — For auto-playing content
4. **Essential motion can remain** — But reduce intensity

## Who Is Affected

- ~35% of adults 40+ have vestibular dysfunction
- Triggers: parallax, zooming, spinning, bouncing
- Symptoms: dizziness, nausea, disorientation

## Reduced Motion Strategy

### Remove
- Decorative animations
- Parallax effects
- Auto-playing animations
- Continuous motion

### Reduce
- Use `short-1`/`short-2` durations
- Minimize travel distance
- Remove overshooting/bouncing

### Replace
- Slide → Fade
- Scale → Opacity
- Complex → Simple state change

### Retain
- Essential feedback (simplified)
- State indicators
- Focus visibility

## Implementation

### CSS
```css
/* Disable all motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Better: Provide alternatives */
@media (prefers-reduced-motion: reduce) {
  .slide-in {
    animation: none;
    opacity: 1;
  }
}
```

### JavaScript
```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const getAnimation = () => prefersReducedMotion
  ? { opacity: [0, 1], duration: 100 }  // Fade only, short
  : { opacity: [0, 1], y: [20, 0], duration: 250 };  // Full animation
```

### React (Framer Motion)
```jsx
import { useReducedMotion } from 'framer-motion';

const Component = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={{ opacity: 1, y: shouldReduceMotion ? 0 : 20 }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.25 }}
    />
  );
};
```

## Alternatives Table

| Full Motion | Reduced Alternative | Duration |
|-------------|---------------------|----------|
| Slide + fade | Fade only | short-2 (100ms) |
| Scale from 0.5 | Scale from 0.95 | short-2 (100ms) |
| Spring bounce | ease-out, no overshoot | short-3 (150ms) |
| Container transform | Cross-fade | medium-1 (250ms) |
| Parallax | Static or subtle opacity | - |

## Safe Animations (Always OK)

- Opacity transitions
- Color transitions
- Border/outline changes
- Very short durations (<100ms)
- User-initiated animations

See `accessibility/wcag-requirements.md` for full WCAG text.
See `accessibility/reduced-motion-alternatives.md` for complete mapping.
