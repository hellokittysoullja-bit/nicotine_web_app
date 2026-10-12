# Shared Axis Transition

## Overview

Shared axis transitions are used for sequential navigation where content shares a spatial relationship along X, Y, or Z axis.

## Axis Types

| Axis | Use Case | Example |
|------|----------|---------|
| X (horizontal) | Tabs, pagination | Next/previous |
| Y (vertical) | Lists, steppers | Up/down navigation |
| Z (depth) | Dialogs, overlays | Forward/back |

## Token Values

| Property | Value |
|----------|-------|
| Duration | medium-4 (400ms) |
| Easing | emphasized |

## X-Axis (Horizontal)

### Use Cases
- Tab navigation
- Carousel/slideshow
- Step wizard

### Implementation (Framer Motion)

```jsx
import { motion, AnimatePresence } from 'framer-motion';

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0
  })
};

const [page, setPage] = useState(0);
const [direction, setDirection] = useState(0);

<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={page}
    custom={direction}
    variants={variants}
    initial="enter"
    animate="center"
    exit="exit"
    transition={{
      duration: 0.4,
      ease: [0.2, 0, 0, 1]
    }}
  >
    <PageContent page={page} />
  </motion.div>
</AnimatePresence>
```

## Y-Axis (Vertical)

### Use Cases
- List drill-down
- Vertical stepper
- Accordion deep navigation

### Implementation

```jsx
const yAxisVariants = {
  enter: (direction) => ({
    y: direction > 0 ? 50 : -50,
    opacity: 0
  }),
  center: {
    y: 0,
    opacity: 1
  },
  exit: (direction) => ({
    y: direction < 0 ? 50 : -50,
    opacity: 0
  })
};
```

## Z-Axis (Depth)

### Use Cases
- Dialog opening
- Navigation stack (mobile)
- Overlay appearance

### Implementation

```jsx
const zAxisVariants = {
  enter: {
    scale: 0.95,
    opacity: 0
  },
  center: {
    scale: 1,
    opacity: 1
  },
  exit: {
    scale: 1.05,
    opacity: 0
  }
};

// Dialog example
<AnimatePresence>
  {isOpen && (
    <>
      <motion.div
        className="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className="dialog"
        variants={zAxisVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      />
    </>
  )}
</AnimatePresence>
```

## Reduced Motion Alternative

```jsx
const getVariants = (prefersReduced) => ({
  enter: {
    opacity: 0,
    x: prefersReduced ? 0 : 100
  },
  center: {
    opacity: 1,
    x: 0
  },
  exit: {
    opacity: 0,
    x: prefersReduced ? 0 : -100
  }
});

const transition = prefersReduced
  ? { duration: 0.15 }
  : { duration: 0.4, ease: [0.2, 0, 0, 1] };
```

## Direction Detection

```javascript
// Based on navigation
const direction = newPage > currentPage ? 1 : -1;

// Based on user action
const handleNext = () => {
  setDirection(1);
  setPage(page + 1);
};

const handlePrev = () => {
  setDirection(-1);
  setPage(page - 1);
};
```
