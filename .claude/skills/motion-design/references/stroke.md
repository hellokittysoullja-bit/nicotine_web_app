
# Stroke

Line drawing and stroke animation effects.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| SVG stroke | developer.mozilla.org/SVG/Attribute/stroke |
| CSS stroke-dasharray | developer.mozilla.org/CSS/stroke-dasharray |

## Quick Reference

Load from: `tokens/stroke.tokens.json`

### Draw Speeds

| Token | Value | Use |
|-------|-------|-----|
| `fast` | 400ms | Quick draw |
| `normal` | 800ms | Standard draw |
| `slow` | 1500ms | Deliberate drawing |
| `dramatic` | 3000ms | Very slow reveal |

### Stroke Widths

| Token | Value | Use |
|-------|-------|-----|
| `hairline` | 0.5px | Ultra-thin |
| `thin` | 1px | Thin stroke |
| `normal` | 2px | Standard |
| `thick` | 8px | Bold stroke |

## Selection Guide

```
What stroke effect?
│
├── DRAW-ON → Line appears progressively
│   ├── Single path → stroke-dashoffset
│   ├── Multiple paths → staggered
│   └── Add easing for natural feel
│
├── ERASE → Line disappears
│   ├── From start → reverse draw
│   ├── From end → animate end trim
│   └── Both ends → simultaneous
│
├── DASH ANIMATION → Moving dashes
│   ├── Marching ants → selection indicator
│   ├── Flow → direction indicator
│   └── Pulse → attention grabber
│
├── HANDWRITTEN → Natural writing feel
│   ├── Speed variation
│   ├── Pressure simulation
│   └── Natural wobble
│
└── TRIM PATH → Visible segment
    ├── Start → beginning of stroke
    ├── End → end of stroke
    └── Offset → position along path
```

## Patterns

### Basic Draw-On Effect

Stroke appears progressively.

**CSS:**
```css
.draw-path {
  stroke-dasharray: 1000; /* Total path length */
  stroke-dashoffset: 1000;
  animation: draw 800ms ease-out forwards;
  /* {motion.stroke.draw-speed.normal} */
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
```

**JavaScript (Dynamic length):**
```javascript
function drawOnPath(pathElement, duration = 800) {
  const length = pathElement.getTotalLength();

  pathElement.style.strokeDasharray = length;
  pathElement.style.strokeDashoffset = length;

  pathElement.animate([
    { strokeDashoffset: length },
    { strokeDashoffset: 0 }
  ], {
    duration,
    easing: 'cubic-bezier(0, 0, 0.2, 1)', // {motion.stroke.easing.ease-out}
    fill: 'forwards'
  });
}
```

**GSAP:**
```javascript
function drawPath(selector, duration = 0.8) {
  const path = document.querySelector(selector);
  const length = path.getTotalLength();

  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length
  });

  gsap.to(path, {
    strokeDashoffset: 0,
    duration,
    ease: 'power2.out'
  });
}
```

### Erase/Undraw Effect

Stroke disappears progressively.

**CSS:**
```css
.erase-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 0;
  animation: erase 800ms ease-in forwards;
}

@keyframes erase {
  to {
    stroke-dashoffset: -1000; /* Negative for reverse direction */
  }
}
```

**JavaScript (Erase from end):**
```javascript
function erasePath(pathElement, duration = 800, fromEnd = true) {
  const length = pathElement.getTotalLength();

  pathElement.style.strokeDasharray = length;
  pathElement.style.strokeDashoffset = 0;

  const targetOffset = fromEnd ? length : -length;

  pathElement.animate([
    { strokeDashoffset: 0 },
    { strokeDashoffset: targetOffset }
  ], {
    duration,
    easing: 'cubic-bezier(0.4, 0, 1, 1)', // {motion.stroke.easing.ease-in}
    fill: 'forwards'
  });
}
```

### Trim Path Animation

Animating visible segment of stroke.

