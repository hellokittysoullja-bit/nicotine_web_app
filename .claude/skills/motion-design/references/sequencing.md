
# Sequencing

Orchestration patterns for coordinated multi-element animations.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| Material Design 3 | m3.material.io/styles/motion |
| Disney Principles | Staging, Follow-Through |

## Quick Reference

Load from: `tokens/sequencing.tokens.json`

### Stagger Delays

| Token | Value | Use |
|-------|-------|-----|
| `micro` | 20ms | Near-simultaneous wave |
| `tiny` | 30ms | Fast cascade |
| `small` | 50ms | List items (M3 recommended) |
| `medium` | 80ms | Readable sequence |
| `large` | 120ms | Deliberate emphasis |
| `dramatic` | 200ms | Presentation reveal |

### Overlap Ratios

| Token | Value | Effect |
|-------|-------|--------|
| `none` | 0 | Strictly sequential |
| `slight` | 0.2 | Gentle flow |
| `half` | 0.5 | Balanced cascade |
| `heavy` | 0.7 | Near-simultaneous |

## Selection Guide

```
How many elements?
│
├── 3-5 items → Use stagger.small (50ms)
│   └── Total duration: ~250-450ms
│
├── 6-10 items → Use stagger.tiny (30ms)
│   └── Total duration: ~400-600ms
│
└── 10+ items → Use stagger.micro (20ms)
    └── Cap total at 800ms max

What pattern?
│
├── LIST → Linear stagger, forward order
│
├── GRID → Row-first, column-first, or diagonal
│
├── RADIAL → Center-out or edges-in
│
└── RANDOM → Shuffle order for organic feel
```

## Patterns

### List Stagger Entrance

Sequential entrance for list items.

**CSS (custom properties):**
```css
.list-item {
  opacity: 0;
  transform: translateY(16px);
  animation: slideIn 300ms ease-out forwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
.list-item:nth-child(4) { animation-delay: 150ms; }
.list-item:nth-child(5) { animation-delay: 200ms; }

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dynamic with CSS custom properties */
.list-item {
  animation-delay: calc(var(--index) * 50ms); /* {motion.sequencing.stagger.small} */
}
```

**Framer Motion:**
```tsx
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05, // 50ms {motion.sequencing.stagger.small}
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.05, 0.7, 0.1, 1] }
  }
};

<motion.ul variants={containerVariants} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.li key={i} variants={itemVariants}>
      {item}
    </motion.li>
  ))}
</motion.ul>
```

**GSAP:**
```javascript
gsap.from('.list-item', {
  y: 16,
  opacity: 0,
  duration: 0.3,
  stagger: 0.05, // {motion.sequencing.stagger.small}
  ease: 'power2.out'
});
```

### Grid Stagger (Diagonal)

Diagonal wave across grid elements.

**GSAP:**
```javascript
const grid = document.querySelectorAll('.grid-item');
const columns = 4;

gsap.from(grid, {
  scale: 0,
  opacity: 0,
  duration: 0.4,
  stagger: {
    each: 0.05,
    grid: [Math.ceil(grid.length / columns), columns],
    from: 'start', // or 'center', 'end', 'edges'
    axis: null // null for diagonal, 'x' for rows, 'y' for columns
  },
  ease: 'back.out(1.7)'
});
```

**Framer Motion:**
```tsx
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: 1,
      delayChildren: 0.1
    }
  }
};

// Calculate diagonal delay
function getDiagonalDelay(row: number, col: number) {
  return (row + col) * 0.05;
}

<motion.div className="grid" variants={gridVariants}>
  {items.map((item, i) => {
    const row = Math.floor(i / columns);
    const col = i % columns;
    return (
      <motion.div
        key={i}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: getDiagonalDelay(row, col) }}
      />
    );
  })}
</motion.div>
```

### Center-Out Ripple

Elements animate from center outward.

**GSAP:**
```javascript
gsap.from('.grid-item', {
  scale: 0,
  opacity: 0,
  duration: 0.5,
  stagger: {
    each: 0.03,
    from: 'center',
    grid: 'auto',
    ease: 'power2.out'
  }
});
```

**Custom Implementation:**
```javascript
function centerOutStagger(elements, container) {
  const containerRect = container.getBoundingClientRect();
  const centerX = containerRect.width / 2;
  const centerY = containerRect.height / 2;

  const sorted = [...elements].sort((a, b) => {
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();

    const aDist = Math.hypot(
      aRect.left + aRect.width/2 - containerRect.left - centerX,
      aRect.top + aRect.height/2 - containerRect.top - centerY
    );
    const bDist = Math.hypot(
      bRect.left + bRect.width/2 - containerRect.left - centerX,
      bRect.top + bRect.height/2 - containerRect.top - centerY
    );

    return aDist - bDist;
  });

  return sorted;
}
```

