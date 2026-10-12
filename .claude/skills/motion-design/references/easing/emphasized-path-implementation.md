# Emphasized Path Implementation

The M3 `emphasized` easing is a **two-segment cubic bezier path**, not a single curve. This document explains how to implement it across platforms.

## The Problem

Single cubic-bezier curves are limited in their expressiveness. M3's emphasized easing requires an initial acceleration phase followed by a long deceleration - impossible with one curve.

## The M3 Path

```
M 0,0 C 0.05, 0, 0.133333, 0.06, 0.166666, 0.4 C 0.208333, 0.82, 0.25, 1, 1, 1
```

### Breakdown

| Segment | Control Points | Time Range | Effect |
|---------|---------------|------------|--------|
| 1 | C 0.05, 0, 0.133333, 0.06, 0.166666, 0.4 | 0% → 16.7% | Fast acceleration |
| 2 | C 0.208333, 0.82, 0.25, 1, 1, 1 | 16.7% → 100% | Long deceleration |

## Implementation by Platform

### CSS (Modern - linear() function)

```css
/* Exact M3 emphasized - Chrome 113+, Safari 17.2+ */
.emphasized {
  transition: transform 500ms linear(
    0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%,
    0.721 25.3%, 0.849 31.5%, 0.937 38.1%,
    0.968 41.8%, 0.991 47.3%, 1
  );
}

/* Fallback - single bezier approximation */
@supports not (transition-timing-function: linear(0, 1)) {
  .emphasized {
    transition: transform 500ms cubic-bezier(0.2, 0, 0, 1);
  }
}
```

### CSS (Feature Detection)

```javascript
const supportsLinear = CSS.supports('transition-timing-function', 'linear(0, 1)');

const emphasized = supportsLinear
  ? 'linear(0, 0.006, 0.025 2.8%, 0.101 6.1%, 0.539 18.9%, 0.721 25.3%, 0.849 31.5%, 0.937 38.1%, 0.968 41.8%, 0.991 47.3%, 1)'
  : 'cubic-bezier(0.2, 0, 0, 1)';
```

### Android (PathInterpolator)

```kotlin
val emphasizedInterpolator = PathInterpolator(
    Path().apply {
        moveTo(0f, 0f)
        cubicTo(0.05f, 0f, 0.133333f, 0.06f, 0.166666f, 0.4f)
        cubicTo(0.208333f, 0.82f, 0.25f, 1f, 1f, 1f)
    }
)

// Usage
ObjectAnimator.ofFloat(view, "translationX", 0f, 100f).apply {
    duration = 500
    interpolator = emphasizedInterpolator
}
```

### iOS/Swift (CAMediaTimingFunction + CAKeyframeAnimation)

```swift
// CAMediaTimingFunction only supports single cubic-bezier
// Use CAKeyframeAnimation for exact path

let animation = CAKeyframeAnimation(keyPath: "position.x")
animation.duration = 0.5

// Define keyframe values at specific times
animation.values = [0, 40, 100]
animation.keyTimes = [0, 0.167, 1.0]

// Different timing for each segment
animation.timingFunctions = [
    CAMediaTimingFunction(controlPoints: 0.05, 0, 0.133, 0.06),
    CAMediaTimingFunction(controlPoints: 0.208, 0.82, 0.25, 1)
]
```

### JavaScript (Custom Interpolator)

```javascript
function emphasizedEasing(t) {
  const switchPoint = 0.166666;

  if (t <= 0) return 0;
  if (t >= 1) return 1;

  if (t < switchPoint) {
    // Segment 1: 0 → 0.4 over t = 0 → 0.167
    const localT = t / switchPoint;
    return cubicBezier(localT, 0.05, 0, 0.133333, 0.06) * 0.4;
  } else {
    // Segment 2: 0.4 → 1.0 over t = 0.167 → 1.0
    const localT = (t - switchPoint) / (1 - switchPoint);
    return 0.4 + cubicBezier(localT, 0.208333, 0.82, 0.25, 1) * 0.6;
  }
}

function cubicBezier(t, x1, y1, x2, y2) {
  // De Casteljau's algorithm or Newton-Raphson
  // ... implementation
}
```

### Framer Motion

```tsx
// Framer Motion doesn't support multi-segment beziers directly
// Option 1: Use single bezier approximation
const emphasized = [0.2, 0, 0, 1];

// Option 2: Use keyframes for pseudo-segment behavior
const variants = {
  hidden: { x: 0 },
  visible: {
    x: 100,
    transition: {
      duration: 0.5,
      ease: [0.2, 0, 0, 1] // Approximation
    }
  }
};

// Option 3: Spring physics (recommended for M3)
const springTransition = {
  type: "spring",
  damping: 0.9,
  stiffness: 700
};
```

### GSAP

```javascript
// GSAP supports custom easing functions
gsap.registerEasing("emphasized", emphasizedEasing);

gsap.to(".element", {
  x: 100,
  duration: 0.5,
  ease: "emphasized"
});

// Or use CustomEase plugin with SVG path
gsap.registerPlugin(CustomEase);
CustomEase.create("emphasized",
  "M0,0 C0.05,0 0.133,0.06 0.167,0.4 0.208,0.82 0.25,1 1,1"
);
```

### Remotion

```tsx
import { interpolate, Easing } from 'remotion';

// Approximation with single bezier
const emphasizedBezier = Easing.bezier(0.2, 0, 0, 1);

// For exact behavior, use frame-based keyframes
const emphasizedInterpolate = (frame: number, fps: number) => {
  const duration = 0.5; // seconds
  const totalFrames = duration * fps;
  const t = frame / totalFrames;

  return emphasizedEasing(t);
};
```

## Visual Comparison

```
Value
1.0 |                    .---------
    |                 .-'
    |              .-'
0.4 |        .----'
    |      .'
    |    .'
    |  .'
0.0 |.-'
    +--------------------------------
    0%   16.7%                    100%
         ^
         Switch point between segments
```

## When to Use Each Representation

| Token | Use Case |
|-------|----------|
| `emphasized` | Broadest compatibility, acceptable approximation |
| `emphasized-path` | Platforms with path interpolators (Android, GSAP CustomEase) |
| `emphasized-linear` | Modern web browsers (Chrome 113+, Safari 17.2+) |

## Performance Considerations

1. **Single bezier** (`emphasized`): Most performant, hardware-accelerated
2. **linear()** (`emphasized-linear`): Good performance, CSS handles interpolation
3. **Custom JS** (`emphasized-path`): More overhead, but most accurate

## References

- [M3 Motion Specification](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs)
- [Material Components Android](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- [CSS linear() function](https://developer.chrome.com/docs/css-ui/css-linear-easing-function)
- [Linear Easing Generator](https://linear-easing-generator.netlify.app/)
