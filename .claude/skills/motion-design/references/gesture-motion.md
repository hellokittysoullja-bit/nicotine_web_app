
# Gesture Motion Patterns

Motion that responds to user gestures with physics-based feedback. Direct manipulation should feel connected to the finger/pointer.

## Core Principles

1. **1:1 tracking during manipulation** - Element follows pointer exactly
2. **Physics on release** - Momentum, friction, snap points
3. **Resistance at boundaries** - Rubber-banding effect
4. **Clear thresholds** - When gesture triggers action

## Pattern Categories

| Pattern | Gesture | Physics |
|---------|---------|---------|
| Drag | Pointer down + move | Direct tracking, momentum on release |
| Swipe | Quick directional move | Velocity-based, snap points |
| Pull-to-refresh | Pull down past threshold | Resistance, spring back |
| Pinch-zoom | Two-finger pinch | Scale with damping |
| Rubber-band | Drag past boundary | Exponential resistance |

## Drag Physics

### Velocity Calculation

```javascript
// Track velocity over last N samples
const velocityTracker = {
  samples: [],
  maxSamples: 5,

  addSample(position, timestamp) {
    this.samples.push({ position, timestamp });
    if (this.samples.length > this.maxSamples) {
      this.samples.shift();
    }
  },

  getVelocity() {
    if (this.samples.length < 2) return { x: 0, y: 0 };

    const first = this.samples[0];
    const last = this.samples[this.samples.length - 1];
    const dt = (last.timestamp - first.timestamp) / 1000;

    return {
      x: (last.position.x - first.position.x) / dt,
      y: (last.position.y - first.position.y) / dt
    };
  }
};
```

### Momentum Decay

```javascript
function applyMomentum(element, velocity, friction = 0.95) {
  let vx = velocity.x;
  let vy = velocity.y;

  function animate() {
    vx *= friction;
    vy *= friction;

    // Continue until velocity is negligible
    if (Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}
```

## Swipe Patterns

### Swipe Detection

```javascript
const swipeConfig = {
  threshold: 50,          // Minimum distance
  velocityThreshold: 0.5, // Minimum velocity (px/ms)
  timeThreshold: 300      // Maximum time (ms)
};

function detectSwipe(start, end, duration) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const velocity = distance / duration;

  if (distance < swipeConfig.threshold ||
      velocity < swipeConfig.velocityThreshold) {
    return null;
  }

  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  if (angle >= -45 && angle < 45) return 'right';
  if (angle >= 45 && angle < 135) return 'down';
  if (angle >= -135 && angle < -45) return 'up';
  return 'left';
}
```

### Snap Points

```javascript
function snapToPoint(current, snapPoints, velocity) {
  let target;

  if (Math.abs(velocity) > 100) {
    // High velocity: snap to next point in direction
    target = velocity > 0
      ? snapPoints.find(p => p > current) || snapPoints[snapPoints.length - 1]
      : [...snapPoints].reverse().find(p => p < current) || snapPoints[0];
  } else {
    // Low velocity: snap to nearest
    target = snapPoints.reduce((nearest, point) =>
      Math.abs(point - current) < Math.abs(nearest - current) ? point : nearest
    );
  }

  return target;
}
```

## Rubber Banding

```javascript
// Exponential resistance past boundary
function rubberBand(offset, maxOffset, elasticity = 0.55) {
  if (Math.abs(offset) <= maxOffset) return offset;

  const direction = offset > 0 ? 1 : -1;
  const excess = Math.abs(offset) - maxOffset;

  // Logarithmic falloff
  const rubberBanded = maxOffset +
    (1 - (1 / ((excess * elasticity / maxOffset) + 1))) * maxOffset;

  return direction * rubberBanded;
}
```

## Implementation Presets

### CSS Snap Points

```css
/* Horizontal snap scroll */
.snap-container {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  display: flex;
}

.snap-item {
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 80%;
}
```

### Framer Motion Draggable

```tsx
// Draggable card with snap back
<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.2}
  onDragEnd={(e, info) => {
    if (Math.abs(info.velocity.x) > 500 || Math.abs(info.offset.x) > 150) {
      // Dismiss
    } else {
      // Snap back
    }
  }}
/>
```

See `references/gesture-implementations.md` for complete GSAP, Framer Motion, and Remotion examples.

## Accessibility

```javascript
// Provide keyboard alternatives for gestures
const handleKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowLeft': navigatePrev(); break;
    case 'ArrowRight': navigateNext(); break;
    case 'Delete': dismissItem(); break;
  }
};

// Announce gesture actions
<div aria-live="polite">
  {isDragging && 'Dragging item. Release to drop.'}
  {isOverThreshold && 'Release to dismiss.'}
</div>
```

## Common Mistakes

1. **Not tracking velocity** - Momentum needs velocity, not just position
2. **Hard boundaries** - Use rubber-banding for natural feel
3. **Same physics for all gestures** - Light swipe != heavy drag
4. **Ignoring inertia** - Objects don't stop instantly
5. **No snap affordance** - Visual hint where items will snap

## Related Skills

- `animation-recipes` - Pre-built gesture animation recipes
- `accessibility` - Keyboard alternatives for gestures
- `easing` - Spring physics for gesture animations