**JavaScript:**
```javascript
class TrimPath {
  constructor(pathElement) {
    this.path = pathElement;
    this.length = pathElement.getTotalLength();
    this.start = 0;  // {motion.stroke.trim.start-hidden}
    this.end = 1;    // {motion.stroke.trim.end-full}
  }

  setTrim(start, end) {
    this.start = start;
    this.end = end;
    this.update();
  }

  update() {
    const visibleLength = (this.end - this.start) * this.length;
    const offset = this.start * this.length;

    this.path.style.strokeDasharray = `${visibleLength} ${this.length}`;
    this.path.style.strokeDashoffset = -offset;
  }

  animateTrim(startFrom, startTo, endFrom, endTo, duration = 800) {
    const startTime = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.start = startFrom + (startTo - startFrom) * eased;
      this.end = endFrom + (endTo - endFrom) * eased;
      this.update();

      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}

// Wipe across
const trim = new TrimPath(path);
trim.animateTrim(0, 0, 0, 1, 800); // Draw on
// Later...
trim.animateTrim(0, 1, 1, 1, 800); // Erase from start
```

### Dash Animation (Marching Ants)

Moving dash pattern.

**CSS:**
```css
.marching-ants {
  stroke-dasharray: 8 6; /* {motion.stroke.dasharray.dashed} */
  animation: march 2s linear infinite;
  /* {motion.stroke.offset.cycle-normal} */
}

@keyframes march {
  to {
    stroke-dashoffset: -28; /* Sum of dash + gap × 2 */
  }
}
```

**Flow indicator:**
```css
.flow-indicator {
  stroke-dasharray: 20 8; /* {motion.stroke.dasharray.long-dash} */
  animation: flow 800ms linear infinite;
  /* {motion.stroke.offset.cycle-fast} */
}

@keyframes flow {
  to {
    stroke-dashoffset: -28;
  }
}
```

### Handwritten Effect

Natural handwriting simulation.

**JavaScript:**
```javascript
class HandwrittenStroke {
  constructor(pathElement, options = {}) {
    this.path = pathElement;
    this.length = pathElement.getTotalLength();

    this.speedVariation = options.speedVariation || 0.3;
    // {motion.stroke.handwritten.speed-variation.natural}

    this.wobble = options.wobble || 3;
    // {motion.stroke.handwritten.wobble.natural}

    this.duration = options.duration || 1500;
  }

  draw() {
    const length = this.length;
    this.path.style.strokeDasharray = length;
    this.path.style.strokeDashoffset = length;

    const startTime = performance.now();
    const segments = this.generateSpeedCurve();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / this.duration, 1);

      // Apply variable speed
      const adjustedProgress = this.applySpeedCurve(progress, segments);

      // Apply wobble
      const wobbleOffset = Math.sin(progress * 20) * this.wobble * (1 - progress);

      this.path.style.strokeDashoffset = length * (1 - adjustedProgress);
      this.path.style.transform = `translate(${wobbleOffset}px, ${wobbleOffset * 0.5}px)`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  generateSpeedCurve() {
    // Generate random speed variations
    const segments = [];
    let position = 0;

    while (position < 1) {
      const speed = 1 + (Math.random() - 0.5) * 2 * this.speedVariation;
      const segmentLength = 0.1 + Math.random() * 0.1;
      segments.push({ start: position, speed });
      position += segmentLength;
    }

    return segments;
  }

  applySpeedCurve(progress, segments) {
    let result = 0;
    let currentProgress = 0;

    for (const segment of segments) {
      if (progress <= segment.start) break;

      const segmentProgress = Math.min(progress, segment.start + 0.1) - segment.start;
      result += segmentProgress * segment.speed;
      currentProgress = segment.start + 0.1;
    }

    return Math.min(result, 1);
  }
}
```

### Multi-Path Stagger

Drawing multiple paths with stagger.

**CSS:**
```css
.multi-stroke path {
  stroke-dasharray: 500;
  stroke-dashoffset: 500;
  animation: draw 800ms ease-out forwards;
}

.multi-stroke path:nth-child(1) { animation-delay: 0ms; }
.multi-stroke path:nth-child(2) { animation-delay: 150ms; }
/* {motion.stroke.multi-stroke.stagger.sequential} */
.multi-stroke path:nth-child(3) { animation-delay: 300ms; }
.multi-stroke path:nth-child(4) { animation-delay: 450ms; }
```

