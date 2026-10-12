# Stroke Techniques Reference

Advanced stroke animation techniques and implementations.

## Path Length Calculation

### Getting Accurate Path Length

```javascript
function getPathLength(pathElement) {
  // Native SVG method
  if (pathElement.getTotalLength) {
    return pathElement.getTotalLength();
  }

  // Fallback for non-SVG elements
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathElement.getAttribute('d'));
  return path.getTotalLength();
}

// For multiple paths
function getAllPathLengths(container) {
  const paths = container.querySelectorAll('path, line, polyline, polygon, circle, ellipse, rect');
  return Array.from(paths).map(p => ({
    element: p,
    length: getShapeLength(p)
  }));
}

function getShapeLength(element) {
  const tag = element.tagName.toLowerCase();

  switch (tag) {
    case 'path':
      return element.getTotalLength();
    case 'line':
      const x1 = parseFloat(element.getAttribute('x1'));
      const y1 = parseFloat(element.getAttribute('y1'));
      const x2 = parseFloat(element.getAttribute('x2'));
      const y2 = parseFloat(element.getAttribute('y2'));
      return Math.hypot(x2 - x1, y2 - y1);
    case 'circle':
      return 2 * Math.PI * parseFloat(element.getAttribute('r'));
    case 'ellipse':
      const rx = parseFloat(element.getAttribute('rx'));
      const ry = parseFloat(element.getAttribute('ry'));
      return Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
    case 'rect':
      const w = parseFloat(element.getAttribute('width'));
      const h = parseFloat(element.getAttribute('height'));
      return 2 * (w + h);
    case 'polygon':
    case 'polyline':
      const points = element.getAttribute('points').trim().split(/\s+|,/);
      let length = 0;
      for (let i = 0; i < points.length - 2; i += 2) {
        length += Math.hypot(
          parseFloat(points[i + 2]) - parseFloat(points[i]),
          parseFloat(points[i + 3]) - parseFloat(points[i + 1])
        );
      }
      if (tag === 'polygon') {
        length += Math.hypot(
          parseFloat(points[0]) - parseFloat(points[points.length - 2]),
          parseFloat(points[1]) - parseFloat(points[points.length - 1])
        );
      }
      return length;
    default:
      return 0;
  }
}
```

## Advanced Draw Effects

### Speed Variation (Handwritten)

```javascript
class HandwrittenDraw {
  constructor(path, options = {}) {
    this.path = path;
    this.length = path.getTotalLength();

    this.duration = options.duration || 2000;
    this.speedVariation = options.speedVariation || 0.3;
    this.wobbleAmount = options.wobble || 2;
    this.pressureVariation = options.pressure || 0.2;

    this.prepare();
  }

  prepare() {
    this.path.style.strokeDasharray = this.length;
    this.path.style.strokeDashoffset = this.length;

    // Generate speed curve
    this.speedCurve = this.generateSpeedCurve();
  }

  generateSpeedCurve() {
    const segments = 50;
    const curve = [];

    for (let i = 0; i < segments; i++) {
      // Random speed variation
      const baseSpeed = 1;
      const variation = (Math.random() - 0.5) * 2 * this.speedVariation;

      // Slow down at corners (detected by path curvature)
      const curvature = this.getCurvatureAt(i / segments);
      const cornerSlowdown = 1 - curvature * 0.5;

      curve.push(baseSpeed + variation * cornerSlowdown);
    }

    return curve;
  }

  getCurvatureAt(t) {
    const delta = 0.01;
    const p1 = this.path.getPointAtLength(Math.max(0, t - delta) * this.length);
    const p2 = this.path.getPointAtLength(t * this.length);
    const p3 = this.path.getPointAtLength(Math.min(1, t + delta) * this.length);

    const dx1 = p2.x - p1.x;
    const dy1 = p2.y - p1.y;
    const dx2 = p3.x - p2.x;
    const dy2 = p3.y - p2.y;

    const angle1 = Math.atan2(dy1, dx1);
    const angle2 = Math.atan2(dy2, dx2);

    return Math.abs(angle2 - angle1) / Math.PI;
  }

  draw() {
    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      let progress = Math.min(elapsed / this.duration, 1);

      // Apply speed curve
      progress = this.applySpeedCurve(progress);

      // Calculate offset
      const offset = this.length * (1 - progress);
      this.path.style.strokeDashoffset = offset;

      // Apply wobble
      const wobble = Math.sin(progress * 30) * this.wobbleAmount * (1 - progress);
      this.path.style.transform = `translate(${wobble}px, ${wobble * 0.5}px)`;

      // Apply pressure (stroke width variation)
      const pressure = 1 + Math.sin(progress * 20) * this.pressureVariation;
      this.path.style.strokeWidth = `${parseFloat(getComputedStyle(this.path).strokeWidth) * pressure}px`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  applySpeedCurve(linearProgress) {
    // Integrate speed curve to get actual progress
    const segment = Math.floor(linearProgress * (this.speedCurve.length - 1));
    const localProgress = (linearProgress * (this.speedCurve.length - 1)) - segment;

    let accumulatedProgress = 0;
    const normalizedSpeeds = this.normalizeSpeedCurve();

    for (let i = 0; i < segment; i++) {
      accumulatedProgress += normalizedSpeeds[i] / this.speedCurve.length;
    }

    accumulatedProgress += normalizedSpeeds[segment] * localProgress / this.speedCurve.length;

    return Math.min(1, accumulatedProgress);
  }

  normalizeSpeedCurve() {
    const total = this.speedCurve.reduce((a, b) => a + b, 0);
    return this.speedCurve.map(s => s / total * this.speedCurve.length);
  }
}
```

