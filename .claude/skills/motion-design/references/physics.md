
# Physics

Realistic physics simulation for natural-feeling animations.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| Framer Motion Spring | motion.dev/docs/spring |
| React Spring | react-spring.dev |
| Matter.js | brm.io/matter-js |

## Quick Reference

Load from: `tokens/physics.tokens.json`

### Gravity Values

| Token | Value | Use |
|-------|-------|-----|
| `gravity.none` | 0 | Floating/space |
| `gravity.moon` | 1.62 | Slow, floaty |
| `gravity.earth` | 9.81 | Realistic |
| `gravity.heavy` | 19.6 | Punchy falls |

### Friction Levels

| Token | Value | Use |
|-------|-------|-----|
| `friction.none` | 0 | Frictionless |
| `friction.ice` | 0.03 | Slippery |
| `friction.medium` | 0.3 | Normal surface |
| `friction.sticky` | 0.9 | High resistance |

### Bounce (Restitution)

| Token | Value | Use |
|-------|-------|-----|
| `bounce.none` | 0 | No bounce (clay) |
| `bounce.low` | 0.3 | Tennis ball |
| `bounce.medium` | 0.5 | Basketball |
| `bounce.super` | 0.9 | Superball |

### Spring Presets

| Token | Stiffness | Damping | Use |
|-------|-----------|---------|-----|
| `spring.soft` | 100 | 10 | Gentle, slow |
| `spring.medium` | 200 | 20 | Balanced |
| `spring.stiff` | 400 | 30 | Quick, snappy |
| `spring.bouncy` | 300 | 10 | Oscillates |

## Selection Guide

```
What type of motion?
│
├── FALLING OBJECT → Gravity-based
│   ├── Floating/slow → gravity.moon (1.62)
│   ├── Realistic → gravity.earth (9.81)
│   └── Heavy/punchy → gravity.heavy (19.6)
│
├── SLIDING → Friction-based
│   ├── Ice/slippery → friction.ice (0.03)
│   ├── Normal surface → friction.medium (0.3)
│   └── Sticky/resistant → friction.sticky (0.9)
│
├── BOUNCING → Restitution-based
│   ├── Dead drop → bounce.none (0)
│   ├── Soft bounce → bounce.low (0.3)
│   ├── Good bounce → bounce.medium (0.5)
│   └── Super bouncy → bounce.super (0.9)
│
├── SPRING ANIMATION → Spring physics
│   ├── Gentle/slow → spring.soft
│   ├── Balanced → spring.medium
│   ├── Snappy → spring.stiff
│   └── Bouncy → spring.bouncy
│
└── THROWING → Velocity + damping
    ├── Gentle toss → velocity.slow + damping.light
    ├── Normal throw → velocity.moderate + damping.medium
    └── Fast throw → velocity.fast + damping.light
```

## Patterns

### Gravity Drop

Object falls under gravity influence.

**JavaScript Physics:**
```javascript
class GravityDrop {
  constructor(element, options = {}) {
    this.element = element;
    this.y = 0;
    this.velocityY = 0;
    this.gravity = options.gravity || 9.81; // {motion.physics.gravity.earth}
    this.bounce = options.bounce || 0.5; // {motion.physics.bounce.medium}
    this.floorY = options.floorY || 400;
    this.damping = options.damping || 0.99;
  }

  update(deltaTime) {
    // Apply gravity
    this.velocityY += this.gravity * deltaTime;

    // Update position
    this.y += this.velocityY;

    // Bounce off floor
    if (this.y >= this.floorY) {
      this.y = this.floorY;
      this.velocityY *= -this.bounce; // {motion.physics.bounce.medium}

      // Apply damping on bounce
      this.velocityY *= this.damping;
    }

    this.element.style.transform = `translateY(${this.y}px)`;
  }
}
```

**Framer Motion:**
```tsx
import { motion } from 'framer-motion';

const GravityDrop = () => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: 400 }}
    transition={{
      type: 'spring',
      stiffness: 100, // {motion.physics.spring.soft}
      damping: 10,
      mass: 1
    }}
  />
);
```

