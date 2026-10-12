
# Opacity

Visibility control through transparency animations.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| Material Design 3 | m3.material.io/styles/motion |
| CSS Opacity | developer.mozilla.org/CSS/opacity |

## Quick Reference

Load from: `tokens/opacity.tokens.json`

### Opacity Levels

| Token | Value | Use |
|-------|-------|-----|
| `invisible` | 0 | Hidden state |
| `ghost` | 0.1 | Ghosted/disabled |
| `subtle` | 0.3 | Understated presence |
| `half` | 0.5 | Semi-transparent |
| `prominent` | 0.7 | Clearly visible |
| `visible` | 1 | Fully opaque |

### Fade Durations

| Token | Value | Use |
|-------|-------|-----|
| `duration-micro` | 50ms | Perception threshold |
| `duration-fast` | 100ms | Quick feedback |
| `duration-standard` | 200ms | M3 short-4 |
| `duration-smooth` | 300ms | Comfortable pace |

## Selection Guide

```
What's the effect?
│
├── FADE IN/OUT → Standard opacity transition
│   ├── Quick → duration-fast (100ms)
│   ├── Standard → duration-standard (200ms)
│   └── Smooth → duration-smooth (300ms)
│
├── CROSSFADE → Two elements swapping
│   └── Use crossfade-midpoint (0.5) timing
│
├── FLASH → Attention/notification
│   ├── Single → count-single
│   ├── Emphasis → count-double
│   └── Duration: 100-150ms per flash
│
├── PULSE → Breathing/ambient
│   ├── Calm → period-slow (3s)
│   ├── Normal → period-medium (1.5s)
│   └── Urgent → period-fast (0.75s)
│
└── SCRIM/OVERLAY → Background dimming
    ├── Light → scrim-light (0.3)
    ├── Modal → scrim-medium (0.5)
    └── Focus → scrim-dark (0.7)
```

## Patterns

### Fade In

Element fades in from invisible to visible.

**CSS:**
```css
.fade-in {
  animation: fadeIn 200ms ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0; /* {motion.opacity.levels.invisible} */
  }
  to {
    opacity: 1; /* {motion.opacity.levels.visible} */
  }
}

/* Transition variant */
.fade-in-transition {
  opacity: 0;
  transition: opacity 200ms ease-out; /* {motion.opacity.fade.duration-standard} */
}

.fade-in-transition.visible {
  opacity: 1;
}
```

**Framer Motion:**
```tsx
const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.2, // {motion.opacity.fade.duration-standard}
      ease: [0.05, 0.7, 0.1, 1] // emphasized-decelerate
    }
  }
};

<motion.div
  variants={fadeInVariants}
  initial="hidden"
  animate="visible"
/>
```

**GSAP:**
```javascript
gsap.from(element, {
  opacity: 0,
  duration: 0.2, // {motion.opacity.fade.duration-standard}
  ease: "power2.out"
});
```

### Crossfade Transition

Two elements swap visibility simultaneously.

**CSS:**
```css
.crossfade-container {
  position: relative;
}

.crossfade-item {
  position: absolute;
  transition: opacity 300ms ease-in-out;
}

.crossfade-item.entering {
  opacity: 1;
}

.crossfade-item.exiting {
  opacity: 0;
}
```

**Framer Motion (AnimatePresence):**
```tsx
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={activeItem}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  />
</AnimatePresence>
```

**Remotion:**
```tsx
import { interpolate, useCurrentFrame } from 'remotion';

export const Crossfade: React.FC<{ switchFrame: number }> = ({ switchFrame }) => {
  const frame = useCurrentFrame();

  const opacity1 = interpolate(
    frame,
    [switchFrame - 15, switchFrame],
    [1, 0],
    { extrapolateRight: 'clamp' }
  );

  const opacity2 = interpolate(
    frame,
    [switchFrame, switchFrame + 15],
    [0, 1],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <>
      <div style={{ opacity: opacity1 }}>Content 1</div>
      <div style={{ opacity: opacity2 }}>Content 2</div>
    </>
  );
};
```

### Flash Effect

Quick opacity flash for notifications/attention.

**CSS:**
```css
@keyframes flash {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3; /* {motion.opacity.flash.trough} */
  }
}

.flash-once {
  animation: flash 150ms ease-in-out; /* {motion.opacity.flash.duration-standard} */
}

.flash-twice {
  animation: flash 150ms ease-in-out 2;
}

.flash-triple {
  animation: flash 150ms ease-in-out 3;
}
```

**Framer Motion:**
```tsx
const flashVariants = {
  idle: { opacity: 1 },
  flash: {
    opacity: [1, 0.3, 1, 0.3, 1],
    transition: {
      duration: 0.45, // 150ms x 3 flashes
      times: [0, 0.17, 0.33, 0.5, 0.67]
    }
  }
};
```

**GSAP:**
```javascript
gsap.to(element, {
  opacity: 0.3,
  duration: 0.075, // half of flash duration
  repeat: 3,
  yoyo: true,
  ease: "power2.inOut"
});
```

### Pulse/Breathing Effect

Continuous subtle opacity oscillation.

**CSS:**
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5; /* {motion.opacity.pulse.min-noticeable} */
  }
}

.breathing {
  animation: pulse 1.5s ease-in-out infinite; /* {motion.opacity.pulse.period-medium} */
}

/* Subtle variant */
.breathing-subtle {
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulseSubtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; } /* {motion.opacity.pulse.min-subtle} */
}
```

**Framer Motion:**
```tsx
<motion.div
  animate={{
    opacity: [1, 0.5, 1]
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

### Modal Scrim/Backdrop

Dimming overlay behind modals.

**CSS:**
```css
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: black;
  opacity: 0;
  transition: opacity 200ms ease-out;
}

.modal-backdrop.visible {
  opacity: 0.5; /* {motion.opacity.layer.scrim-medium} */
}

/* Darker for focused content */
.modal-backdrop.focused {
  opacity: 0.7; /* {motion.opacity.layer.scrim-dark} */
}
```

**Framer Motion:**
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.5 }} // {motion.opacity.layer.scrim-medium}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    />
  )}
</AnimatePresence>
```

### Flicker Effect

Random opacity variation for organic/unstable look.

**JavaScript + CSS:**
```javascript
function createFlicker(element, variance = 0.1, frequency = 5) {
  const baseOpacity = 1;

  setInterval(() => {
    const randomOffset = (Math.random() - 0.5) * 2 * variance;
    element.style.opacity = baseOpacity + randomOffset;
  }, 1000 / frequency);
}
```

**GSAP:**
```javascript
gsap.to(element, {
  opacity: "random(0.85, 1)", // {motion.opacity.flicker.variance} around 1
  duration: 0.1,
  repeat: -1,
  repeatRefresh: true,
  ease: "none"
});
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Fade (any duration) | Instant or very fast (50ms) |
| Flash/flicker | Single color change, no animation |
| Pulse | Static opacity or very subtle |
| Crossfade | Instant swap or very fast |

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .fade-in {
    animation: none;
    opacity: 1;
  }

  .breathing {
    animation: none;
    opacity: 1;
  }

  .flash-once {
    animation: none;
    /* Use color change instead */
    background-color: var(--highlight-color);
  }

  .modal-backdrop {
    transition-duration: 0.01ms;
  }
}
```

## Cross-References

- See `easing/` for fade timing curves
- See `duration/` for animation timing values
- See `entrance-patterns/` for fade + other properties
- See `exit-patterns/` for fade-out patterns
- See `transitions/` for crossfade page transitions
- See `reveals/` for opacity + clip-path combinations

## References

- No additional references needed for this skill