**GSAP:**
```javascript
function drawMultiplePaths(container, staggerDelay = 150) {
  const paths = container.querySelectorAll('path');

  paths.forEach(path => {
    const length = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length
    });
  });

  gsap.to(paths, {
    strokeDashoffset: 0,
    duration: 0.8,
    stagger: staggerDelay / 1000, // {motion.stroke.multi-stroke.stagger.sequential}
    ease: 'power2.out'
  });
}
```

### Variable Width Stroke (Taper)

Stroke with variable width.

**SVG (Using stroke-width animation):**
```javascript
function taperStroke(pathElement, options = {}) {
  const length = pathElement.getTotalLength();
  const startTaper = options.startTaper || 0;   // {motion.stroke.taper.start.none}
  const endTaper = options.endTaper || 100;      // {motion.stroke.taper.end.full}
  const baseWidth = options.width || 4;

  // Create gradient along path for width simulation
  const segments = 20;
  const segmentPaths = [];

  for (let i = 0; i < segments; i++) {
    const progress = i / segments;
    const nextProgress = (i + 1) / segments;

    // Calculate width at this segment
    let widthMultiplier = 1;

    if (startTaper > 0 && progress < startTaper / 100) {
      widthMultiplier *= progress / (startTaper / 100);
    }

    if (endTaper > 0 && progress > 1 - endTaper / 100) {
      widthMultiplier *= (1 - progress) / (endTaper / 100);
    }

    // Get segment of path
    const startPoint = pathElement.getPointAtLength(progress * length);
    const endPoint = pathElement.getPointAtLength(nextProgress * length);

    segmentPaths.push({
      d: `M${startPoint.x},${startPoint.y} L${endPoint.x},${endPoint.y}`,
      width: baseWidth * widthMultiplier
    });
  }

  return segmentPaths;
}
```

### Stroke Width Animation

Animating stroke thickness.

**CSS:**
```css
.pulse-stroke {
  stroke-width: 2px; /* {motion.stroke.width.normal} */
  animation: stroke-pulse 1s ease-in-out infinite;
}

@keyframes stroke-pulse {
  0%, 100% {
    stroke-width: 2px;
  }
  50% {
    stroke-width: 4px; /* {motion.stroke.width.medium} */
  }
}
```

**Framer Motion:**
```tsx
<motion.path
  d={pathData}
  stroke="#3b82f6"
  fill="none"
  initial={{ strokeWidth: 2, pathLength: 0 }}
  animate={{
    strokeWidth: [2, 4, 2],
    pathLength: 1
  }}
  transition={{
    strokeWidth: { repeat: Infinity, duration: 1 },
    pathLength: { duration: 0.8, ease: 'easeOut' }
  }}
/>
```

### Progress Indicator

Circular progress with stroke.

**CSS:**
```css
.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring circle {
  stroke-dasharray: 314; /* 2 * PI * radius */
  stroke-dashoffset: 314;
  transition: stroke-dashoffset 300ms ease-out;
  stroke-linecap: round; /* {motion.stroke.linecap.round} */
}

.progress-ring[data-progress="25"] circle {
  stroke-dashoffset: 235.5; /* 75% of circumference */
}

.progress-ring[data-progress="50"] circle {
  stroke-dashoffset: 157;
}

.progress-ring[data-progress="75"] circle {
  stroke-dashoffset: 78.5;
}

.progress-ring[data-progress="100"] circle {
  stroke-dashoffset: 0;
}
```

**JavaScript (Dynamic):**
```javascript
function setProgress(circle, percent) {
  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = circumference;
  circle.style.strokeDashoffset = circumference * (1 - percent / 100);
}
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Draw-on animation | Instant appearance |
| Marching ants | Static dashed line |
| Handwritten effect | Instant stroke |
| Progress animation | Instant update |

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .draw-path {
    animation: none;
    stroke-dashoffset: 0;
  }

  .marching-ants {
    animation: none;
  }

  .progress-ring circle {
    transition: none;
  }
}
```

## Cross-References

- See `morphing/` for path shape transitions
- See `reveals/` for element reveal patterns
- See `sequencing/` for stagger timing
- See `opacity/` for fade combinations

## References

- `stroke/stroke-techniques.md` — Advanced stroke techniques
