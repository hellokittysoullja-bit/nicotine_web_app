# Container Transform

## Overview

Container transform is an M3 transition pattern where one element appears to transform into another, maintaining spatial relationship.

## When to Use

- Card → Full detail view
- List item → Detail page
- FAB → Full-screen action
- Thumbnail → Full image

## Characteristics

| Property | Value |
|----------|-------|
| Duration | long-2 (500ms) |
| Easing | emphasized |
| Connection | Origin morphs to destination |

## Implementation

### Framer Motion (layoutId)

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// In List view
<motion.div
  layoutId={`card-${item.id}`}
  onClick={() => setSelected(item)}
  className="card"
>
  <motion.img layoutId={`image-${item.id}`} src={item.image} />
  <motion.h2 layoutId={`title-${item.id}`}>{item.title}</motion.h2>
</motion.div>

// In Detail view
<AnimatePresence>
  {selected && (
    <motion.div
      layoutId={`card-${selected.id}`}
      className="detail"
    >
      <motion.img layoutId={`image-${selected.id}`} src={selected.image} />
      <motion.h2 layoutId={`title-${selected.id}`}>{selected.title}</motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {selected.description}
      </motion.p>
    </motion.div>
  )}
</AnimatePresence>
```

### CSS (View Transitions API)

```css
.card {
  view-transition-name: card;
}

.detail {
  view-transition-name: card;
}

::view-transition-old(card),
::view-transition-new(card) {
  animation-duration: 500ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}
```

```javascript
// Trigger transition
document.startViewTransition(() => {
  updateDOM();
});
```

### GSAP (FLIP)

```javascript
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

// Get initial state
const state = Flip.getState('.card');

// Change DOM
card.classList.add('expanded');

// Animate
Flip.from(state, {
  duration: 0.5,
  ease: 'power2.inOut',
  absolute: true
});
```

## Reduced Motion Alternative

```jsx
// Replace with cross-fade
const transition = prefersReducedMotion
  ? { duration: 0.25, ease: 'easeOut' }  // Simple fade
  : { duration: 0.5, ease: [0.2, 0, 0, 1] };  // Full transform
```

## Key Considerations

1. **Shared elements** must have same layoutId
2. **Position absolute** may be needed during transition
3. **Z-index management** — expanding card should be on top
4. **Overflow handling** — container may need overflow:hidden
5. **Performance** — use will-change: transform
