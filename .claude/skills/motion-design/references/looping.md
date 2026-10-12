
# Looping

Continuous and repeating animation patterns.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org |
| CSS Animations | developer.mozilla.org/CSS/animation-iteration-count |
| GSAP | gsap.com/docs/v3/GSAP/Tween/repeat |

## Quick Reference

Load from: `tokens/looping.tokens.json`

### Loop Durations

| Token | Value | Use |
|-------|-------|-----|
| `fast` | 1s | Active spinners |
| `medium` | 2s | Standard loading |
| `normal` | 3s | Breathing pace |
| `slow` | 5s | Relaxed ambient |
| `ambient` | 8s | Background motion |
| `ultra-slow` | 30s | Cinemagraph subtlety |

### Loop Modes

| Token | CSS Value | Effect |
|-------|-----------|--------|
| `normal` | normal | Restart from beginning |
| `alternate` | alternate | Ping-pong (forward/back) |
| `reverse` | reverse | Play backwards |

## Selection Guide

```
What type of loop?
│
├── LOADING/SPINNER → Continuous rotation or pulse
│   ├── Duration → fast (1s) to medium (2s)
│   └── Mode → normal (continuous)
│
├── BREATHING/PULSE → Oscillating property
│   ├── Duration → normal (3s) to slow (5s)
│   ├── Mode → alternate (ping-pong)
│   └── Amplitude → gentle (0.05) to noticeable (0.1)
│
├── AMBIENT/BACKGROUND → Subtle continuous motion
│   ├── Duration → slow (5s) to ambient (8s)
│   └── Mode → alternate
│
├── IDLE ANIMATION → Character/object at rest
│   ├── Duration → normal (3s)
│   ├── Delay → 3s before starting
│   └── Intensity → subtle (0.3)
│
└── CINEMAGRAPH → Near-static with subtle loop
    ├── Duration → ultra-slow (30s)
    └── Use seamless crossfade for video
```

## Patterns

### Basic Infinite Loop

Simple continuous animation.

**CSS:**
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.spinner {
  animation: spin 1s linear infinite; /* {motion.looping.duration.fast} */
}

/* With count limit */
.spin-few {
  animation: spin 1s linear 3; /* {motion.looping.count.few} */
}
```

**Framer Motion:**
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1, // {motion.looping.duration.fast}
    repeat: Infinity,
    ease: "linear"
  }}
/>
```

**GSAP:**
```javascript
gsap.to(element, {
  rotation: 360,
  duration: 1,
  repeat: -1, // {motion.looping.count.infinite}
  ease: "none"
});
```

### Ping-Pong (Alternate) Loop

Animation plays forward then backward.

**CSS:**
```css
@keyframes breathe {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}

.breathing {
  animation: breathe 3s ease-in-out infinite alternate;
  /* {motion.looping.duration.normal} + {motion.looping.mode.alternate} */
}
```

**Framer Motion:**
```tsx
<motion.div
  animate={{ scale: [1, 1.05, 1] }}
  transition={{
    duration: 3, // {motion.looping.duration.normal}
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

**GSAP:**
```javascript
gsap.to(element, {
  scale: 1.05,
  duration: 1.5, // Half of total cycle
  repeat: -1,
  yoyo: true, // Ping-pong mode
  ease: "sine.inOut"
});
```

### Oscillation (Sine Wave)

Smooth wave-based animation.

**CSS:**
```css
@keyframes oscillate {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.floating {
  animation: oscillate 3s ease-in-out infinite;
}
```

**JavaScript (manual sine wave):**
```javascript
function oscillate(element, amplitude, frequency) {
  let startTime = null;

  function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = (timestamp - startTime) / 1000;

    const value = Math.sin(elapsed * frequency * Math.PI * 2) * amplitude;
    element.style.transform = `translateY(${value}px)`;

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// Usage: oscillate(element, 10, 0.5) // ±10px, 0.5Hz (2s period)
```

**GSAP:**
```javascript
gsap.to(element, {
  y: 10,
  duration: 1.5,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut"
});
```

### Heartbeat Effect

Double-pulse rhythm.

**CSS:**
```css
@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  10% { transform: scale(1.1); }
  20% { transform: scale(1); }
  30% { transform: scale(1.15); }
  40% { transform: scale(1); }
}

.heartbeat {
  animation: heartbeat 1s ease-in-out infinite;
  /* {motion.looping.pulse.heartbeat-normal} */
}
```

**Framer Motion:**
```tsx
const heartbeatVariants = {
  beat: {
    scale: [1, 1.1, 1, 1.15, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      times: [0, 0.1, 0.2, 0.3, 0.4]
    }
  }
};
```

### Breathing Effect

Gentle, natural breathing rhythm.

**CSS:**
```css
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
  }
}

.breathing {
  animation: breathe 4s ease-in-out infinite;
  /* {motion.looping.pulse.breath-normal} */
}
```

**Framer Motion:**
```tsx
<motion.div
  animate={{
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8]
  }}
  transition={{
    duration: 4, // {motion.looping.pulse.breath-normal}
    repeat: Infinity,
    ease: "easeInOut"
  }}
