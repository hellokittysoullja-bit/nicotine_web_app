
# Exit Patterns

Patterns for elements leaving the viewport.

## Core Principle

Elements exiting should use:
- **Easing**: `emphasized-accelerate` (0.3, 0, 0.8, 0.15)
- **Duration**: Shorter than entrance (short-3 to short-4)
- **Faster than entrance** — Don't make users wait

## Basic Exit

### Fade Out
```css
.fade-out {
  animation: fadeOut 200ms cubic-bezier(0.3, 0, 0.8, 0.15) forwards;
}

@keyframes fadeOut {
  to { opacity: 0; }
}
```

### Slide Down + Fade
```css
.slide-down {
  animation: slideDown 200ms cubic-bezier(0.3, 0, 0.8, 0.15) forwards;
}

@keyframes slideDown {
  to {
    opacity: 0;
    transform: translateY(16px);
  }
}
```

### Scale Out + Fade
```css
.scale-out {
  animation: scaleOut 200ms cubic-bezier(0.3, 0, 0.8, 0.15) forwards;
}

@keyframes scaleOut {
  to {
    opacity: 0;
    transform: scale(0.95);
  }
}
```

## Exit Direction

### Exit Toward Destination
Elements should exit toward where they're going.

```jsx
// Dismiss to trash — exit toward trash icon
<motion.div
  exit={{ x: trashPosition.x, opacity: 0 }}
  transition={{ duration: 0.2, ease: [0.3, 0, 0.8, 0.15] }}
/>
```

### Exit Opposite of Entrance
If element entered from left, exit to left (or opposite).

## Gesture-Based Exit

### Swipe to Dismiss
```jsx
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

<motion.div
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    if (swipePower(offset.x, velocity.x) > swipeConfidenceThreshold) {
      onDismiss();
    }
  }}
  exit={{ x: 300, opacity: 0 }}
  transition={{ duration: 0.2, ease: [0.3, 0, 0.8, 0.15] }}
/>
```

## Duration Guidelines

| Exit Type | Duration | Easing |
|-----------|----------|--------|
| Quick dismiss | 150ms | emphasized-accelerate |
| Standard exit | 200ms | emphasized-accelerate |
| Modal close | 200ms | emphasized-accelerate |
| Page exit | 300ms | emphasized-accelerate |

## Exit vs Entrance Timing

Exits should be **faster** than entrances:
- Entrance: medium-1 (250ms)
- Exit: short-4 (200ms)

This ratio (~80%) feels natural — users don't want to wait for dismissals.

## Staggered Exit

When multiple items exit:

```javascript
const containerExit = {
  exit: {
    transition: {
      staggerChildren: 0.03, // Faster stagger than entrance
      staggerDirection: -1   // Reverse order often feels better
    }
  }
};

const itemExit = {
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: [0.3, 0, 0.8, 0.15]
    }
  }
};
```

## Reduced Motion Alternative

```javascript
const getExitVariant = (prefersReducedMotion) => ({
  exit: {
    opacity: 0,
    y: prefersReducedMotion ? 0 : -8,
    transition: {
      duration: prefersReducedMotion ? 0.1 : 0.2
    }
  }
});
```
