
# Container Transform

The premium Google M3 transition pattern. Use when one UI element transforms into another.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| Material Design 3 | m3.material.io/styles/motion/transitions/transition-patterns |
| Container Transform | Android Developers - Material Motion |

## When to Use

- Card → Detail page
- FAB → Full dialog
- List item → Full screen
- Thumbnail → Gallery
- Chip → Expanded card

## Timing Breakdown (300ms total)

| Component | Start | End | Duration | Easing |
|-----------|-------|-----|----------|--------|
| Container bounds | 0ms | 300ms | 300ms | emphasized (0.2, 0, 0, 1) |
| Old content fade | 0ms | 100ms | 100ms | linear |
| New content fade | 100ms | 300ms | 200ms | linear |
| Scrim (optional) | 0ms | 150ms | 150ms | linear |
| Arc path (if needed) | 0ms | 300ms | 300ms | emphasized |

## Arc Path Rule

**Use arc motion when aspect ratio changes by >10%**

```javascript
const startAspect = startWidth / startHeight;
const endAspect = endWidth / endHeight;
const needsArc = Math.abs(startAspect - endAspect) / startAspect > 0.1;
```

Load threshold from: `tokens/position.tokens.json` → `motion.position.arc-threshold`

## Token References

```json
{
  "duration": "{motion.duration.medium-2}",
  "easing": "{motion.easing.emphasized}",
  "arc-threshold": "{motion.position.arc-threshold}",
  "scrim-opacity": "{motion.scrim.opacity.standard}"
}
```

## Implementation

### Remotion

```tsx
import { interpolate, useCurrentFrame, Easing } from 'remotion';

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
}

export const ContainerTransform: React.FC<{
  startBounds: Bounds;
  endBounds: Bounds;
  startContent: React.ReactNode;
  endContent: React.ReactNode;
  fps?: number;
}> = ({ startBounds, endBounds, startContent, endContent, fps = 30 }) => {
  const frame = useCurrentFrame();
  const totalFrames = Math.round((300 / 1000) * fps); // 300ms
  const progress = frame / totalFrames;

  const emphasized = Easing.bezier(0.2, 0, 0, 1);

  // Container bounds (emphasized easing)
  const x = interpolate(progress, [0, 1], [startBounds.x, endBounds.x], {
    easing: emphasized,
    extrapolateRight: 'clamp',
  });
  const y = interpolate(progress, [0, 1], [startBounds.y, endBounds.y], {
    easing: emphasized,
    extrapolateRight: 'clamp',
  });
  const width = interpolate(progress, [0, 1], [startBounds.width, endBounds.width], {
    easing: emphasized,
    extrapolateRight: 'clamp',
  });
  const height = interpolate(progress, [0, 1], [startBounds.height, endBounds.height], {
    easing: emphasized,
    extrapolateRight: 'clamp',
  });

  // Arc offset for disproportionate morph (10% threshold)
  const startAspect = startBounds.width / startBounds.height;
  const endAspect = endBounds.width / endBounds.height;
  const needsArc = Math.abs(startAspect - endAspect) / startAspect > 0.1;
  const arcOffset = needsArc
    ? interpolate(progress, [0, 0.5, 1], [0, -50, 0], { easing: emphasized })
    : 0;

  // Content cross-fade (linear, nested timing)
  const oldOpacity = interpolate(progress, [0, 0.33], [1, 0], {
    extrapolateRight: 'clamp',
  });
  const newOpacity = interpolate(progress, [0.33, 1], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  const borderRadius = interpolate(
    progress,
    [0, 1],
    [startBounds.radius || 0, endBounds.radius || 0],
    { easing: emphasized }
  );

  return (
    <div style={{
      position: 'absolute',
      left: x,
      top: y + arcOffset,
      width,
      height,
      overflow: 'hidden',
      borderRadius,
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: oldOpacity }}>
        {startContent}
      </div>
      <div style={{ position: 'absolute', inset: 0, opacity: newOpacity }}>
        {endContent}
      </div>
    </div>
  );
};
```

### GSAP

```javascript
import gsap from 'gsap';

function containerTransform(startEl, endEl, options = {}) {
  const duration = options.duration || 0.3;
  const tl = gsap.timeline();

  const startRect = startEl.getBoundingClientRect();
  const endRect = endEl.getBoundingClientRect();

  // Check if arc needed (10% threshold)
  const startAspect = startRect.width / startRect.height;
  const endAspect = endRect.width / endRect.height;
  const needsArc = Math.abs(startAspect - endAspect) / startAspect > 0.1;

  // Create morph container
  const container = document.createElement('div');
  container.className = 'container-transform';
  container.style.cssText = `
    position: fixed;
    left: ${startRect.left}px;
    top: ${startRect.top}px;
    width: ${startRect.width}px;
    height: ${startRect.height}px;
    overflow: hidden;
    z-index: 9999;
  `;

  // Clone contents
  const startClone = startEl.cloneNode(true);
  const endClone = endEl.cloneNode(true);
  container.appendChild(startClone);
  container.appendChild(endClone);
  gsap.set(endClone, { position: 'absolute', inset: 0, opacity: 0 });
  gsap.set(startClone, { position: 'absolute', inset: 0 });

  document.body.appendChild(container);
  gsap.set([startEl, endEl], { visibility: 'hidden' });

  // Container morph (emphasized easing)
  tl.to(container, {
    left: endRect.left,
    top: endRect.top,
    width: endRect.width,
    height: endRect.height,
    duration,
    ease: 'power2.out',
  }, 0);

  // Arc path if needed
  if (needsArc) {
    tl.to(container, { y: -50, duration: duration / 2, ease: 'power2.out' }, 0);
    tl.to(container, { y: 0, duration: duration / 2, ease: 'power2.in' }, duration / 2);
  }

  // Content cross-fade (linear, nested timing)
  tl.to(startClone, { opacity: 0, duration: duration * 0.33, ease: 'none' }, 0);
  tl.to(endClone, { opacity: 1, duration: duration * 0.67, ease: 'none' }, duration * 0.33);

  // Cleanup
  tl.call(() => {
    gsap.set(endEl, { visibility: 'visible' });
    container.remove();
  });

  return tl;
}
```

### Framer Motion

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Use layoutId for automatic container transform
<motion.div layoutId="card-1">
  {isExpanded ? <DetailView /> : <CardView />}
</motion.div>
```

## Accessibility

```javascript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Instant swap, no animation
  startEl.style.display = 'none';
  endEl.style.display = 'block';
} else {
  containerTransform(startEl, endEl);
}
```

See `container-transform/timing-breakdown.md` for frame-by-frame details.
