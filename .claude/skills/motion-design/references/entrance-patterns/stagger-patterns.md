# Stagger Patterns

## Overview

Stagger creates sequential entrance of multiple elements, adding polish and guiding attention.

## Basic Stagger

### Recommended Intervals

| Item Count | Stagger Delay | Total Duration |
|------------|---------------|----------------|
| 3-5 items | 50ms | ~400ms |
| 6-10 items | 40ms | ~600ms |
| 10-15 items | 30ms | ~700ms |
| 15+ items | 25ms | Cap at ~800ms |

### Golden Rule
Total stagger duration should not exceed **800ms**. Users shouldn't wait for lists.

## Implementation

### Framer Motion

```jsx
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
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

<motion.ul
  variants={containerVariants}
  initial="hidden"
  animate="show"
>
  {items.map(item => (
    <motion.li key={item.id} variants={itemVariants}>
      {item.content}
    </motion.li>
  ))}
</motion.ul>
```

### GSAP

```javascript
gsap.from('.item', {
  opacity: 0,
  y: 16,
  duration: 0.25,
  ease: 'power2.out',
  stagger: {
    each: 0.05,
    from: 'start'
  }
});
```

### CSS (with custom properties)

```css
.item {
  opacity: 0;
  transform: translateY(16px);
  animation: fadeIn 250ms cubic-bezier(0.05, 0.7, 0.1, 1) forwards;
  animation-delay: calc(var(--index) * 50ms);
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

```jsx
{items.map((item, i) => (
  <div className="item" style={{ '--index': i }}>
    {item}
  </div>
))}
```

## Direction Patterns

### From Start (Default)
First item animates first.
```javascript
stagger: { from: 'start' }
```

### From End
Last item animates first.
```javascript
stagger: { from: 'end' }
```

### From Center
Center items animate first, rippling outward.
```javascript
stagger: { from: 'center' }
```

### From Edges
Edge items animate first, meeting in center.
```javascript
stagger: { from: 'edges' }
```

### Random
Random order.
```javascript
stagger: { from: 'random' }
```

## Grid Stagger

```javascript
// GSAP
gsap.from('.grid-item', {
  opacity: 0,
  scale: 0.9,
  stagger: {
    each: 0.03,
    grid: [rows, cols],
    from: 'start'  // or 'center', 'edges'
  }
});

// Framer Motion
const gridVariants = {
  show: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0
    }
  }
};
```

## Adaptive Stagger

Adjust based on item count:

```javascript
const getStaggerDelay = (itemCount) => {
  const maxTotalDuration = 0.8; // 800ms
  const minDelay = 0.025; // 25ms
  const maxDelay = 0.05; // 50ms

  const calculatedDelay = maxTotalDuration / itemCount;
  return Math.max(minDelay, Math.min(maxDelay, calculatedDelay));
};
```

## Reduced Motion

```javascript
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: prefersReduced ? 0 : 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: prefersReduced ? 0 : 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: prefersReduced ? 0.1 : 0.25
    }
  }
};
```

## Common Mistakes

1. **Too slow stagger** — Users waiting is bad UX
2. **Too uniform** — Feels mechanical
3. **Too many items** — Cap or virtualize
4. **Wrong direction** — Should follow reading order
5. **No reduced motion** — Must provide alternative
