
# Easing Curves

Industry-standard easing curves with cross-system comparison.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org (cubicBezier type) |
| Material Design 3 | m3.material.io/styles/motion/easing-and-duration |
| Fluent 2 | fluent2.microsoft.design/motion |
| Carbon | carbondesignsystem.com/guidelines/motion |
| CSS | w3.org/TR/css-easing-1 |

## Primary Curves (M3 Baseline)

Load from: `tokens/easing.tokens.json`

| Token | Cubic Bezier | Use |
|-------|--------------|-----|
| `standard` | (0.2, 0, 0, 1) | Most animations |
| `emphasized-decelerate` | (0.05, 0.7, 0.1, 1) | **Entering** screen |
| `emphasized-accelerate` | (0.3, 0, 0.8, 0.15) | **Exiting** screen |
| `linear` | (0, 0, 1, 1) | Continuous loops |

## Selection Guide

```
Is element ENTERING? → emphasized-decelerate
Is element EXITING?  → emphasized-accelerate
Is element MOVING?   → standard
Is it CONTINUOUS?    → linear
Is it IMPORTANT?     → emphasized
```

## Cross-System Comparison

| Purpose | M3 | Fluent | Carbon |
|---------|-----|--------|--------|
| Standard | (0.2, 0, 0, 1) | (0.1, 0.9, 0.2, 1) | (0.2, 0, 0.38, 0.9) |
| Enter | (0.05, 0.7, 0.1, 1) | (0.1, 0.9, 0.2, 1) | (0, 0, 0.38, 0.9) |
| Exit | (0.3, 0, 0.8, 0.15) | (0.9, 0.1, 1, 0.2) | (0.2, 0, 1, 0.9) |

## Implementation

### JavaScript (GSAP)
```javascript
import tokens from '../tokens/easing.tokens.json';

const easing = tokens.motion.easing;
gsap.to('.element', {
  x: 100,
  duration: 0.3,
  ease: `cubic-bezier(${easing.standard.$value.join(',')})`
});
```

### CSS
```css
.entering {
  transition: all 250ms cubic-bezier(0.05, 0.7, 0.1, 1);
}
.exiting {
  transition: all 200ms cubic-bezier(0.3, 0, 0.8, 0.15);
}
```

### Remotion
```javascript
import { Easing } from 'remotion';
import tokens from '../tokens/easing.tokens.json';

const [x1, y1, x2, y2] = tokens.motion.easing['emphasized-decelerate'].$value;
const easing = Easing.bezier(x1, y1, x2, y2);
```

### React (Framer Motion)
```jsx
<motion.div
  animate={{ opacity: 1 }}
  transition={{
    duration: 0.25,
    ease: [0.05, 0.7, 0.1, 1] // emphasized-decelerate
  }}
/>
```

## Property-Specific Easing (Google M3 Rule)

**DO NOT** apply the same easing to all properties. Google M3 requires different easing for different property types.

| Property Type | Easing | Reasoning |
|--------------|--------|-----------|
| Transform (translate, scale, rotate) | Asymmetric (emphasized) | Needs physics simulation |
| Opacity | Linear allowed | No spatial component |
| Color/background | Linear | No spatial component |
| Filter (blur, etc.) | Either | Depends on visual weight |

### WRONG

```css
.element {
  transition: all 300ms ease-in-out; /* Lazy, amateurish */
}
```

### CORRECT

```css
.element {
  transition:
    transform 300ms cubic-bezier(0.2, 0, 0, 1),  /* Emphasized for spatial */
    opacity 100ms linear;                          /* Linear for fade */
}
```

### Container Transform Example

```javascript
// Transform uses emphasized easing
gsap.to(container, {
  x: 100,
  width: 400,
  height: 300,
  duration: 0.3,
  ease: 'power2.out' // Emphasized approximation
});

// Content swap uses linear (nested timing)
gsap.to(oldContent, { opacity: 0, duration: 0.1, ease: 'none' });
gsap.to(newContent, { opacity: 1, duration: 0.2, ease: 'none', delay: 0.1 });
```

### Remotion Example

```typescript
import { interpolate, Easing } from 'remotion';

const emphasized = Easing.bezier(0.2, 0, 0, 1);

// Transform with emphasized
const x = interpolate(frame, [0, 9], [0, 100], { easing: emphasized });

// Opacity with linear (no easing param = linear)
const opacity = interpolate(frame, [0, 3], [1, 0]);
```

See `easing/curve-comparison.md` for visual comparisons.
See `easing/easing-selection.md` for detailed selection logic.
