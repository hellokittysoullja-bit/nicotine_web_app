
# Glow & Shadow

Light effects, shadows, and reflections for depth and emphasis.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| Material Design 3 | m3.material.io/styles/elevation |
| CSS Box Shadow | developer.mozilla.org/CSS/box-shadow |

## Quick Reference

Load from: `tokens/glow-shadow.tokens.json`

### Glow Radius

| Token | Value | Use |
|-------|-------|-----|
| `tight` | 4px | Close glow |
| `medium` | 16px | Standard glow |
| `large` | 32px | Wide glow |
| `bloom` | 80px | Bloom effect |

### Shadow Elevation (M3)

| Token | Shadow | Use |
|-------|--------|-----|
| `level-1` | 1px/2px | Cards at rest |
| `level-2` | 2px/4px | Raised cards |
| `level-3` | 4px/8px | Dialogs |
| `level-4` | 8px/16px | Modals |
| `level-5` | 16px/32px | Floating |

## Selection Guide

```
What effect?
│
├── GLOW → Light emanation
│   ├── Subtle → intensity 0.3, radius 8px
│   ├── Strong → intensity 1, radius 16px
│   ├── Neon → inner + outer glow, color
│   └── Bloom → intensity 1.5+, radius 48px+
│
├── SHADOW → Depth indication
│   ├── Contact → offset 0, small blur
│   ├── Elevation 1-5 → M3 scale
│   ├── Long → large offset for drama
│   └── Inner → inset shadow
│
├── LIGHT SWEEP → Shine animation
│   ├── Fast → 500ms
│   ├── Normal → 1000ms
│   └── Angle typically -45deg
│
└── REFLECTION → Mirror effect
    ├── Subtle → 10% opacity
    ├── Strong → 50% opacity
    └── Gradient fade required
```

## Patterns

### Animated Glow

Pulsing glow effect.

**CSS:**
```css
.glow {
  box-shadow:
    0 0 8px rgba(59, 130, 246, 0.5),  /* {motion.glow.radius.small} */
    0 0 16px rgba(59, 130, 246, 0.3); /* {motion.glow.radius.medium} */
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    box-shadow:
      0 0 8px rgba(59, 130, 246, 0.5),
      0 0 16px rgba(59, 130, 246, 0.3);
  }
  50% {
    box-shadow:
      0 0 12px rgba(59, 130, 246, 0.8),
      0 0 24px rgba(59, 130, 246, 0.5);
  }
}
```

**Framer Motion:**
```tsx
<motion.div
  animate={{
    boxShadow: [
      '0 0 8px rgba(59, 130, 246, 0.5)',
      '0 0 16px rgba(59, 130, 246, 0.8)',
      '0 0 8px rgba(59, 130, 246, 0.5)'
    ]
  }}
  transition={{
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

### Neon Glow

Neon sign effect with flicker.

**CSS:**
```css
.neon {
  color: #fff;
  text-shadow:
    0 0 2px #fff,                    /* Inner white */
    0 0 4px #fff,
    0 0 8px #ff00de,                 /* Inner color */
    0 0 16px #ff00de,
    0 0 32px #ff00de,                /* Outer color */
    0 0 48px #ff00de;
  animation: neon-flicker 3s infinite;
}

@keyframes neon-flicker {
  0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
    text-shadow:
      0 0 2px #fff,
      0 0 4px #fff,
      0 0 8px #ff00de,
      0 0 16px #ff00de,
      0 0 32px #ff00de,
      0 0 48px #ff00de;
  }
  20%, 24%, 55% {
    text-shadow: none;
  }
}
```

**GSAP:**
```javascript
gsap.to('.neon', {
  textShadow: `
    0 0 2px #fff,
    0 0 4px #fff,
    0 0 8px #ff00de,
    0 0 24px #ff00de,
    0 0 48px #ff00de
  `,
  duration: 0.1,
  repeat: -1,
  yoyo: true,
  ease: "rough({ strength: 1, points: 20, clamp: true })"
});
```

### Elevation Shadow (M3)

Material Design elevation levels.

**CSS:**
```css
/* Level 1 - Cards at rest */
.elevation-1 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  /* {motion.shadow.elevation.level-1} */
}

/* Level 2 - Raised cards */
.elevation-2 {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
}

/* Level 3 - Dialogs */
.elevation-3 {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Level 4 - Modals */
.elevation-4 {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Level 5 - Floating */
.elevation-5 {
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15);
}

/* Animated elevation change */
.card {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  transition: box-shadow 200ms ease-out;
}

.card:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
```

**Framer Motion:**
```tsx
const cardVariants = {
  rest: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.15)'
  },
  hover: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.2 }
  }
};