### Ink Drip Effect

```javascript
class InkDrip {
  constructor(path, options = {}) {
    this.path = path;
    this.length = path.getTotalLength();
    this.dripProbability = options.dripProbability || 0.1;
    this.dripSize = options.dripSize || 5;

    this.drips = [];
    this.container = path.parentElement;
  }

  draw(duration = 2000) {
    const startTime = performance.now();

    this.path.style.strokeDasharray = this.length;
    this.path.style.strokeDashoffset = this.length;

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);

      // Update main stroke
      this.path.style.strokeDashoffset = this.length * (1 - progress);

      // Maybe create drip at current position
      if (Math.random() < this.dripProbability * 0.1) {
        this.createDrip(progress);
      }

      // Update existing drips
      this.updateDrips(time);

      if (progress < 1 || this.drips.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  createDrip(progress) {
    const point = this.path.getPointAtLength(progress * this.length);

    const drip = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    drip.setAttribute('cx', point.x);
    drip.setAttribute('cy', point.y);
    drip.setAttribute('r', this.dripSize * Math.random());
    drip.setAttribute('fill', getComputedStyle(this.path).stroke);

    this.container.appendChild(drip);

    this.drips.push({
      element: drip,
      x: point.x,
      y: point.y,
      vy: 0,
      size: parseFloat(drip.getAttribute('r')),
      life: 1
    });
  }

  updateDrips(time) {
    for (let i = this.drips.length - 1; i >= 0; i--) {
      const drip = this.drips[i];

      // Gravity
      drip.vy += 0.5;
      drip.y += drip.vy;

      // Shrink
      drip.life -= 0.02;
      drip.size *= 0.98;

      drip.element.setAttribute('cy', drip.y);
      drip.element.setAttribute('r', drip.size);
      drip.element.setAttribute('opacity', drip.life);

      if (drip.life <= 0) {
        drip.element.remove();
        this.drips.splice(i, 1);
      }
    }
  }
}
```

## Dash Pattern Effects

### Animated Dash Array

```javascript
class DashAnimator {
  constructor(path, options = {}) {
    this.path = path;
    this.patterns = options.patterns || [
      '10 5',
      '20 10',
      '5 15 10 15',
      '15 5 5 5'
    ];
    this.duration = options.duration || 1000;
  }

  morphPattern(fromPattern, toPattern, progress) {
    const from = fromPattern.split(' ').map(Number);
    const to = toPattern.split(' ').map(Number);

    // Extend shorter array
    const maxLength = Math.max(from.length, to.length);
    while (from.length < maxLength) from.push(from[from.length - 1] || 0);
    while (to.length < maxLength) to.push(to[to.length - 1] || 0);

    const result = from.map((v, i) => v + (to[i] - v) * progress);
    return result.join(' ');
  }

  animate() {
    let currentIndex = 0;

    const transition = () => {
      const fromPattern = this.patterns[currentIndex];
      const toPattern = this.patterns[(currentIndex + 1) % this.patterns.length];

      const startTime = performance.now();

      const update = (time) => {
        const progress = Math.min((time - startTime) / this.duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        this.path.style.strokeDasharray = this.morphPattern(fromPattern, toPattern, eased);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          currentIndex = (currentIndex + 1) % this.patterns.length;
          setTimeout(transition, 500);
        }
      };

      requestAnimationFrame(update);
    };

    transition();
  }
}
```

