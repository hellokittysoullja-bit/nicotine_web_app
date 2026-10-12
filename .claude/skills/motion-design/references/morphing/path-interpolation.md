# Path Interpolation Reference

Algorithms and techniques for morphing between SVG paths.

## Point Matching Algorithms

### Closest Point Matching

Match each point to its nearest neighbor.

```javascript
function matchClosestPoints(fromPath, toPath) {
  const fromPoints = pathToPoints(fromPath);
  const toPoints = pathToPoints(toPath);

  // Ensure same number of points
  const maxPoints = Math.max(fromPoints.length, toPoints.length);
  const normalizedFrom = subdivideToCount(fromPoints, maxPoints);
  const normalizedTo = subdivideToCount(toPoints, maxPoints);

  // Find optimal rotation to minimize total distance
  let bestRotation = 0;
  let bestDistance = Infinity;

  for (let r = 0; r < normalizedTo.length; r++) {
    const rotated = rotateArray(normalizedTo, r);
    const distance = totalDistance(normalizedFrom, rotated);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestRotation = r;
    }
  }

  return {
    from: normalizedFrom,
    to: rotateArray(normalizedTo, bestRotation)
  };
}

function totalDistance(points1, points2) {
  return points1.reduce((sum, p1, i) => {
    const p2 = points2[i];
    return sum + Math.hypot(p2.x - p1.x, p2.y - p1.y);
  }, 0);
}
```

### Angular Matching

Match points based on angular position from center.

```javascript
function matchAngularPoints(fromPath, toPath) {
  const fromPoints = pathToPoints(fromPath);
  const toPoints = pathToPoints(toPath);

  const fromCenter = getCenter(fromPoints);
  const toCenter = getCenter(toPoints);

  // Calculate angles for each point
  function getAngles(points, center) {
    return points.map(p => ({
      point: p,
      angle: Math.atan2(p.y - center.y, p.x - center.x)
    })).sort((a, b) => a.angle - b.angle);
  }

  const fromAngles = getAngles(fromPoints, fromCenter);
  const toAngles = getAngles(toPoints, toCenter);

  // Match by similar angles
  const matched = fromAngles.map(f => {
    const closest = toAngles.reduce((best, t) => {
      const diff = Math.abs(f.angle - t.angle);
      return diff < best.diff ? { point: t.point, diff } : best;
    }, { point: toAngles[0].point, diff: Infinity });

    return {
      from: f.point,
      to: closest.point
    };
  });

  return matched;
}
```

## Path Subdivision

### Linear Subdivision

Add points evenly along path.

```javascript
function subdivideToCount(points, targetCount) {
  if (points.length >= targetCount) {
    return points.slice(0, targetCount);
  }

  const result = [];
  const totalLength = getPathLength(points);
  const segmentLength = totalLength / (targetCount - 1);

  let currentLength = 0;
  let pointIndex = 0;

  for (let i = 0; i < targetCount; i++) {
    const targetLength = i * segmentLength;

    while (currentLength < targetLength && pointIndex < points.length - 1) {
      const segLen = distance(points[pointIndex], points[pointIndex + 1]);
      if (currentLength + segLen >= targetLength) {
        const t = (targetLength - currentLength) / segLen;
        result.push(lerp(points[pointIndex], points[pointIndex + 1], t));
        break;
      }
      currentLength += segLen;
      pointIndex++;
    }
  }

  // Ensure we have exact count
  while (result.length < targetCount) {
    result.push(points[points.length - 1]);
  }

  return result;
}

function lerp(p1, p2, t) {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}
```

### Bezier Subdivision

Preserve curve smoothness during subdivision.

```javascript
function subdivideBezier(p0, c1, c2, p1, t) {
  // De Casteljau's algorithm
  const p01 = lerp(p0, c1, t);
  const p12 = lerp(c1, c2, t);
  const p23 = lerp(c2, p1, t);

  const p012 = lerp(p01, p12, t);
  const p123 = lerp(p12, p23, t);

  const p0123 = lerp(p012, p123, t);

  return {
    left: { p0, c1: p01, c2: p012, p1: p0123 },
    right: { p0: p0123, c1: p123, c2: p23, p1 }
  };
}

function subdivideBezierPath(segments, subdivisions) {
  const result = [];

  for (const seg of segments) {
    let current = [seg];

    for (let i = 0; i < subdivisions; i++) {
      const next = [];
      for (const s of current) {
        const { left, right } = subdivideBezier(s.p0, s.c1, s.c2, s.p1, 0.5);
        next.push(left, right);
      }
      current = next;
    }

    result.push(...current);
  }

  return result;
}
```

## Interpolation Methods

### Linear Interpolation

Simple point-to-point interpolation.

```javascript
function linearInterpolate(from, to, progress) {
  return from.map((p, i) => ({
    x: p.x + (to[i].x - p.x) * progress,
    y: p.y + (to[i].y - p.y) * progress
  }));
}
```

### Spring Interpolation

