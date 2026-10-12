
# Blur

Blur effects for focus, motion, and depth simulation.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| CSS Filter | developer.mozilla.org/CSS/filter |
| CSS Backdrop Filter | developer.mozilla.org/CSS/backdrop-filter |

## Quick Reference

Load from: `tokens/blur.tokens.json`

### Blur Radius

| Token | Value | Use |
|-------|-------|-----|
| `none` | 0px | Sharp, in-focus |
| `subtle` | 2px | Slight softening |
| `light` | 4px | Noticeable softening |
| `medium` | 8px | Clear defocus |
| `strong` | 16px | Pronounced blur |
| `extreme` | 32px | Abstract softness |

### Focus Pull Duration

| Token | Value | Use |
|-------|-------|-----|
| `pull-duration-fast` | 200ms | Snap focus |
| `pull-duration-standard` | 400ms | Natural pace |
| `pull-duration-slow` | 800ms | Cinematic rack focus |

## Selection Guide

```
What type of blur?
│
├── FOCUS TRANSITION → Element coming into/out of focus
│   ├── Fast snap → 200ms
│   ├── Standard → 400ms
│   └── Cinematic → 800ms+
│
├── MOTION BLUR → Moving elements
│   ├── Subtle → distance-subtle (4px)
│   ├── Standard → distance-medium (12px)
│   └── Extreme → distance-extreme (48px)
│
├── DEPTH OF FIELD → Foreground/background separation
│   ├── Near blur → near-blur (8px)
│   └── Far blur → far-blur (4px)
│
├── TILT-SHIFT → Miniature effect
│   ├── Narrow band → focus-band-narrow (100px)
│   └── Wide band → focus-band-wide (400px)
│
└── BACKDROP → Background blur behind element
    ├── Subtle → light (4px)
    ├── Standard → medium (8px)
    └── Frosted glass → strong (16px)
```

## Patterns

### Focus Pull Transition

Animate blur to simulate camera focus change.

**CSS:**
```css
.focus-pull {
  transition: filter 400ms ease-out; /* {motion.blur.focus.pull-duration-standard} */
}

.focus-pull.out-of-focus {
  filter: blur(8px); /* {motion.blur.radius.medium} */
}

.focus-pull.in-focus {
  filter: blur(0px); /* {motion.blur.radius.none} */
}
```

**Framer Motion:**
```tsx
const focusVariants = {
  blurred: {
    filter: "blur(8px)", // {motion.blur.radius.medium}
    transition: { duration: 0.4 }
  },
  focused: {
    filter: "blur(0px)",
    transition: { duration: 0.4 }
  }
};

<motion.div
  variants={focusVariants}
  animate={isFocused ? "focused" : "blurred"}
/>
```

**GSAP:**
```javascript
// Focus in
gsap.to(element, {
  filter: "blur(0px)",
  duration: 0.4,
  ease: "power2.out"
});

// Focus out
gsap.to(element, {
  filter: "blur(8px)",
  duration: 0.4,
  ease: "power2.out"
});
```

### Rack Focus (Two Elements)

Shift focus between foreground and background.

**JavaScript:**
```javascript
function rackFocus(foreground, background, duration = 0.8) {
  const tl = gsap.timeline();

  tl.to(foreground, {
    filter: "blur(8px)",
    duration: duration / 2,
    ease: "power2.inOut"
  }, 0)
  .to(background, {
    filter: "blur(0px)",
    duration: duration / 2,
    ease: "power2.inOut"
  }, duration / 4); // Slight overlap for smooth transition

  return tl;
}
```

**Framer Motion:**
```tsx
function RackFocus({ focusTarget }) {
  return (
    <>
      <motion.div
        className="foreground"
        animate={{ filter: focusTarget === 'fg' ? 'blur(0px)' : 'blur(8px)' }}
        transition={{ duration: 0.4 }}
      />
      <motion.div
        className="background"
        animate={{ filter: focusTarget === 'bg' ? 'blur(0px)' : 'blur(4px)' }}
        transition={{ duration: 0.4 }}
      />
    </>
  );
}
```

### Motion Blur Effect

Blur in direction of movement.

**CSS (approximation with directional blur):**
```css
/* Horizontal motion blur using multiple shadows */
.motion-blur-h {
  filter: blur(0px);
  text-shadow:
    -4px 0 2px rgba(0,0,0,0.1),
    -2px 0 1px rgba(0,0,0,0.1),
    2px 0 1px rgba(0,0,0,0.1),
    4px 0 2px rgba(0,0,0,0.1);
}

/* Using SVG filter for true directional blur */
.motion-blur-svg {
  filter: url(#motion-blur);
}
```

**SVG Filter:**
```html
<svg>
  <filter id="motion-blur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="12,0" />
    <!-- 12px horizontal, 0px vertical -->
  </filter>
</svg>
```

**Framer Motion (animate blur during motion):**
```tsx
function MovingElement() {
  const x = useMotionValue(0);
  const blur = useTransform(
    useVelocity(x),
    [-1000, 0, 1000],
    [12, 0, 12] // More velocity = more blur
  );

  return (
    <motion.div
      style={{
        x,
        filter: useMotionTemplate`blur(${blur}px)`
      }}
      drag="x"
    />
  );
}
```

### Backdrop Blur (Frosted Glass)

Blur content behind an element.

**CSS:**
```css
.frosted-glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px); /* {motion.blur.radius.strong} */
  -webkit-backdrop-filter: blur(16px);
}

/* Animated backdrop blur */
.modal-backdrop {
  backdrop-filter: blur(0px);
  transition: backdrop-filter 300ms ease-out;
}

.modal-backdrop.visible {
  backdrop-filter: blur(8px); /* {motion.blur.radius.medium} */
}
```

