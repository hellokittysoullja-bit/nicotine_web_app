
# Particles

Particle system animations for effects and ambiance.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| Canvas API | developer.mozilla.org/Canvas_API |
| PixiJS | pixijs.com/guides/components/sprites |

## Quick Reference

Load from: `tokens/particles.tokens.json`

### Emission Rates

| Token | Value | Use |
|-------|-------|-----|
| `rate-sparse` | 5/s | Occasional particles |
| `rate-normal` | 30/s | Standard emission |
| `rate-dense` | 60/s | Dense field |
| `rate-burst` | 500 | Explosion burst |

### Particle Lifespans

| Token | Value | Use |
|-------|-------|-----|
| `flash` | 100ms | Sparks, quick flashes |
| `short` | 500ms | Quick particles |
| `medium` | 1500ms | Standard |
| `long` | 3000ms | Slow-falling |

### Presets

| Preset | Gravity | Notes |
|--------|---------|-------|
| `confetti` | Light down | Rotation, slow fall |
| `snow` | Gentle down | Drift, long life |
| `sparks` | Normal down | Fast fade, short life |
| `bubbles` | Up (negative) | Wobble, transparent |
| `fire` | Up (negative) | Scale shrink, color shift |
| `smoke` | Up (negative) | Scale grow, fade out |

## Selection Guide

```
What effect?
│
├── CELEBRATION → confetti, sparkles
│   ├── Burst emission (500+)
│   ├── Light gravity (100-200)
│   └── Rotation enabled
│
├── WEATHER → rain, snow
│   ├── Continuous emission (20-60)
│   ├── Long lifespan (3000+)
│   └── Gravity varies (snow: 50, rain: 800)
│
├── FIRE/SMOKE → flames, plumes
│   ├── Continuous emission (30-60)
│   ├── Negative gravity (rise)
│   └── Scale/opacity over life
│
├── IMPACT → sparks, debris
│   ├── Burst emission
│   ├── Short lifespan (100-500)
│   └── High velocity, decay
│
└── AMBIENT → dust, fireflies
    ├── Sparse emission (5-15)
    ├── Long lifespan
    └── Gentle drift
```

## Patterns

### Basic Particle System

Minimal particle implementation.

**JavaScript (Canvas):**
```javascript
class Particle {
  constructor(x, y, config) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * config.velocity;
    this.vy = (Math.random() - 0.5) * config.velocity;
    this.life = config.lifespan;
    this.maxLife = config.lifespan;
    this.size = config.size;
    this.gravity = config.gravity || 0;
  }

  update(dt) {
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= dt * 1000;
  }

  get progress() {
    return 1 - (this.life / this.maxLife);
  }

  get alpha() {
    return 1 - this.progress; // Fade out
  }

  get isAlive() {
    return this.life > 0;
  }
}

class ParticleSystem {
  constructor(canvas, config) {
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.config = {
      rate: 30,        // {motion.particles.emission.rate-normal}
      lifespan: 1500,  // {motion.particles.lifespan.medium}
      velocity: 100,   // {motion.particles.velocity.medium}
      size: 4,         // {motion.particles.size.small}
      gravity: 0,
      ...config
    };
    this.emitting = false;
  }

  emit(x, y, count = 1) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, this.config));
    }
  }

  update(dt) {
    this.particles = this.particles.filter(p => {
      p.update(dt);
      return p.isAlive;
    });
  }

  render() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.particles.forEach(p => {
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    this.ctx.globalAlpha = 1;
  }

  start(x, y) {
    this.emitting = true;
    const emitInterval = 1000 / this.config.rate;

    const emitLoop = setInterval(() => {
      if (!this.emitting) {
        clearInterval(emitLoop);
        return;
      }
      this.emit(x, y);
    }, emitInterval);
  }

  stop() {
    this.emitting = false;
  }
}
```

### Confetti Burst

Celebration confetti effect.

**JavaScript:**
```javascript
class Confetti extends Particle {
  constructor(x, y) {
    super(x, y, {
      velocity: 400,              // {motion.particles.velocity.rapid}
      lifespan: 3000,             // {motion.particles.lifespan.long}
      size: 8,                    // {motion.particles.size.medium}
      gravity: 200                // {motion.particles.gravity.light}
    });

    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 720;
    this.color = this.randomColor();
    this.width = 8 + Math.random() * 8;
    this.height = 4 + Math.random() * 4;

    // Initial burst upward
    this.vy = -200 - Math.random() * 300;
    this.vx = (Math.random() - 0.5) * 400;
  }

  randomColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#95e1d3', '#f38181', '#aa96da'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(dt) {
    super.update(dt);
    this.rotation += this.rotationSpeed * dt;

    // Air resistance
    this.vx *= 0.99;
    this.vy *= 0.99;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
    ctx.restore();
  }
}

function confettiBurst(canvas, x, y, count = 100) {
  const particles = [];
  const ctx = canvas.getContext('2d');

  // Burst emission {motion.particles.emission.rate-burst}
  for (let i = 0; i < count; i++) {
    particles.push(new Confetti(x, y));
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.update(1/60);
      if (p.isAlive) {
        p.render(ctx);
      }
    });

    const alive = particles.filter(p => p.isAlive);
    if (alive.length > 0) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}
```