**GSAP:**
```javascript
gsap.to(element, {
  y: 400,
  duration: 1,
  ease: "bounce.out" // Built-in bounce approximation
});

// Custom physics simulation
function simulateDrop(element, groundY = 400) {
  let y = 0;
  let vy = 0;
  const gravity = 9.81 * 50; // {motion.physics.gravity.earth} scaled
  const bounce = 0.5; // {motion.physics.bounce.medium}

  function tick() {
    vy += gravity / 60;
    y += vy / 60;

    if (y >= groundY) {
      y = groundY;
      vy *= -bounce;
    }

    gsap.set(element, { y });

    if (Math.abs(vy) > 0.1 || y < groundY) {
      requestAnimationFrame(tick);
    }
  }

  tick();
}
```

### Sliding with Friction

Object slides and decelerates due to friction.

**JavaScript:**
```javascript
class Slider {
  constructor(element, options = {}) {
    this.element = element;
    this.x = 0;
    this.velocityX = options.initialVelocity || 400; // {motion.physics.velocity.moderate}
    this.friction = options.friction || 0.3; // {motion.physics.friction.medium}
  }

  update() {
    // Apply friction
    const frictionForce = this.friction * Math.sign(this.velocityX);
    this.velocityX -= frictionForce;

    // Stop when velocity is negligible
    if (Math.abs(this.velocityX) < 0.5) {
      this.velocityX = 0;
      return false; // Animation complete
    }

    this.x += this.velocityX / 60;
    this.element.style.transform = `translateX(${this.x}px)`;
    return true; // Continue animating
  }
}
```

**Framer Motion (Drag with inertia):**
```tsx
<motion.div
  drag="x"
  dragMomentum={true}
  dragElastic={0.1}
  dragTransition={{
    power: 0.3, // friction equivalent
    timeConstant: 200 // momentum duration
  }}
/>
```

### Bouncing Ball

Full bounce physics with decay.

**JavaScript:**
```javascript
class BouncingBall {
  constructor(element, options = {}) {
    this.element = element;
    this.x = 0;
    this.y = 0;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.gravity = options.gravity || 9.81 * 50; // {motion.physics.gravity.earth}
    this.bounce = options.bounce || 0.7; // {motion.physics.bounce.high}
    this.friction = options.friction || 0.3; // {motion.physics.friction.medium}
    this.floorY = options.floorY || 400;
    this.wallLeft = 0;
    this.wallRight = options.wallRight || 600;
  }

  update(dt = 1/60) {
    // Apply gravity
    this.vy += this.gravity * dt;

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Floor bounce
    if (this.y >= this.floorY) {
      this.y = this.floorY;
      this.vy *= -this.bounce;
      this.vx *= (1 - this.friction * 0.5); // Friction on bounce
    }

    // Wall bounces
    if (this.x <= this.wallLeft || this.x >= this.wallRight) {
      this.vx *= -this.bounce;
      this.x = Math.max(this.wallLeft, Math.min(this.wallRight, this.x));
    }

    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }
}
```

**GSAP Custom Plugin approach:**
```javascript
// Simplified bounce effect
gsap.timeline({ repeat: 0 })
  .to(element, {
    y: 400,
    duration: 0.5,
    ease: "power1.in" // accelerating (gravity)
  })
  .to(element, {
    y: 200, // Bounce height = 400 * 0.7 * 0.7 ≈ 200
    duration: 0.35,
    ease: "power1.out"
  })
  .to(element, {
    y: 400,
    duration: 0.35,
    ease: "power1.in"
  })
  .to(element, {
    y: 350,
    duration: 0.2,
    ease: "power1.out"
  })
  .to(element, {
    y: 400,
    duration: 0.2,
    ease: "power1.in"
  });
```

### Spring Animation

Spring-based motion with configurable physics.

**Framer Motion:**
```tsx
// Soft spring - gentle, slow
<motion.div
  animate={{ x: 200 }}
  transition={{
    type: 'spring',
    stiffness: 100, // {motion.physics.spring.soft}
    damping: 10,
    mass: 1
  }}
/>

// Stiff spring - quick, snappy
<motion.div
  animate={{ x: 200 }}
  transition={{
    type: 'spring',
    stiffness: 400, // {motion.physics.spring.stiff}
    damping: 30,
    mass: 1
  }}
/>

// Bouncy spring - oscillates
<motion.div
  animate={{ x: 200 }}
  transition={{
    type: 'spring',
    stiffness: 300, // {motion.physics.spring.bouncy}
    damping: 10,
    mass: 1
  }}
/>
```

