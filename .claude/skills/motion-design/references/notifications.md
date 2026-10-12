
# Notification Animations

Patterns for toasts, snackbars, alerts, and temporary messages.

## Notification Types

| Type | Duration | Position | Dismissal |
|------|----------|----------|-----------|
| **Toast** | 3-5s | Top/Bottom | Auto + swipe |
| **Snackbar** | 5-10s | Bottom | Action + swipe |
| **Alert** | Until action | Center | Button only |
| **Banner** | Persistent | Top | Close button |

## Entrance Patterns

### Slide In (Recommended)

```css
/* From bottom */
@keyframes toast-enter {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.toast-enter {
  animation: toast-enter 250ms ease-out forwards;
}
```

```javascript
// GSAP
gsap.from('.toast', {
  y: 100,
  opacity: 0,
  duration: 0.25,
  ease: 'power2.out'
});
```

### Scale + Fade

```css
@keyframes toast-scale-enter {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.toast-scale-enter {
  animation: toast-scale-enter 200ms ease-out forwards;
}
```

### Spring Entrance (Playful)

```javascript
// Framer Motion
<motion.div
  initial={{ y: 50, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  transition={{
    type: 'spring',
    damping: 20,
    stiffness: 300
  }}
/>
```

## Exit Patterns

### Fade Out

```css
@keyframes toast-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.toast-exit {
  animation: toast-exit 150ms ease-in forwards;
}
```

### Slide Out

```javascript
// Exit in same direction as entry
gsap.to('.toast', {
  y: -50,
  opacity: 0,
  duration: 0.15,
  ease: 'power2.in',
  onComplete: () => toast.remove()
});
```

### Swipe Dismiss

```javascript
// Gesture-based dismissal
const swipeThreshold = 100;
const velocityThreshold = 500;

function handleSwipe(gesture) {
  if (Math.abs(gesture.deltaX) > swipeThreshold ||
      Math.abs(gesture.velocityX) > velocityThreshold) {
    // Dismiss in swipe direction
    gsap.to('.toast', {
      x: gesture.deltaX > 0 ? 300 : -300,
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    });
  } else {
    // Snap back
    gsap.to('.toast', {
      x: 0,
      duration: 0.3,
      ease: 'elastic.out(1, 0.5)'
    });
  }
}
```

## Stacking Behavior

### Push Stack

```javascript
// New toasts push existing ones up
function addToast(toast) {
  // Animate existing toasts up
  gsap.to('.toast:not(:last-child)', {
    y: '-=70',  // Height + gap
    duration: 0.2,
    stagger: 0.05
  });

  // Insert new toast
  container.appendChild(toast);
  animateIn(toast);
}
```

### Replace Stack

```javascript
// Fade out old, fade in new
async function replaceToast(newToast) {
  const existing = document.querySelector('.toast');

  if (existing) {
    await gsap.to(existing, {
      opacity: 0,
      y: -10,
      duration: 0.15
    });
    existing.remove();
  }

  container.appendChild(newToast);
  animateIn(newToast);
}
```

## Status-Specific Animations

### Success

```javascript
const successToast = {
  enter: {
    opacity: [0, 1],
    y: [20, 0],
    scale: [0.95, 1]
  },
  icon: {
    // Checkmark draw animation
    strokeDashoffset: [24, 0],
    duration: 0.3,
    delay: 0.2
  },
  timing: {
    duration: 250,
    easing: 'ease-out'
  }
};
```

### Error

```javascript
const errorToast = {
  enter: {
    opacity: [0, 1],
    x: [-10, 5, -3, 0]  // Subtle shake
  },
  timing: {
    duration: 300,
    easing: 'ease-out'
  },
  borderPulse: {
    // Attention-grabbing pulse
    boxShadow: [
      '0 0 0 0 rgba(239, 68, 68, 0.5)',
      '0 0 0 8px rgba(239, 68, 68, 0)',
    ],
    duration: 500,
    iterations: 2
  }
};
```

### Warning

```javascript
const warningToast = {
  enter: {
    opacity: [0, 1],
    y: [20, 0]
  },
  icon: {
    // Pulse animation for warning icon
    scale: [1, 1.1, 1],
    duration: 400,
    iterations: 2
  }
};
```

### Info

```javascript
const infoToast = {
  enter: {
    opacity: [0, 1],
    y: [10, 0]
  },
  timing: {
    duration: 200,
    easing: 'ease-out'
  }
};
```

## Progress Indicator

```css
/* Auto-dismiss countdown */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: currentColor;
  animation: toast-countdown 5s linear forwards;
}

@keyframes toast-countdown {
  from { width: 100%; }
  to { width: 0%; }
}
```

```javascript
// Pause on hover
toast.addEventListener('mouseenter', () => {
  progressBar.style.animationPlayState = 'paused';
});

toast.addEventListener('mouseleave', () => {
  progressBar.style.animationPlayState = 'running';
});
```

## Accessibility

### ARIA Announcements

```jsx
<div
  role="alert"
  aria-live="polite"
  aria-atomic="true"
>
  {message}
</div>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .toast-enter {
    animation: toast-fade-only 150ms ease-out;
  }

  @keyframes toast-fade-only {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
```

### Focus Management

```javascript
// Return focus after dismissal
const previousFocus = document.activeElement;

toast.addEventListener('dismiss', () => {
  previousFocus?.focus();
});
```

## React Implementation

```jsx
import { AnimatePresence, motion } from 'framer-motion';

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.25,
              ease: [0.2, 0, 0, 1]  // M3 standard
            }}
            layout  // Smooth reordering
          >
            <Toast {...toast} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
```

## Timing Guidelines

| Aspect | Duration | Notes |
|--------|----------|-------|
| Entrance | 200-250ms | Fast enough to not interrupt |
| Exit | 150-200ms | Slightly faster than entrance |
| Auto-dismiss | 3000-5000ms | Based on content length |
| Swipe dismiss | 200ms | Match gesture velocity |
| Stagger (stack) | 50ms | Between existing toasts |

## Related Skills

- **Dependencies:** easing, duration, entrance-patterns, exit-patterns
- **See also:** accessibility, gesture-motion
- **Components:** Toast, Snackbar, Alert, Banner
