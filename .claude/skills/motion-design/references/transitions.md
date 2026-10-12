
# Transition Patterns

M3-based transition patterns for navigation and state changes.

## Standards Reference

| Pattern | Documentation |
|---------|---------------|
| Container Transform | m3.material.io/styles/motion/transitions/transition-patterns |
| Shared Axis | m3.material.io/styles/motion/transitions/transition-patterns |
| Fade Through | m3.material.io/styles/motion/transitions/transition-patterns |

## Pattern Overview

| Pattern | Use Case | Duration |
|---------|----------|----------|
| Container Transform | Card → Detail view | long-2 (500ms) |
| Shared Axis | Sequential navigation | medium-4 (400ms) |
| Fade Through | Unrelated content swap | medium-2 (300ms) |

## Container Transform

Use when an element transforms into a full view (card → detail).

### Characteristics
- Origin element morphs into destination
- Maintains spatial relationship
- Creates strong visual connection

### Token
```json
{
  "duration": "{motion.duration.long-2}",
  "easing": "{motion.easing.emphasized}"
}
```

### Implementation (Framer Motion)
```jsx
<motion.div
  layoutId="card-1"
  transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
>
  {isExpanded ? <DetailView /> : <CardView />}
</motion.div>
```

## Shared Axis

Use for sequential navigation (wizard steps, tabs).

### Characteristics
- Elements move along X, Y, or Z axis
- Outgoing fades out while moving
- Incoming fades in while moving

### Variants
- **X-axis**: Horizontal navigation (tabs)
- **Y-axis**: Vertical navigation (lists)
- **Z-axis**: Depth changes (dialogs)

### Token
```json
{
  "duration": "{motion.duration.medium-4}",
  "easing": "{motion.easing.emphasized}"
}
```

### Implementation (Framer Motion)
```jsx
const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0
  })
};

<AnimatePresence custom={direction}>
  <motion.div
    key={page}
    custom={direction}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
  />
</AnimatePresence>
```

## Fade Through

Use for unrelated content with no spatial relationship.

### Characteristics
- Outgoing fades out completely
- Incoming fades in
- Brief overlap or sequential

### Token
```json
{
  "duration": "{motion.duration.medium-2}",
  "easing": "{motion.easing.standard}"
}
```

### Implementation (CSS)
```css
.fade-through-exit {
  animation: fadeOut 150ms cubic-bezier(0.2, 0, 0, 1) forwards;
}
.fade-through-enter {
  animation: fadeIn 150ms cubic-bezier(0.2, 0, 0, 1) 150ms forwards;
}

@keyframes fadeOut {
  to { opacity: 0; }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

## Decision Guide

```
Is there a persistent element that transforms?
  → Container Transform

Is navigation sequential (steps, tabs)?
  → Shared Axis

Are views unrelated?
  → Fade Through
```

## Web vs Video Transitions

**CRITICAL:** Web and video transitions have different timing needs.

| Context | Duration | Reason |
|---------|----------|--------|
| **Web** | 200-400ms | User waits for response feedback |
| **Video** | 100-200ms | Viewer expects quick pacing |

### Video-Specific Durations

Use these tokens for video content (from `duration.tokens.json`):

| Token | Duration | Frames @30fps | Use |
|-------|----------|---------------|-----|
| `video.crossfade` | 100ms | 3 | Quick opacity blend |
| `video.dissolve` | 150ms | 5 | Scene changes |
| `video.scene-transition` | 150ms | 5 | Between scenes |
| `video.cut` | 0ms | 0 | Instant cut |
| `video.wipe` | 200ms | 6 | Directional wipe |

### Avoid Pixel Dissolve

**Never use pixel/dither dissolve for standard video transitions.** It:
- Feels dated/VHS-era
- Takes too long visually
- Distracts from content

Use simple opacity crossfade (`video.crossfade`) instead.

### Implementation (Remotion)

```typescript
import { videoTransition } from '../presets/remotion-m3';

// Quick crossfade between scenes
const opacity = interpolate(
  frame,
  [exitStart, exitStart + videoTransition.crossfade.frames(fps)],
  [1, 0],
  { extrapolateRight: 'clamp' }
);

// Or use the helper
const transitionFrames = getVideoTransitionFrames('crossfade', fps);
```

See `transitions/container-transform.md` for detailed implementation.
See `transitions/shared-axis.md` for axis variations.
See `transitions/fade-through.md` for timing patterns.