Physics-based interpolation.

```javascript
class SpringInterpolator {
  constructor(stiffness = 100, damping = 10, mass = 1) {
    this.stiffness = stiffness;
    this.damping = damping;
    this.mass = mass;
  }

  interpolate(from, to, deltaTime) {
    // For each point
    return from.map((p, i) => {
      const target = to[i];
      const velocity = p.velocity || { x: 0, y: 0 };

      // Spring force
      const dx = target.x - p.x;
      const dy = target.y - p.y;

      const springX = this.stiffness * dx;
      const springY = this.stiffness * dy;

      // Damping force
      const dampX = this.damping * velocity.x;
      const dampY = this.damping * velocity.y;

      // Acceleration
      const ax = (springX - dampX) / this.mass;
      const ay = (springY - dampY) / this.mass;

      // Update velocity
      velocity.x += ax * deltaTime;
      velocity.y += ay * deltaTime;

      return {
        x: p.x + velocity.x * deltaTime,
        y: p.y + velocity.y * deltaTime,
        velocity
      };
    });
  }
}
```

### Catmull-Rom Interpolation

Smooth curve through keyframes.

```javascript
function catmullRom(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x: 0.5 * ((2 * p1.x) +
      (-p0.x + p2.x) * t +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y: 0.5 * ((2 * p1.y) +
      (-p0.y + p2.y) * t +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)
  };
}

function interpolatePathSmooth(keyframes, t) {
  const n = keyframes.length;
  const index = t * (n - 1);
  const i = Math.floor(index);
  const localT = index - i;

  const p0 = keyframes[Math.max(0, i - 1)];
  const p1 = keyframes[i];
  const p2 = keyframes[Math.min(n - 1, i + 1)];
  const p3 = keyframes[Math.min(n - 1, i + 2)];

  return catmullRom(p0, p1, p2, p3, localT);
}
```

## Shape Normalization

### Centering and Scaling

Normalize shapes for better morphing.

```javascript
function normalizeShape(points) {
  // Find bounding box
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  const width = maxX - minX;
  const height = maxY - minY;
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const scale = Math.max(width, height);

  // Normalize to -0.5 to 0.5 range, centered
  return points.map(p => ({
    x: (p.x - centerX) / scale,
    y: (p.y - centerY) / scale
  }));
}

function denormalizeShape(normalizedPoints, targetBounds) {
  const { x, y, width, height } = targetBounds;
  const scale = Math.min(width, height);
  const centerX = x + width / 2;
  const centerY = y + height / 2;

  return normalizedPoints.map(p => ({
    x: p.x * scale + centerX,
    y: p.y * scale + centerY
  }));
}
```

## Path to Points Conversion

### SVG Path Parser

```javascript
function pathToPoints(d, sampleCount = 100) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);

  const length = path.getTotalLength();
  const points = [];

  for (let i = 0; i < sampleCount; i++) {
    const point = path.getPointAtLength((i / (sampleCount - 1)) * length);
    points.push({ x: point.x, y: point.y });
  }

  return points;
}

function pointsToPath(points, closed = true) {
  if (points.length < 2) return '';

  let d = `M${points[0].x},${points[0].y}`;

  // Use smooth curves
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[(i + 1) % points.length];

    // Calculate control points
    const cp1x = prev.x + (curr.x - (points[(i - 2 + points.length) % points.length] || prev).x) / 6;
    const cp1y = prev.y + (curr.y - (points[(i - 2 + points.length) % points.length] || prev).y) / 6;
    const cp2x = curr.x - (next.x - prev.x) / 6;
    const cp2y = curr.y - (next.y - prev.y) / 6;

    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${curr.x},${curr.y}`;
  }

  if (closed) d += ' Z';

  return d;
}
```

## Complete Morph Engine

```javascript
class MorphEngine {
  constructor(options = {}) {
    this.sampleCount = options.sampleCount || 100;
    this.matchMethod = options.matchMethod || 'closest';
  }

  preparePaths(fromD, toD) {
    const fromPoints = pathToPoints(fromD, this.sampleCount);
    const toPoints = pathToPoints(toD, this.sampleCount);

    let matched;
    switch (this.matchMethod) {
      case 'angular':
        matched = matchAngularPoints(fromPoints, toPoints);
        break;
      case 'closest':
      default:
        matched = matchClosestPoints(fromPoints, toPoints);
    }

    return matched;
  }

  interpolate(matched, progress, easing = t => t) {
    const easedProgress = easing(progress);

    const interpolated = matched.from.map((p, i) => ({
      x: p.x + (matched.to[i].x - p.x) * easedProgress,
      y: p.y + (matched.to[i].y - p.y) * easedProgress
    }));

    return pointsToPath(interpolated);
  }

  animate(element, fromD, toD, duration, easing) {
    const matched = this.preparePaths(fromD, toD);
    const startTime = performance.now();

    const update = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      const d = this.interpolate(matched, progress, easing);
      element.setAttribute('d', d);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }
}
```
