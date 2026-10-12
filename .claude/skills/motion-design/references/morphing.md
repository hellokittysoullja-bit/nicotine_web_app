
# Morphing

Shape transformation and path interpolation animations.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| SVG SMIL | developer.mozilla.org/SVG/SVG_animation_with_SMIL |
| CSS clip-path | developer.mozilla.org/CSS/clip-path |
| Flubber | github.com/veltman/flubber |

## Quick Reference

Load from: `tokens/morphing.tokens.json`

### Morph Speeds

| Token | Value | Use |
|-------|-------|-----|
| `fast` | 300ms | Quick transition |
| `normal` | 600ms | Standard morph |
| `slow` | 1200ms | Dramatic transformation |
| `deliberate` | 2000ms | Very slow, deliberate |

### Blob Parameters

| Token | Value | Use |
|-------|-------|-----|
| `complexity.simple` | 3 points | Simple blob |
| `complexity.normal` | 6 points | Standard blob |
| `amplitude.subtle` | 0.1 | Subtle variation |
| `amplitude.dramatic` | 0.6 | Dramatic variation |

## Selection Guide

```
What morph type?
│
├── ICON-TO-ICON → UI icon transitions
│   ├── Same complexity → direct morph
│   ├── Different complexity → add intermediate
│   └── Use rotation for meaning
│
├── SHAPE-TO-SHAPE → Geometric transforms
│   ├── Similar point count → linear interp
│   ├── Different counts → subdivision
│   └── Use path matching algorithm
│
├── BLOB/ORGANIC → Fluid shapes
│   ├── Low complexity → simple animation
│   ├── Continuous → loop animation
│   └── Add noise for organic feel
│
├── TEXT MORPH → Character transforms
│   ├── Per-character → stagger effect
│   ├── Word-to-word → full morph
│   └── Use glyph decomposition
│
└── LIQUID → Fluid transition
    ├── Low viscosity → fast, fluid
    └── High viscosity → slow, sticky
```

## Patterns

### Basic SVG Morph

Simple path morphing with CSS.

**CSS (Animate attribute):**
```css
@keyframes morph {
  0% {
    d: path('M10,10 L90,10 L90,90 L10,90 Z'); /* Square */
  }
  50% {
    d: path('M50,10 L90,50 L50,90 L10,50 Z'); /* Diamond */
  }
  100% {
    d: path('M50,10 C80,10 90,50 50,90 C10,50 20,10 50,10 Z'); /* Oval-ish */
  }
}

.morphing-path {
  animation: morph 1.2s ease-in-out infinite;
  /* {motion.morphing.speed.slow} */
}
```

**SMIL (SVG native):**
```html
<svg viewBox="0 0 100 100">
  <path fill="#3b82f6">
    <animate
      attributeName="d"
      dur="600ms"
      repeatCount="indefinite"
      values="
        M10,10 L90,10 L90,90 L10,90 Z;
        M50,10 L90,50 L50,90 L10,50 Z;
        M10,10 L90,10 L90,90 L10,90 Z
      "
      keyTimes="0; 0.5; 1"
      keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
      calcMode="spline"
    />
  </path>
</svg>
```

### Icon Morph (Hamburger to X)

Classic menu icon transition.

**CSS:**
```css
.hamburger {
  --transition: 400ms ease-out; /* {motion.morphing.icon-morph.transition.standard} */
}

.hamburger .line {
  transition:
    transform var(--transition),
    opacity var(--transition);
}

.hamburger.active .line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.hamburger.active .line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger.active .line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}
```

**Framer Motion:**
```tsx
const hamburgerVariants = {
  closed: {
    rotate: 0,
    y: 0
  },
  open: {
    rotate: 45,
    y: 8
  }
};

const middleVariants = {
  closed: { opacity: 1, scaleX: 1 },
  open: { opacity: 0, scaleX: 0 }
};

<motion.div className="hamburger">
  <motion.span
    variants={hamburgerVariants}
    animate={isOpen ? 'open' : 'closed'}
    transition={{ duration: 0.4 }}
  />
  <motion.span
    variants={middleVariants}
    animate={isOpen ? 'open' : 'closed'}
    transition={{ duration: 0.4 }}
  />
  <motion.span
    variants={{ ...hamburgerVariants, open: { rotate: -45, y: -8 } }}
    animate={isOpen ? 'open' : 'closed'}
    transition={{ duration: 0.4 }}
  />
</motion.div>
```

### Flubber Path Morph

Using Flubber library for complex morphs.

**JavaScript:**
```javascript
import { interpolate } from 'flubber';

const fromPath = 'M0,0 L100,0 L100,100 L0,100 Z'; // Square
const toPath = 'M50,0 A50,50 0 1,1 50,100 A50,50 0 1,1 50,0'; // Circle

const interpolator = interpolate(fromPath, toPath, {
  maxSegmentLength: 10 // {motion.morphing.subdivision.low}
});

function animateMorph(element, duration = 600) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Apply easing {motion.morphing.easing.smooth}
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;

    element.setAttribute('d', interpolator(eased));

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}
```

### Blob Animation

Organic blob shape animation.

**CSS:**
```css
.blob {
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  animation: blob-morph 8s ease-in-out infinite;
  /* {motion.morphing.blob.speed.slow} */
}

@keyframes blob-morph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% {
    border-radius: 50% 60% 30% 60% / 30% 40% 70% 60%;
  }
  75% {
    border-radius: 60% 30% 60% 50% / 60% 70% 40% 30%;
  }
}
```