### Timeline Orchestration

Complex multi-step animation sequence.

**GSAP Timeline:**
```javascript
const tl = gsap.timeline();

tl.from('.hero-title', {
  y: 50,
  opacity: 0,
  duration: 0.6,
  ease: 'power2.out'
})
.from('.hero-subtitle', {
  y: 30,
  opacity: 0,
  duration: 0.4,
  ease: 'power2.out'
}, '-=0.3') // overlap 0.3s
.from('.hero-cta', {
  scale: 0.8,
  opacity: 0,
  duration: 0.3,
  ease: 'back.out(1.7)'
}, '-=0.2')
.from('.hero-image', {
  x: 100,
  opacity: 0,
  duration: 0.6,
  ease: 'power2.out'
}, '-=0.4');
```

**Framer Motion (AnimatePresence + stagger):**
```tsx
const sequence = [
  { id: 'title', delay: 0 },
  { id: 'subtitle', delay: 0.2 },
  { id: 'cta', delay: 0.4 },
  { id: 'image', delay: 0.3 }
];

function Hero() {
  return (
    <>
      <motion.h1
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0, duration: 0.6 }}
      />
      <motion.p
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      />
      {/* ... */}
    </>
  );
}
```

### Cascade with Overlap

Elements start before previous finishes.

**GSAP with Overlap:**
```javascript
const duration = 0.4;
const overlap = 0.5; // {motion.sequencing.overlap.half}
const stagger = duration * (1 - overlap); // 0.2s

gsap.from('.item', {
  y: 20,
  opacity: 0,
  duration: duration,
  stagger: stagger,
  ease: 'power2.out'
});
```

**Framer Motion:**
```tsx
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.08, // duration * (1 - overlap)
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 }
  }
};
```

### Stagger with Item Count Limit

Cap total stagger duration for large lists.

```javascript
function calculateStagger(itemCount, maxDuration = 800) {
  const baseStagger = 50; // ms
  const maxItems = maxDuration / baseStagger; // 16 items

  if (itemCount <= maxItems) {
    return baseStagger;
  }

  // Reduce stagger for large lists
  return maxDuration / itemCount;
}

// Usage
const items = document.querySelectorAll('.item');
const stagger = calculateStagger(items.length);

gsap.from(items, {
  opacity: 0,
  stagger: stagger / 1000 // Convert to seconds
});
```

### Reverse Stagger (Exit)

Exit animation in reverse order.

**GSAP:**
```javascript
// Entrance
gsap.from('.item', {
  opacity: 0,
  stagger: 0.05
});

// Exit (reverse)
gsap.to('.item', {
  opacity: 0,
  stagger: {
    each: 0.03,
    from: 'end' // Start from last item
  }
});
```

**Framer Motion:**
```tsx
const exitVariants = {
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1 // Reverse order
    }
  }
};
```

## Stagger Calculation Guidelines

| Items | Stagger | Total Duration |
|-------|---------|----------------|
| 3 | 80ms | ~240ms |
| 5 | 50ms | ~250ms |
| 8 | 40ms | ~320ms |
| 12 | 30ms | ~360ms |
| 20 | 20ms | ~400ms |
| 50 | 15ms | ~750ms (cap here) |

**Formula for capped stagger:**
```javascript
const stagger = Math.min(baseStagger, maxDuration / itemCount);
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Staggered entrance | Simultaneous fade-in |
| Wave/ripple effects | Instant appearance |
| Complex timelines | Single fade transition |

**Implementation:**
```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

gsap.from('.item', {
  opacity: 0,
  stagger: prefersReducedMotion ? 0 : 0.05,
  duration: prefersReducedMotion ? 0.15 : 0.3
});
```

```tsx
// Framer Motion
const staggerAmount = prefersReducedMotion ? 0 : 0.05;

const containerVariants = {
  visible: {
    transition: {
      staggerChildren: staggerAmount
    }
  }
};
```

## Cross-References

- See `entrance-patterns/` for staggered entrance animations
- See `exit-patterns/` for staggered exit animations
- See `scroll-animations/` for scroll-triggered sequences
- See `duration/` for individual animation timing
- See `easing/` for cascade timing curves
- See `motion-principles/` for staging and follow-through

## References

- `sequencing/stagger-algorithms.md` — Stagger calculation deep dive
