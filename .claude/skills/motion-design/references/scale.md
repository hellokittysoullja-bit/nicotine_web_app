
# Scale

Size transform animations for emphasis, feedback, and organic motion.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| Material Design 3 | m3.material.io/styles/motion |
| Disney Principles | Squash & Stretch (Principle #1) |

## Quick Reference

Load from: `tokens/scale.tokens.json`

### Scale Values

| Token | Value | Use |
|-------|-------|-----|
| `none` | 0 | Scale from nothing (entrance) |
| `micro` | 0.95 | Button press feedback (M3) |
| `reduced` | 0.9 | Pressed state, recede |
| `normal` | 1 | Rest state (default) |
| `emphasis` | 1.02 | Subtle hover emphasis |
| `slight` | 1.05 | Noticeable hover |
| `medium` | 1.1 | Clear emphasis |
| `large` | 1.2 | Pop effect, celebration |

### Transform Origins

| Token | Value | Use |
|-------|-------|-----|
| `center` | center center | Default scaling |
| `top` | center top | Dropdown menus |
| `bottom` | center bottom | Tooltips, popovers |
| `bottom-right` | right bottom | FAB menus |

## Selection Guide

```
What's the purpose?
│
├── FEEDBACK → Button/interactive states
│   ├── Press → micro (0.95)
│   ├── Hover → emphasis (1.02) or slight (1.05)
│   └── Active → reduced (0.9)
│
├── ENTRANCE → Element appearing
│   ├── Subtle → micro (0.95) → normal
│   ├── Standard → small (0.8) → normal
│   └── Dramatic → none (0) → normal (pop)
│
├── EMPHASIS → Draw attention
│   ├── Gentle → pulse with amplitude-subtle
│   ├── Clear → medium (1.1)
│   └── Celebration → large (1.2) with bounce
│
└── ORGANIC → Natural motion
    └── Use squash-stretch tokens
        ├── Impact → squash-medium
        └── Motion → stretch-medium
```

## Patterns

### Button Press Feedback

Scale down on press, return on release.

**CSS:**
```css
.button {
  transform: scale(1);
  transition: transform 100ms cubic-bezier(0.2, 0, 0, 1); /* M3 standard */
}

.button:active {
  transform: scale(0.95); /* {motion.scale.values.micro} */
}
```

**Framer Motion:**
```tsx
<motion.button
  whileTap={{ scale: 0.95 }} // {motion.scale.values.micro}
  transition={{ duration: 0.1 }}
>
  Click me
</motion.button>
```

**GSAP:**
```javascript
button.addEventListener('mousedown', () => {
  gsap.to(button, { scale: 0.95, duration: 0.1 });
});

button.addEventListener('mouseup', () => {
  gsap.to(button, { scale: 1, duration: 0.1 });
});
```

### Pop-In Entrance

Element pops in from zero scale.

**CSS:**
```css
@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0); /* {motion.scale.values.none} */
  }
  70% {
    transform: scale(1.1); /* overshoot */
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.pop-in {
  animation: popIn 300ms cubic-bezier(0.34, 1.56, 0.64, 1); /* back-out */
}
```

**Framer Motion:**
```tsx
const popVariants = {
  hidden: {
    opacity: 0,
    scale: 0
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};
```

### Scale from Origin

Scale from specific edge/corner (dropdown menu).

**CSS:**
```css
.dropdown-menu {
  transform-origin: center top; /* {motion.scale.origin.top} */
  transform: scaleY(0);
  opacity: 0;
  transition: all 200ms cubic-bezier(0.05, 0.7, 0.1, 1);
}

.dropdown-menu.open {
  transform: scaleY(1);
  opacity: 1;
}
```

**Framer Motion:**
```tsx
<motion.div
  initial={{ scaleY: 0, opacity: 0 }}
  animate={{ scaleY: 1, opacity: 1 }}
  style={{ originY: 0 }} // top origin
  transition={{ duration: 0.2, ease: [0.05, 0.7, 0.1, 1] }}
/>
```

### Pulse Animation

Breathing/pulsing effect for attention.

**CSS:**
```css
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05); /* {motion.scale.pulse.amplitude-gentle} */
  }
}

.pulsing {
  animation: pulse 1.5s ease-in-out infinite; /* {motion.scale.pulse.period-medium} */
}
```

**Framer Motion:**
```tsx
<motion.div
  animate={{
    scale: [1, 1.05, 1]
  }}
  transition={{
    duration: 1.5,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

### Squash & Stretch

Organic deformation for natural motion (Disney Principle #1).

**Ball Bounce (Squash on Impact):**
```css
@keyframes bounce {
  0% {
    transform: translateY(-100px) scaleY(1.15) scaleX(0.85); /* stretch while falling */
  }
  50% {
    transform: translateY(0) scaleY(0.85) scaleX(1.15); /* squash on impact */
  }
  100% {
    transform: translateY(-100px) scaleY(1.15) scaleX(0.85); /* stretch rising */
  }
}
```

**Framer Motion:**
```tsx
const bounceVariants = {
  falling: {
    y: 0,
    scaleY: 0.85, // squash
    scaleX: 1.15,
    transition: { duration: 0.15 }
  },
  rising: {
    y: -100,
    scaleY: 1.15, // stretch
    scaleX: 0.85,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};
```

**GSAP:**
```javascript
const tl = gsap.timeline({ repeat: -1 });

tl.to(ball, {
  y: 200,
  scaleY: 0.7,  // squash-pronounced
  scaleX: 1.3,
  duration: 0.3,
  ease: "power2.in"
})
.to(ball, {
  y: 0,
  scaleY: 1.3,  // stretch-pronounced
  scaleX: 0.7,
  duration: 0.5,
  ease: "power2.out"
});
```

### Hover Emphasis

Subtle scale up on hover.

**CSS:**
```css
.card {
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1);
}

.card:hover {
  transform: scale(1.02); /* {motion.scale.values.emphasis} */
}
```

**Framer Motion:**
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
/>
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Scale from 0 | Scale from 0.95 + fade |
| Squash & stretch | None (keep uniform scale) |
| Pulse animation | Subtle opacity pulse or none |
| Bounce with deform | Simple ease, no deformation |

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .pop-in {
    animation: fadeIn 150ms ease-out;
  }

  .pulsing {
    animation: none;
  }

  .bounce {
    /* Remove squash-stretch, keep simple y movement */
    transform: scaleX(1) scaleY(1);
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
```

## Cross-References

- See `easing/` for timing curves
- See `duration/` for animation timing
- See `squash-stretch/` for detailed Disney principle implementation
- See `entrance-patterns/` for scale-based entrances
- See `motion-principles/` for squash-stretch theory
- See `position/` for combined scale + position animations

## References

- `scale/transform-origin.md` — Transform origin deep dive