**Framer Motion:**
```tsx
<motion.div
  initial={{ backdropFilter: "blur(0px)" }}
  animate={{ backdropFilter: "blur(16px)" }}
  exit={{ backdropFilter: "blur(0px)" }}
  transition={{ duration: 0.3 }}
  style={{ background: "rgba(255,255,255,0.1)" }}
/>
```

### Tilt-Shift Effect

Selective focus band for miniature effect.

**CSS (gradient mask + blur):**
```css
.tilt-shift-container {
  position: relative;
}

.tilt-shift-blur {
  position: absolute;
  inset: 0;
  filter: blur(16px);
  mask-image: linear-gradient(
    to bottom,
    black 0%,
    transparent 30%,
    transparent 70%,
    black 100%
  );
  pointer-events: none;
}
```

**Advanced Tilt-Shift:**
```javascript
function createTiltShift(container, options = {}) {
  const {
    focusPosition = 0.5, // 0-1, vertical position of focus band
    focusBandSize = 0.3, // 0-1, size of in-focus area
    blurAmount = 16      // px
  } = options;

  const top = (focusPosition - focusBandSize / 2) * 100;
  const bottom = (focusPosition + focusBandSize / 2) * 100;

  const blurLayer = document.createElement('div');
  blurLayer.style.cssText = `
    position: absolute;
    inset: 0;
    filter: blur(${blurAmount}px);
    mask-image: linear-gradient(
      to bottom,
      black 0%,
      black ${top}%,
      transparent ${top + 10}%,
      transparent ${bottom - 10}%,
      black ${bottom}%,
      black 100%
    );
    pointer-events: none;
  `;

  container.style.position = 'relative';
  container.appendChild(blurLayer);

  return {
    updateFocus(newPosition) {
      // Animate focus band position
      gsap.to(blurLayer, {
        maskImage: `linear-gradient(...)`, // Updated gradient
        duration: 0.5
      });
    }
  };
}
```

### Depth-Based Blur

Blur based on z-depth in scene.

**CSS Custom Properties:**
```css
.depth-element {
  --z-depth: 0; /* 0 = in focus, negative = near, positive = far */
  filter: blur(calc(abs(var(--z-depth)) * 2px));
  transition: filter 200ms ease-out;
}

/* Example depth layers */
.layer-near { --z-depth: -3; } /* 6px blur */
.layer-focus { --z-depth: 0; } /* 0px blur */
.layer-mid { --z-depth: 2; }   /* 4px blur */
.layer-far { --z-depth: 4; }   /* 8px blur */
```

**Framer Motion:**
```tsx
function DepthScene({ focalDistance }) {
  const layers = [
    { z: 100, content: "Near" },
    { z: 300, content: "Focus" },
    { z: 500, content: "Far" }
  ];

  return layers.map(layer => {
    const distance = Math.abs(layer.z - focalDistance);
    const blur = Math.min(distance / 50, 16); // Max 16px blur

    return (
      <motion.div
        key={layer.z}
        animate={{ filter: `blur(${blur}px)` }}
        transition={{ duration: 0.4 }}
      >
        {layer.content}
      </motion.div>
    );
  });
}
```

### Radial/Zoom Blur

Blur radiating from center point.

**SVG Filter:**
```html
<svg>
  <filter id="radial-blur">
    <feGaussianBlur in="SourceGraphic" stdDeviation="0" result="blur1"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur3"/>

    <feImage href="data:image/svg+xml,..." result="gradient"/>

    <feComposite in="blur1" in2="gradient" operator="in" result="masked1"/>
    <!-- Complex compositing for radial effect -->
  </filter>
</svg>
```

**Canvas-based:**
```javascript
function radialBlur(ctx, centerX, centerY, maxBlur, samples = 10) {
  const canvas = ctx.canvas;
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');

  // Draw multiple scaled copies with offset
  for (let i = 0; i < samples; i++) {
    const scale = 1 + (i / samples) * 0.1;
    const alpha = 1 / samples;

    tempCtx.globalAlpha = alpha;
    tempCtx.save();
    tempCtx.translate(centerX, centerY);
    tempCtx.scale(scale, scale);
    tempCtx.translate(-centerX, -centerY);
    tempCtx.drawImage(canvas, 0, 0);
    tempCtx.restore();
  }

  ctx.drawImage(tempCanvas, 0, 0);
}
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Focus pull animation | Instant blur change |
| Motion blur | No blur, or static slight blur |
| Animated tilt-shift | Static blur or none |
| Backdrop blur animation | Instant backdrop blur |

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .focus-pull {
    transition-duration: 0.01ms;
  }

  .motion-blur-h {
    filter: none;
    text-shadow: none;
  }

  .tilt-shift-blur {
    /* Keep static blur, just don't animate */
    transition: none;
  }
}
```

## Performance Considerations

1. **`filter: blur()` triggers GPU compositing** — generally performant
2. **`backdrop-filter` can be expensive** — limit to small areas
3. **Large blur radii** (32px+) may cause performance issues
4. **Animated blur** works best on simple elements
5. **Use `will-change: filter`** before animating

```css
.blur-animated {
  will-change: filter;
}

.blur-animated.animation-done {
  will-change: auto;
}
```

## Cross-References

- See `reveals/` for blur + reveal combinations
- See `opacity/` for blur + fade combinations
- See `depth/` for 3D depth-based blur
- See `camera/` for cinematic focus effects
- See `motion-blur/` for legacy motion blur tokens

## References

- No additional references needed for this skill