<motion.div
  variants={cardVariants}
  initial="rest"
  whileHover="hover"
/>
```

### Light Sweep / Shine

Moving light highlight effect.

**CSS:**
```css
.light-sweep {
  position: relative;
  overflow: hidden;
}

.light-sweep::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -100%;
  width: 60px;    /* {motion.glow.light-sweep.width-medium} */
  height: 200%;
  background: linear-gradient(
    to right,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transform: rotate(-45deg);
  animation: sweep 3s ease-in-out infinite;
}

@keyframes sweep {
  0% { left: -100%; }
  50%, 100% { left: 200%; }
}
```

**GSAP:**
```javascript
gsap.fromTo('.shine-element::after',
  { left: '-100%' },
  {
    left: '200%',
    duration: 1,         // {motion.glow.light-sweep.duration-normal}
    ease: 'power2.inOut',
    repeat: -1,
    repeatDelay: 2
  }
);
```

### Inner Shadow

Inset shadow for pressed/recessed look.

**CSS:**
```css
.inset {
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.15);
  /* {motion.shadow.inner.medium} */
}

/* Button pressed state */
.button:active {
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 1px 0 rgba(255, 255, 255, 0.1);
}
```

### Long Shadow

Flat design long shadow.

**CSS:**
```css
.long-shadow {
  text-shadow:
    1px 1px 0 #333,
    2px 2px 0 #333,
    3px 3px 0 #333,
    4px 4px 0 #333,
    5px 5px 0 #333,
    6px 6px 0 #333,
    7px 7px 0 #333,
    8px 8px 0 #333;
}

/* Generated programmatically */
.long-shadow-generated {
  --shadow-color: rgba(0, 0, 0, 0.2);
  text-shadow: var(--long-shadow);
}
```

**JavaScript (Generate long shadow):**
```javascript
function generateLongShadow(length, color) {
  const shadows = [];
  for (let i = 1; i <= length; i++) {
    shadows.push(`${i}px ${i}px 0 ${color}`);
  }
  return shadows.join(', ');
}

element.style.textShadow = generateLongShadow(20, 'rgba(0,0,0,0.2)');
```

### Reflection Effect

Floor reflection.

**CSS:**
```css
.reflection-container {
  position: relative;
}

.reflection {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  transform: scaleY(-1);
  opacity: 0.3;                      /* {motion.reflection.opacity.medium} */
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5) 0%,
    transparent 50%                  /* {motion.reflection.gradient-fade.medium} */
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.5) 0%,
    transparent 50%
  );
}
```

### Multiple Shadow Layers

Realistic multi-layer shadow.

**CSS:**
```css
.realistic-shadow {
  box-shadow:
    /* Ambient */
    0 1px 1px rgba(0, 0, 0, 0.04),
    /* Key light */
    0 2px 2px rgba(0, 0, 0, 0.04),
    0 4px 4px rgba(0, 0, 0, 0.04),
    0 8px 8px rgba(0, 0, 0, 0.04),
    /* Main shadow */
    0 16px 16px rgba(0, 0, 0, 0.04);
}

/* Hover: lift effect */
.realistic-shadow:hover {
  box-shadow:
    0 2px 2px rgba(0, 0, 0, 0.04),
    0 4px 4px rgba(0, 0, 0, 0.04),
    0 8px 8px rgba(0, 0, 0, 0.04),
    0 16px 16px rgba(0, 0, 0, 0.04),
    0 32px 32px rgba(0, 0, 0, 0.04);
  transform: translateY(-4px);
  transition: all 0.3s ease;
}
```

### Glow on Hover

Interactive glow effect.

**CSS:**
```css
.glow-hover {
  transition: box-shadow 300ms ease-out;
}

.glow-hover:hover {
  box-shadow:
    0 0 8px rgba(59, 130, 246, 0.4),
    0 0 16px rgba(59, 130, 246, 0.2),
    0 0 32px rgba(59, 130, 246, 0.1);
}
```

**Framer Motion:**
```tsx
<motion.button
  whileHover={{
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
  }}
  transition={{ duration: 0.3 }}
>
  Hover me
</motion.button>
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Pulsing glow | Static glow |
| Light sweep | No animation or instant |
| Neon flicker | Constant glow |
| Shadow transitions | Instant change |

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .glow {
    animation: none;
  }

  .light-sweep::after {
    animation: none;
    display: none;
  }

  .neon {
    animation: none;
  }

  .card {
    transition-duration: 0.01ms;
  }
}
```

## Cross-References

- See `opacity/` for fade + shadow combinations
- See `scale/` for elevation with scale changes
- See `blur/` for soft focus effects with glow
- See `particles/` for glowing particles

## References

- No additional references needed for this skill