### Traveling Segment

```javascript
class TravelingSegment {
  constructor(path, options = {}) {
    this.path = path;
    this.length = path.getTotalLength();
    this.segmentLength = options.segmentLength || this.length * 0.2;
    this.speed = options.speed || 2000; // ms for full cycle
  }

  start() {
    const animate = (time) => {
      const progress = (time % this.speed) / this.speed;

      // Position of segment
      const startPos = progress * this.length;
      const endPos = startPos + this.segmentLength;

      // Wrap around
      if (endPos > this.length) {
        // Two segments: end of path + beginning
        this.path.style.strokeDasharray = `
          ${endPos - this.length}
          ${this.length - endPos + startPos}
          ${this.length - startPos}
        `;
        this.path.style.strokeDashoffset = 0;
      } else {
        this.path.style.strokeDasharray = `
          0 ${startPos} ${this.segmentLength} ${this.length}
        `;
        this.path.style.strokeDashoffset = 0;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}
```

## Pressure Simulation

### Variable Width Stroke

```javascript
class VariableWidthStroke {
  constructor(originalPath, options = {}) {
    this.originalPath = originalPath;
    this.length = originalPath.getTotalLength();
    this.baseWidth = options.baseWidth || 4;
    this.segments = options.segments || 50;

    this.pressureCurve = options.pressureCurve || this.generateDefaultPressure();
  }

  generateDefaultPressure() {
    // Taper at start and end
    return (t) => {
      const startTaper = Math.min(t * 5, 1);
      const endTaper = Math.min((1 - t) * 5, 1);
      return startTaper * endTaper;
    };
  }

  render(container) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    for (let i = 0; i < this.segments; i++) {
      const t = i / this.segments;
      const nextT = (i + 1) / this.segments;

      const p1 = this.originalPath.getPointAtLength(t * this.length);
      const p2 = this.originalPath.getPointAtLength(nextT * this.length);

      const width = this.baseWidth * this.pressureCurve(t);

      const segment = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      segment.setAttribute('x1', p1.x);
      segment.setAttribute('y1', p1.y);
      segment.setAttribute('x2', p2.x);
      segment.setAttribute('y2', p2.y);
      segment.setAttribute('stroke', getComputedStyle(this.originalPath).stroke);
      segment.setAttribute('stroke-width', width);
      segment.setAttribute('stroke-linecap', 'round');

      group.appendChild(segment);
    }

    container.appendChild(group);
    this.originalPath.style.display = 'none';

    return group;
  }

  animateDraw(duration = 2000) {
    const segments = this.render(this.originalPath.parentElement).children;
    const startTime = performance.now();

    Array.from(segments).forEach(seg => {
      seg.style.opacity = 0;
    });

    const animate = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const visibleCount = Math.floor(progress * segments.length);

      for (let i = 0; i < segments.length; i++) {
        segments[i].style.opacity = i <= visibleCount ? 1 : 0;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
```

## Text Path Animation

### Text Following Path with Draw Effect

```javascript
class TextOnPath {
  constructor(text, path, options = {}) {
    this.text = text;
    this.path = path;
    this.fontSize = options.fontSize || 16;
    this.letterSpacing = options.letterSpacing || 0;
  }

  create(container) {
    const textPath = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    const textPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');

    textPathElement.setAttribute('href', `#${this.path.id}`);
    textPathElement.textContent = this.text;
    textPathElement.style.fontSize = `${this.fontSize}px`;
    textPathElement.style.letterSpacing = `${this.letterSpacing}px`;

    textPath.appendChild(textPathElement);
    container.appendChild(textPath);

    return textPathElement;
  }

  animateReveal(textPathElement, duration = 2000) {
    const chars = this.text.split('');
    textPathElement.textContent = '';

    chars.forEach((char, i) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.textContent = char;
      tspan.style.opacity = 0;
      textPathElement.appendChild(tspan);
    });

    const tspans = textPathElement.querySelectorAll('tspan');
    const staggerDelay = duration / chars.length;

    tspans.forEach((tspan, i) => {
      setTimeout(() => {
        tspan.animate([
          { opacity: 0, transform: 'scale(0.5)' },
          { opacity: 1, transform: 'scale(1)' }
        ], {
          duration: 200,
          fill: 'forwards',
          easing: 'ease-out'
        });
      }, i * staggerDelay);
    });
  }
}
```