/>
```

### Idle Animation

Motion that starts after inactivity.

**JavaScript:**
```javascript
class IdleAnimation {
  constructor(element, options = {}) {
    this.element = element;
    this.idleDelay = options.delay || 3000; // {motion.looping.idle.delay-before-idle}
    this.animation = null;
    this.timeout = null;

    this.setupListeners();
  }

  setupListeners() {
    ['mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => this.resetIdle());
    });

    this.startIdleTimer();
  }

  startIdleTimer() {
    this.timeout = setTimeout(() => this.startIdle(), this.idleDelay);
  }

  resetIdle() {
    clearTimeout(this.timeout);
    this.stopIdle();
    this.startIdleTimer();
  }

  startIdle() {
    this.animation = gsap.to(this.element, {
      y: 5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }

  stopIdle() {
    if (this.animation) {
      this.animation.kill();
      gsap.to(this.element, { y: 0, duration: 0.3 });
    }
  }
}
```

### Seamless Loop (Video/Complex)

Creating visually seamless loops.

**Crossfade technique:**
```javascript
function createSeamlessLoop(videoElement, crossfadeDuration = 0.5) {
  const duration = videoElement.duration;

  videoElement.addEventListener('timeupdate', () => {
    const remaining = duration - videoElement.currentTime;

    if (remaining <= crossfadeDuration) {
      // Start crossfade to beginning
      const progress = 1 - (remaining / crossfadeDuration);
      // Apply crossfade effect or transition
    }

    if (remaining <= 0.1) {
      videoElement.currentTime = 0;
    }
  });
}
```

**Canvas-based seamless loop:**
```javascript
function seamlessLoopCanvas(frames, canvas, fps = 30) {
  const ctx = canvas.getContext('2d');
  const crossfadeFrames = 15; // Half second at 30fps
  let currentFrame = 0;

  function render() {
    const frame = frames[currentFrame];
    ctx.globalAlpha = 1;
    ctx.drawImage(frame, 0, 0);

    // Crossfade near loop point
    if (currentFrame >= frames.length - crossfadeFrames) {
      const blendFrame = currentFrame - (frames.length - crossfadeFrames);
      const alpha = blendFrame / crossfadeFrames;
      ctx.globalAlpha = alpha;
      ctx.drawImage(frames[blendFrame], 0, 0);
    }

    currentFrame = (currentFrame + 1) % frames.length;
    setTimeout(render, 1000 / fps);
  }

  render();
}
```

### Phase-Offset Loops

Multiple elements looping with offset timing.

**CSS:**
```css
.wave-item {
  animation: wave 2s ease-in-out infinite;
}

.wave-item:nth-child(1) { animation-delay: 0s; }
.wave-item:nth-child(2) { animation-delay: 0.2s; }
.wave-item:nth-child(3) { animation-delay: 0.4s; }
.wave-item:nth-child(4) { animation-delay: 0.6s; }
/* Creates wave effect */

@keyframes wave {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

**GSAP:**
```javascript
gsap.to('.wave-item', {
  y: -10,
  duration: 1,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
  stagger: {
    each: 0.2,
    repeat: -1
  }
});
```

### Cinemagraph Effect

Near-static with subtle looping element.

**CSS (isolated animation):**
```css
.cinemagraph {
  position: relative;
}

.cinemagraph .static {
  /* No animation */
}

.cinemagraph .animated {
  animation: subtleMove 30s ease-in-out infinite;
  /* {motion.looping.duration.ultra-slow} */
}

@keyframes subtleMove {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(3px); }
}
```

## Loop Count Guidelines

| Use Case | Count | Token |
|----------|-------|-------|
| Single emphasis | 1 | once |
| Draw attention | 2-3 | twice, few |
| Temporary state | 5-10 | several, many |
| Continuous | ∞ | infinite |

## Reduced Motion

For `prefers-reduced-motion: reduce`:

| Full Motion | Reduced Alternative |
|-------------|---------------------|
| Spinning loader | Static or very slow (20s+) |
| Breathing/pulse | Static or opacity-only |
| Idle animation | No animation |
| Cinemagraph | Freeze on single frame |

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 20s; /* Very slow, less disorienting */
  }

  .breathing {
    animation: none;
    /* Or opacity-only subtle pulse */
    animation: subtleFade 4s ease-in-out infinite;
  }

  @keyframes subtleFade {
    0%, 100% { opacity: 0.9; }
    50% { opacity: 1; }
  }

  .idle-animation {
    animation: none;
  }
}
```

## Cross-References

- See `rotation/` for spin loop patterns
- See `scale/` for pulse/breathing scale animations
- See `opacity/` for fade loops
- See `procedural/` for noise-based variations
- See `loading-states/` for loader implementations

## References

- `looping/seamless-loop.md` — Seamless loop techniques
