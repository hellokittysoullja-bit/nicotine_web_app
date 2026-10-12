# Fade Through Transition

## Overview

Fade through is used when transitioning between content that doesn't have a strong spatial or sequential relationship.

## When to Use

- Tab content (unrelated tabs)
- Image carousel (no sequence)
- Content replacement
- Search results update

## Token Values

| Property | Value |
|----------|-------|
| Duration | medium-2 (300ms) |
| Easing | standard |

## Timing Pattern

```
Outgoing: Fade out (0 → 150ms)
Incoming: Fade in (150ms → 300ms)
```

The outgoing element fully exits before incoming enters.

## Implementation

### CSS

```css
.fade-through-exit {
  animation: fadeOut 150ms cubic-bezier(0.2, 0, 0, 1) forwards;
}

.fade-through-enter {
  animation: fadeIn 150ms cubic-bezier(0.2, 0, 0, 1) 150ms forwards;
  opacity: 0;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Framer Motion

```jsx
import { motion, AnimatePresence } from 'framer-motion';

const fadeThrough = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 }
};

<AnimatePresence mode="wait">
  <motion.div
    key={currentTab}
    initial="initial"
    animate="animate"
    exit="exit"
    variants={fadeThrough}
    transition={{ duration: 0.15, ease: [0.2, 0, 0, 1] }}
  >
    <TabContent />
  </motion.div>
</AnimatePresence>
```

### GSAP

```javascript
const fadeThrough = async (outEl, inEl) => {
  // Fade out
  await gsap.to(outEl, {
    opacity: 0,
    duration: 0.15,
    ease: 'power2.out'
  });

  // Swap visibility
  outEl.style.display = 'none';
  inEl.style.display = 'block';
  inEl.style.opacity = 0;

  // Fade in
  await gsap.to(inEl, {
    opacity: 1,
    duration: 0.15,
    ease: 'power2.out'
  });
};
```

## With Scale (Enhanced)

For more visual interest, add subtle scale:

```jsx
const fadeThrough = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 }
};
```

## Cross-Fade Variant

When slight overlap is acceptable:

```jsx
<AnimatePresence mode="popLayout">
  <motion.div
    key={content}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
  />
</AnimatePresence>
```

## Reduced Motion Alternative

Fade through is already accessibility-friendly (no spatial movement). For extra reduced motion:

```jsx
const transition = prefersReduced
  ? { duration: 0.1 }
  : { duration: 0.15, ease: [0.2, 0, 0, 1] };
```

## When NOT to Use

- Sequential navigation (use shared axis)
- Expanding elements (use container transform)
- Related content (use shared axis)
- Same-element state change (no transition needed)
