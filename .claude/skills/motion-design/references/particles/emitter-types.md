# Emitter Types Reference

Different emitter shapes and configurations for particle systems.

## Point Emitter

Particles spawn from a single point.

```javascript
class PointEmitter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getSpawnPosition() {
    return { x: this.x, y: this.y };
  }

  getSpawnVelocity(speed, spread) {
    const angle = (Math.random() - 0.5) * spread * Math.PI / 180;
    return {
      vx: Math.sin(angle) * speed,
      vy: -Math.cos(angle) * speed // Default: upward
    };
  }
}
```

## Line Emitter

Particles spawn along a line.

```javascript
class LineEmitter {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  getSpawnPosition() {
    const t = Math.random();
    return {
      x: this.x1 + (this.x2 - this.x1) * t,
      y: this.y1 + (this.y2 - this.y1) * t
    };
  }

  getSpawnVelocity(speed, spread) {
    // Perpendicular to line
    const dx = this.x2 - this.x1;
    const dy = this.y2 - this.y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = -dy / len; // Normal
    const ny = dx / len;

    const angle = (Math.random() - 0.5) * spread * Math.PI / 180;
    return {
      vx: (nx * Math.cos(angle) - ny * Math.sin(angle)) * speed,
      vy: (nx * Math.sin(angle) + ny * Math.cos(angle)) * speed
    };
  }
}
```

## Circle Edge Emitter

Particles spawn on circle perimeter.

```javascript
class CircleEdgeEmitter {
  constructor(cx, cy, radius) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
  }

  getSpawnPosition() {
    const angle = Math.random() * Math.PI * 2;
    return {
      x: this.cx + Math.cos(angle) * this.radius,
      y: this.cy + Math.sin(angle) * this.radius
    };
  }

  getSpawnVelocity(speed, spread, outward = true) {
    // Direction based on position on circle
    const pos = this.getSpawnPosition();
    const dx = pos.x - this.cx;
    const dy = pos.y - this.cy;
    const len = Math.sqrt(dx * dx + dy * dy);

    const direction = outward ? 1 : -1;
    const baseAngle = Math.atan2(dy, dx);
    const spreadAngle = (Math.random() - 0.5) * spread * Math.PI / 180;

    return {
      vx: Math.cos(baseAngle + spreadAngle) * speed * direction,
      vy: Math.sin(baseAngle + spreadAngle) * speed * direction
    };
  }
}
```

## Circle Filled Emitter

Particles spawn anywhere inside circle.

```javascript
class CircleFilledEmitter {
  constructor(cx, cy, radius) {
    this.cx = cx;
    this.cy = cy;
    this.radius = radius;
  }

  getSpawnPosition() {
    // Uniform distribution inside circle
    const r = this.radius * Math.sqrt(Math.random());
    const angle = Math.random() * Math.PI * 2;
    return {
      x: this.cx + Math.cos(angle) * r,
      y: this.cy + Math.sin(angle) * r
    };
  }
}
```

## Rectangle Edge Emitter

Particles spawn on rectangle perimeter.

```javascript
class RectangleEdgeEmitter {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.perimeter = 2 * (width + height);
  }

  getSpawnPosition() {
    const p = Math.random() * this.perimeter;

    if (p < this.width) {
      return { x: this.x + p, y: this.y }; // Top
    } else if (p < this.width + this.height) {
      return { x: this.x + this.width, y: this.y + (p - this.width) }; // Right
    } else if (p < 2 * this.width + this.height) {
      return { x: this.x + this.width - (p - this.width - this.height), y: this.y + this.height }; // Bottom
    } else {
      return { x: this.x, y: this.y + this.height - (p - 2 * this.width - this.height) }; // Left
    }
  }
}
```

## Rectangle Filled Emitter

Particles spawn anywhere inside rectangle.

```javascript
class RectangleFilledEmitter {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getSpawnPosition() {
    return {
      x: this.x + Math.random() * this.width,
      y: this.y + Math.random() * this.height
    };
  }
}
```

## Cone Emitter (3D-like)

Particles emit in a cone direction.

