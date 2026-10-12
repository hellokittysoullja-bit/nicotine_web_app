
# Entrance Patterns

Patterns for elements entering the viewport.

## Core Principle

Elements entering should use:
- **Easing**: `emphasized-decelerate` (0.05, 0.7, 0.1, 1)
- **Duration**: Based on element size (short-3 to medium-2)

## Basic Entrance

### Fade In
```css
.fade-in {
  animation: fadeIn 250ms cubic-bezier(0.05, 0.7, 0.1, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

### Slide Up + Fade
```css
.slide-up {
  animation: slideUp 250ms cubic-bezier(0.05, 0.7, 0.1, 1) forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Scale + Fade
```css
.scale-in {
  animation: scaleIn 250ms cubic-bezier(0.05, 0.7, 0.1, 1) forwards;
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

## Stagger Patterns

### Sequential Stagger
Elements enter one after another.

```javascript
// Framer Motion
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05 // 50ms between children
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.05, 0.7, 0.1, 1]
    }
  }
};
```

### Recommended Stagger Intervals

| Item Count | Stagger Delay | Total Duration |
|------------|---------------|----------------|
| 3-5 items | 50ms | ~450ms |
| 6-10 items | 40ms | ~600ms |
| 10+ items | 30ms | Cap at ~800ms |

### Best Practices

1. **Cap total duration** — Don't exceed 800ms for full list
2. **Start fast** — First items appear quickly
3. **Reduce for many items** — Tighter stagger for long lists
4. **Direction matters** — Stagger from logical origin

## Direction-Based Entrances

### From Origin
Elements enter from their creation point.

```jsx
// Card created from FAB - entrance from FAB position
<motion.div
  initial={{ scale: 0, originX: 0.9, originY: 0.9 }}
  animate={{ scale: 1 }}
  transition={{ duration: 0.3, ease: [0.05, 0.7, 0.1, 1] }}
/>
```

### Reading Order
For content, follow reading direction (LTR: left to right, top to bottom).

```javascript
const staggerFromTopLeft = {
  staggerChildren: 0.05,
  staggerDirection: 1 // forward order
};
```

## Reduced Motion Alternative

```javascript
const getEntranceVariant = (prefersReducedMotion) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    y: prefersReducedMotion ? 0 : 16,
    transition: {
      duration: prefersReducedMotion ? 0.1 : 0.25
    }
  }
});
```

See `entrance-patterns/stagger-patterns.md` for advanced stagger techniques.