**JavaScript (SVG Blob):**
```javascript
class BlobMorph {
  constructor(svg, options = {}) {
    this.svg = svg;
    this.path = svg.querySelector('path');
    this.complexity = options.complexity || 6; // {motion.morphing.blob.complexity.normal}
    this.amplitude = options.amplitude || 0.3;  // {motion.morphing.blob.amplitude.moderate}
    this.speed = options.speed || 4000;         // {motion.morphing.blob.speed.normal}
  }

  generateBlobPath(time) {
    const points = [];
    const angleStep = (Math.PI * 2) / this.complexity;

    for (let i = 0; i < this.complexity; i++) {
      const angle = i * angleStep;
      const noise = Math.sin(time * 0.001 + i * 1.5) * this.amplitude;
      const radius = 40 + noise * 20;

      points.push({
        x: 50 + Math.cos(angle) * radius,
        y: 50 + Math.sin(angle) * radius
      });
    }

    return this.pointsToPath(points);
  }

  pointsToPath(points) {
    const n = points.length;
    let d = `M${points[0].x},${points[0].y}`;

    for (let i = 0; i < n; i++) {
      const p0 = points[(i - 1 + n) % n];
      const p1 = points[i];
      const p2 = points[(i + 1) % n];
      const p3 = points[(i + 2) % n];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return d + 'Z';
  }

  animate() {
    const update = (time) => {
      this.path.setAttribute('d', this.generateBlobPath(time));
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }
}
```

### Liquid Morph

Fluid/liquid shape transition.

**JavaScript (Canvas):**
```javascript
class LiquidMorph {
  constructor(canvas) {
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.tension = 0.5;    // {motion.morphing.liquid.tension.medium}
    this.viscosity = 0.5;  // {motion.morphing.liquid.viscosity.honey}

    this.points = this.createPoints(8);
    this.targetPoints = [...this.points];
  }

  createPoints(count) {
    const points = [];
    const angleStep = (Math.PI * 2) / count;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.3;

    for (let i = 0; i < count; i++) {
      const angle = i * angleStep;
      points.push({
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0
      });
    }

    return points;
  }

  setTarget(shape) {
    // Generate target points for shape
    this.targetPoints = this.createPoints(8);
    // Apply shape transformation
  }

  update() {
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const target = this.targetPoints[i];

      // Spring physics toward target
      const dx = target.x - point.x;
      const dy = target.y - point.y;

      point.vx += dx * this.tension;
      point.vy += dy * this.tension;

      // Apply viscosity (damping)
      point.vx *= (1 - this.viscosity);
      point.vy *= (1 - this.viscosity);

      point.x += point.vx;
      point.y += point.vy;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.beginPath();

    // Draw smooth curve through points
    const n = this.points.length;
    this.ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 0; i < n; i++) {
      const p0 = this.points[(i - 1 + n) % n];
      const p1 = this.points[i];
      const p2 = this.points[(i + 1) % n];

      const cp1x = p1.x + (p2.x - p0.x) * 0.2;
      const cp1y = p1.y + (p2.y - p0.y) * 0.2;

      this.ctx.quadraticCurveTo(p1.x, p1.y, cp1x, cp1y);
    }

    this.ctx.closePath();
    this.ctx.fill();
  }

  animate() {
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}
```

### Text Morph

Character-by-character morphing.

**GSAP + SplitText:**
```javascript
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

function morphText(fromElement, toElement, duration = 600) {
  const fromSplit = new SplitText(fromElement, { type: 'chars' });
  const toSplit = new SplitText(toElement, { type: 'chars' });

  const tl = gsap.timeline();

  // Morph out old text
  tl.to(fromSplit.chars, {
    opacity: 0,
    scale: 0.5,
    y: -20,
    stagger: 0.05, // {motion.morphing.text-morph.per-character}
    duration: duration / 2000,
    ease: 'power2.in'
  });

  // Morph in new text
  tl.from(toSplit.chars, {
    opacity: 0,
    scale: 0.5,
    y: 20,
    stagger: 0.05,
    duration: duration / 2000,
    ease: 'power2.out'
  }, `-=${duration / 4000}`); // Overlap {motion.morphing.text-morph.overlap}

  return tl;
}
```

### GSAP MorphSVG

Using GSAP's MorphSVG plugin.

**JavaScript:**
```javascript
import gsap from 'gsap';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';

gsap.registerPlugin(MorphSVGPlugin);

// Basic morph
gsap.to('#shape1', {
  morphSVG: '#shape2',
  duration: 0.6, // {motion.morphing.speed.normal}
  ease: 'power2.inOut'
});

// With rotation
gsap.to('#icon', {
  morphSVG: {
    shape: '#targetIcon',
    shapeIndex: 'auto'
  },
  rotation: 180, // {motion.morphing.icon-morph.rotation.half}
  duration: 0.4,
  ease: 'power2.inOut'
});

// Sequence through multiple shapes
const shapes = ['#circle', '#square', '#triangle', '#star'];
let current = 0;

function morphNext() {
  current = (current + 1) % shapes.length;
  gsap.to('#morphTarget', {
    morphSVG: shapes[current],
    duration: 0.6,
    ease: 'power2.inOut',
    onComplete: () => setTimeout(morphNext, 1000)
  });
}
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Animated morph | Instant swap or crossfade |
| Blob animation | Static blob shape |
| Liquid effects | Simple opacity fade |
| Icon morph | Instant icon swap |

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }

  .morphing-path {
    animation: none;
  }
}
```

```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Instant swap instead of morph
  element.setAttribute('d', targetPath);
} else {
  animateMorph(element, 600);
}
```

## Cross-References

- See `stroke/` for stroke-based path animations
- See `masks/` for mask-based reveals
- See `easing/` for morph easing curves
- See `opacity/` for fade-based transitions

## References

- `morphing/path-interpolation.md` — Path matching algorithms