```javascript
class ConeEmitter {
  constructor(x, y, angle, spread) {
    this.x = x;
    this.y = y;
    this.angle = angle; // Base direction in degrees
    this.spread = spread; // Cone width in degrees
  }

  getSpawnPosition() {
    return { x: this.x, y: this.y };
  }

  getSpawnVelocity(speed) {
    const baseRad = this.angle * Math.PI / 180;
    const spreadRad = (Math.random() - 0.5) * this.spread * Math.PI / 180;
    const finalAngle = baseRad + spreadRad;

    return {
      vx: Math.cos(finalAngle) * speed,
      vy: Math.sin(finalAngle) * speed
    };
  }
}
```

## Path Emitter

Particles spawn along an SVG path.

```javascript
class PathEmitter {
  constructor(pathElement) {
    this.path = pathElement;
    this.length = pathElement.getTotalLength();
  }

  getSpawnPosition() {
    const distance = Math.random() * this.length;
    const point = this.path.getPointAtLength(distance);
    return { x: point.x, y: point.y };
  }

  getSpawnVelocity(speed, perpendicular = true) {
    if (!perpendicular) {
      return { vx: 0, vy: -speed }; // Default upward
    }

    // Get tangent at spawn point for perpendicular velocity
    const distance = Math.random() * this.length;
    const p1 = this.path.getPointAtLength(distance);
    const p2 = this.path.getPointAtLength(distance + 1);

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Perpendicular
    return {
      vx: -dy / len * speed,
      vy: dx / len * speed
    };
  }
}
```

## Text Emitter

Particles spawn in text shape.

```javascript
class TextEmitter {
  constructor(text, font, canvas) {
    this.points = this.getTextPoints(text, font, canvas);
  }

  getTextPoints(text, font, canvas) {
    const ctx = canvas.getContext('2d');
    ctx.font = font;
    ctx.fillText(text, 0, 100);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const points = [];

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const i = (y * canvas.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          points.push({ x, y });
        }
      }
    }

    return points;
  }

  getSpawnPosition() {
    const point = this.points[Math.floor(Math.random() * this.points.length)];
    return { ...point };
  }
}
```

## Image Mask Emitter

Particles spawn where image has opacity.

```javascript
class ImageMaskEmitter {
  constructor(image, canvas) {
    this.points = this.getImagePoints(image, canvas);
  }

  getImagePoints(image, canvas) {
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const points = [];

    for (let y = 0; y < canvas.height; y += 2) {
      for (let x = 0; x < canvas.width; x += 2) {
        const i = (y * canvas.width + x) * 4;
        if (imageData.data[i + 3] > 128) {
          points.push({
            x,
            y,
            color: `rgb(${imageData.data[i]}, ${imageData.data[i+1]}, ${imageData.data[i+2]})`
          });
        }
      }
    }

    return points;
  }

  getSpawnPosition() {
    return this.points[Math.floor(Math.random() * this.points.length)];
  }
}
```

## Composite Emitter

Combine multiple emitters.

```javascript
class CompositeEmitter {
  constructor(emitters, weights = null) {
    this.emitters = emitters;
    this.weights = weights || emitters.map(() => 1 / emitters.length);
  }

  getSpawnPosition() {
    const r = Math.random();
    let cumulative = 0;

    for (let i = 0; i < this.emitters.length; i++) {
      cumulative += this.weights[i];
      if (r <= cumulative) {
        return this.emitters[i].getSpawnPosition();
      }
    }

    return this.emitters[0].getSpawnPosition();
  }
}
```

## Burst Patterns

### Radial Burst

```javascript
function radialBurst(x, y, count, speed) {
  const particles = [];
  const angleStep = (Math.PI * 2) / count;

  for (let i = 0; i < count; i++) {
    const angle = i * angleStep;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    });
  }

  return particles;
}
```

### Cone Burst

```javascript
function coneBurst(x, y, count, speed, direction, spread) {
  const particles = [];
  const halfSpread = spread * Math.PI / 360;
  const baseAngle = direction * Math.PI / 180;

  for (let i = 0; i < count; i++) {
    const angle = baseAngle + (Math.random() - 0.5) * 2 * halfSpread;
    const s = speed * (0.5 + Math.random() * 0.5); // Velocity variation

    particles.push({
      x, y,
      vx: Math.cos(angle) * s,
      vy: Math.sin(angle) * s
    });
  }

  return particles;
}
```

## Performance Tips

1. **Object pooling** — Reuse particle objects instead of creating new ones
2. **Spatial hashing** — For collision detection with many particles
3. **Canvas vs DOM** — Canvas is faster for 100+ particles
4. **Batch rendering** — Draw all particles in single path
5. **Limit active particles** — Cap maximum simultaneous particles