**React Spring:**
```tsx
import { useSpring, animated } from '@react-spring/web';

const SpringAnimation = () => {
  const [springs, api] = useSpring(() => ({
    from: { x: 0 },
    to: { x: 200 },
    config: {
      tension: 200, // stiffness equivalent
      friction: 20, // damping equivalent
      mass: 1
    }
  }));

  return <animated.div style={springs} />;
};
```

### Momentum Scroll

Physics-based scroll with inertia.

**JavaScript:**
```javascript
class MomentumScroll {
  constructor(container) {
    this.container = container;
    this.scrollY = 0;
    this.velocityY = 0;
    this.damping = 0.95; // {motion.physics.damping.light}
    this.isDragging = false;
    this.lastY = 0;

    this.bindEvents();
  }

  bindEvents() {
    this.container.addEventListener('mousedown', e => this.onStart(e.clientY));
    window.addEventListener('mousemove', e => this.onMove(e.clientY));
    window.addEventListener('mouseup', () => this.onEnd());
  }

  onStart(y) {
    this.isDragging = true;
    this.lastY = y;
    this.velocityY = 0;
  }

  onMove(y) {
    if (!this.isDragging) return;
    const dy = y - this.lastY;
    this.velocityY = dy;
    this.scrollY += dy;
    this.lastY = y;
    this.render();
  }

  onEnd() {
    this.isDragging = false;
    this.decelerate();
  }

  decelerate() {
    if (Math.abs(this.velocityY) < 0.5) return;

    this.velocityY *= this.damping;
    this.scrollY += this.velocityY;
    this.render();

    requestAnimationFrame(() => this.decelerate());
  }

  render() {
    this.container.scrollTop = -this.scrollY;
  }
}
```

### Throw/Fling Animation

Object thrown with initial velocity.

**Framer Motion:**
```tsx
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const Throwable = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleDragEnd = (_, info) => {
    // Use velocity from drag gesture
    const vx = info.velocity.x;
    const vy = info.velocity.y;

    // Animate with momentum
    animate(x, x.get() + vx * 0.5, {
      type: 'tween',
      duration: Math.abs(vx) / 1000,
      ease: [0.2, 0, 0, 1]
    });

    animate(y, y.get() + vy * 0.5 + 200, { // Add gravity
      type: 'tween',
      duration: 0.5,
      ease: [0, 0, 0.58, 1]
    });
  };

  return (
    <motion.div
      style={{ x, y }}
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
    />
  );
};
```

## Remotion Implementation

```tsx
import { useCurrentFrame, interpolate, spring } from 'remotion';

export const PhysicsBounce: React.FC = () => {
  const frame = useCurrentFrame();

  // Simulate bounce with multiple springs
  const bounce1 = spring({
    frame,
    fps: 30,
    config: {
      stiffness: 100, // {motion.physics.spring.soft}
      damping: 5,
      mass: 1
    },
    durationInFrames: 30
  });

  const y = interpolate(
    bounce1,
    [0, 1],
    [0, 300],
    { extrapolateRight: 'clamp' }
  );

  // Squash on impact
  const squash = frame > 15 && frame < 25
    ? interpolate(frame, [15, 20, 25], [1, 1.3, 1])
    : 1;

  return (
    <div
      style={{
        transform: `translateY(${y}px) scaleY(${1/squash}) scaleX(${squash})`,
        transformOrigin: 'bottom center'
      }}
    />
  );
};
```

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Bouncing animation | Direct position change |
| Spring oscillation | Simple ease-out tween |
| Momentum scroll | Standard scroll behavior |
| Throw animation | Fade to final position |

**Implementation:**
```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

function animateWithPhysics(element, target) {
  if (prefersReducedMotion) {
    // Simple tween without physics
    gsap.to(element, {
      ...target,
      duration: 0.3,
      ease: 'power2.out'
    });
  } else {
    // Full physics simulation
    simulatePhysics(element, target);
  }
}
```

## Cross-References

- See `spring/` for spring configuration tokens
- See `easing/` for easing curve alternatives
- See `squash-stretch/` for deformation during impact
- See `anticipation/` for wind-up before throws
- See `follow-through/` for continued motion after action
- See `particles/` for physics-based particle systems
- See `gesture-motion/` for touch-based physics

## References

- No additional references needed for this skill