### Snow Effect

Gentle falling snow.

**JavaScript:**
```javascript
class Snowflake extends Particle {
  constructor(canvasWidth, canvasHeight) {
    const x = Math.random() * canvasWidth;
    const y = -10;

    super(x, y, {
      velocity: 20,               // {motion.particles.velocity.gentle}
      lifespan: 8000,             // {motion.particles.lifespan.extended}
      size: 2 + Math.random() * 4,
      gravity: 50                 // {motion.particles.gravity.float-gentle} (positive = down)
    });

    this.canvasHeight = canvasHeight;
    this.driftAmplitude = 30;
    this.driftSpeed = 0.5 + Math.random() * 0.5;
    this.startX = x;
  }

  update(dt) {
    super.update(dt);

    // Horizontal drift
    const elapsed = (this.maxLife - this.life) / 1000;
    this.x = this.startX + Math.sin(elapsed * this.driftSpeed) * this.driftAmplitude;

    // Reset when off screen
    if (this.y > this.canvasHeight) {
      this.life = 0;
    }
  }
}

function snowEffect(canvas) {
  const particles = [];
  const ctx = canvas.getContext('2d');
  const rate = 30; // {motion.particles.emission.rate-normal}

  setInterval(() => {
    particles.push(new Snowflake(canvas.width, canvas.height));
  }, 1000 / rate);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update(1/60);

      if (!p.isAlive) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = 0.8;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}
```

### Fire/Flame Effect

Rising flame particles.

**JavaScript:**
```javascript
class FireParticle extends Particle {
  constructor(x, y) {
    super(x, y, {
      velocity: 50,
      lifespan: 1000,              // {motion.particles.lifespan.short}
      size: 8,
      gravity: -100                // {motion.particles.gravity.float-up}
    });

    // Spread
    this.vx = (Math.random() - 0.5) * 30;
    this.vy = -50 - Math.random() * 50;
  }

  get color() {
    // Color over life: yellow -> orange -> red -> transparent
    const p = this.progress;
    if (p < 0.25) return `rgba(255, 255, 100, ${1 - p * 2})`;
    if (p < 0.5) return `rgba(255, 180, 50, ${1 - p})`;
    return `rgba(255, 80, 20, ${1 - p})`;
  }

  get currentSize() {
    // Scale over life: shrink
    return this.size * (1 - this.progress * 0.7);
  }
}

function fireEffect(canvas, x, y) {
  const particles = [];
  const ctx = canvas.getContext('2d');
  const rate = 60; // {motion.particles.emission.rate-dense}

  setInterval(() => {
    const spreadX = x + (Math.random() - 0.5) * 20;
    particles.push(new FireParticle(spreadX, y));
  }, 1000 / rate);

  function animate() {
    // Semi-transparent clear for trail effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update(1/60);

      if (!p.isAlive) {
        particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.currentSize, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  animate();
}
```

### CSS-Only Particles

Simple CSS particle animation.

**CSS:**
```css
.particle-container {
  position: relative;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 8px;
  height: 8px;
  background: white;
  border-radius: 50%;
  animation: particle-rise 3s ease-out forwards;
}

@keyframes particle-rise {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-200px) scale(0.5);
  }
}

/* Staggered particles */
.particle:nth-child(1) { left: 20%; animation-delay: 0s; }
.particle:nth-child(2) { left: 40%; animation-delay: 0.2s; }
.particle:nth-child(3) { left: 60%; animation-delay: 0.1s; }
.particle:nth-child(4) { left: 80%; animation-delay: 0.3s; }
```

## Libraries

### tsParticles
```javascript
import { tsParticles } from "tsparticles-engine";

tsParticles.load("particles", {
  particles: {
    number: { value: 50 },
    size: { value: 3 },
    move: {
      enable: true,
      speed: 2,
      direction: "none"
    },
    opacity: {
      value: 0.5,
      animation: { enable: true, minimumValue: 0.1 }
    }
  }
});
```

### Framer Motion + React
```tsx
function Particle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="particle"
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0],
        y: -200,
        scale: [0, 1, 0.5]
      }}
      transition={{
        duration: 2,
        delay,
        ease: "easeOut"
      }}
    />
  );
}
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Particle animation | Static decorative elements |
| Confetti burst | Color flash or none |
| Continuous particles | Very sparse or disabled |

**Implementation:**
```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // Disable particle effects or use static alternative
  return;
}
```

## Cross-References

- See `procedural/` for noise-based particle motion
- See `looping/` for continuous particle effects
- See `glow-shadow/` for particle glow effects
- See `opacity/` for particle fade patterns

## References

- `particles/emitter-types.md` — Emitter shape implementations
