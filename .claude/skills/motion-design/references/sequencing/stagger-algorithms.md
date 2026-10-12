# Stagger Algorithms Reference

Detailed algorithms for stagger timing and distribution.

## Basic Stagger Calculation

### Linear Distribution

Equal delay between all elements.

```javascript
function linearStagger(itemCount, delay) {
  return Array.from({ length: itemCount }, (_, i) => i * delay);
}

// Example: 5 items, 50ms delay
// [0, 50, 100, 150, 200]
```

### Capped Duration

Prevent excessively long sequences.

```javascript
function cappedStagger(itemCount, baseDelay, maxDuration) {
  const effectiveDelay = Math.min(baseDelay, maxDuration / (itemCount - 1));
  return Array.from({ length: itemCount }, (_, i) => i * effectiveDelay);
}

// Example: 20 items, 50ms base, 500ms max
// Effective delay: min(50, 500/19) = 26.3ms
```

## Eased Stagger Distribution

### Ease-Out Distribution

Starts fast, slows down.

```javascript
function easeOutStagger(itemCount, totalDuration) {
  return Array.from({ length: itemCount }, (_, i) => {
    const t = i / (itemCount - 1);
    const eased = 1 - Math.pow(1 - t, 2); // Quadratic ease-out
    return eased * totalDuration;
  });
}

// Example: 5 items, 400ms total
// [0, 180, 300, 360, 400] (approximate)
```

### Ease-In Distribution

Starts slow, speeds up.

```javascript
function easeInStagger(itemCount, totalDuration) {
  return Array.from({ length: itemCount }, (_, i) => {
    const t = i / (itemCount - 1);
    const eased = Math.pow(t, 2); // Quadratic ease-in
    return eased * totalDuration;
  });
}

// Example: 5 items, 400ms total
// [0, 40, 100, 220, 400] (approximate)
```

### Custom Cubic Bezier

```javascript
function cubicBezierValue(t, p1, p2) {
  // Simplified cubic bezier for timing
  const cx = 3 * p1;
  const bx = 3 * (p2 - p1) - cx;
  const ax = 1 - cx - bx;
  return ((ax * t + bx) * t + cx) * t;
}

function customBezierStagger(itemCount, totalDuration, p1 = 0.4, p2 = 0.8) {
  return Array.from({ length: itemCount }, (_, i) => {
    const t = i / (itemCount - 1);
    const eased = cubicBezierValue(t, p1, p2);
    return eased * totalDuration;
  });
}
```

## Spatial Stagger Patterns

### Distance-Based (Radial)

Stagger based on distance from origin point.

```javascript
function radialStagger(elements, origin, baseDelay) {
  const distances = elements.map(el => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    return Math.hypot(centerX - origin.x, centerY - origin.y);
  });

  const maxDistance = Math.max(...distances);

  return distances.map(d => (d / maxDistance) * baseDelay * (elements.length - 1));
}

// Usage
const origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const delays = radialStagger(elements, origin, 50);
```

### Grid-Based

Stagger for grid layouts.

```javascript
function gridStagger(rows, cols, delay, pattern = 'diagonal') {
  const delays = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c;

      switch (pattern) {
        case 'row':
          delays[index] = r * delay;
          break;
        case 'column':
          delays[index] = c * delay;
          break;
        case 'diagonal':
          delays[index] = (r + c) * delay;
          break;
        case 'reverse-diagonal':
          delays[index] = (r + (cols - 1 - c)) * delay;
          break;
        case 'spiral':
          delays[index] = spiralIndex(r, c, rows, cols) * delay;
          break;
      }
    }
  }

  return delays;
}

// Spiral helper
function spiralIndex(row, col, rows, cols) {
  // Calculate distance from edge in spiral pattern
  const top = row;
  const bottom = rows - 1 - row;
  const left = col;
  const right = cols - 1 - col;
  const layer = Math.min(top, bottom, left, right);

  // ... complex spiral calculation
  return layer * 2 + (row + col - layer * 2);
}
```

## Overlap Calculations

### Fixed Overlap

Previous animation still running when next starts.

```javascript
function overlapStagger(itemCount, duration, overlap) {
  const effectiveDelay = duration * (1 - overlap);
  return Array.from({ length: itemCount }, (_, i) => i * effectiveDelay);
}

// Example: 5 items, 300ms duration, 0.5 overlap
// Delay: 300 * 0.5 = 150ms
// [0, 150, 300, 450, 600]
```

### Dynamic Overlap

More overlap for longer sequences.

```javascript
function dynamicOverlapStagger(itemCount, duration, maxTotalDuration) {
  // Calculate overlap needed to fit in max duration
  const totalWithoutOverlap = itemCount * duration;
  const requiredOverlap = Math.max(0,
    1 - (maxTotalDuration / totalWithoutOverlap)
  );

  const effectiveDelay = duration * (1 - requiredOverlap);
  return Array.from({ length: itemCount }, (_, i) => i * effectiveDelay);
}
```

## Random Stagger

### Shuffled Order

```javascript
function shuffledStagger(itemCount, delay) {
  const indices = Array.from({ length: itemCount }, (_, i) => i);

  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  const delays = new Array(itemCount);
  indices.forEach((originalIndex, newPosition) => {
    delays[originalIndex] = newPosition * delay;
  });

  return delays;
}
```

### Random with Bounds

```javascript
function randomBoundedStagger(itemCount, minDelay, maxDelay) {
  return Array.from({ length: itemCount }, () =>
    minDelay + Math.random() * (maxDelay - minDelay)
  ).sort((a, b) => a - b); // Sort to maintain rough order
}
```

## GSAP Stagger Options

GSAP's stagger object supports many patterns:

```javascript
gsap.from('.items', {
  y: 50,
  stagger: {
    // Amount between each element
    each: 0.1, // OR amount: 0.5 (total spread)

    // Direction
    from: 'start', // 'end', 'center', 'edges', 'random', or index

    // Grid layout
    grid: [rows, cols], // or 'auto'
    axis: 'x', // 'y', or null (diagonal)

    // Easing the distribution
    ease: 'power2.in',

    // Repeat pattern
    repeat: -1,
    yoyo: true
  }
});
```

## Framer Motion Variants

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.1,      // Initial delay
      staggerChildren: 0.05,   // Between each child
      staggerDirection: 1,     // 1 = forward, -1 = reverse
      when: "beforeChildren"   // or "afterChildren"
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 }
  }
};
```

## Performance Considerations

1. **Pre-calculate delays** instead of computing during animation
2. **Use transforms only** (opacity, transform) for staggered items
3. **Limit concurrent animations** — stagger large lists in chunks
4. **Consider virtualization** for very long lists
5. **Use `will-change`** on animating elements

```javascript
// Chunk large lists
function staggerInChunks(items, chunkSize = 20, chunkDelay = 300) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = Array.from(items).slice(i, i + chunkSize);
    const chunkOffset = Math.floor(i / chunkSize) * chunkDelay;

    gsap.from(chunk, {
      opacity: 0,
      y: 20,
      stagger: 0.02,
      delay: chunkOffset / 1000,
      duration: 0.3
    });
  }
}
```

## Accessibility Implementation

```javascript
function accessibleStagger(items, normalDelay) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Instant, simultaneous appearance
    gsap.set(items, { opacity: 1 });
    return;
  }

  gsap.from(items, {
    opacity: 0,
    stagger: normalDelay
  });
}
```
