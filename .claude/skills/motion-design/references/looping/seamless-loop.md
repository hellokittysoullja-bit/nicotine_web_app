# Seamless Loop Techniques

Methods for creating visually seamless looping animations.

## Position/Transform Loops

### Linear Motion Loop

Element moves continuously without visible restart.

```javascript
// Infinite scroll effect
function infiniteScroll(container, speed = 50) {
  const content = container.querySelector('.content');
  const clone = content.cloneNode(true);
  container.appendChild(clone);

  let position = 0;
  const contentWidth = content.offsetWidth;

  function animate() {
    position -= speed / 60; // pixels per frame at 60fps

    if (Math.abs(position) >= contentWidth) {
      position = 0;
    }

    container.style.transform = `translateX(${position}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}
```

### Circular/Orbital Loop

Rotation-based seamless motion.

```css
@keyframes orbit {
  from { transform: rotate(0deg) translateX(100px) rotate(0deg); }
  to { transform: rotate(360deg) translateX(100px) rotate(-360deg); }
}

.orbiting {
  animation: orbit 5s linear infinite;
}
```

### Figure-8 Loop

Complex path that returns to start.

```javascript
function figureEight(element, width, height, duration) {
  gsap.to(element, {
    motionPath: {
      path: [
        { x: 0, y: 0 },
        { x: width/2, y: -height/2 },
        { x: width, y: 0 },
        { x: width/2, y: height/2 },
        { x: 0, y: 0 }
      ],
      curviness: 1.5
    },
    duration: duration,
    repeat: -1,
    ease: "none"
  });
}
```

## Oscillation Loops

### Perfect Sine Wave

Mathematical sine for truly seamless oscillation.

```javascript
function sineOscillation(element, amplitude, frequency) {
  let time = 0;

  function animate() {
    time += 1/60; // Assuming 60fps
    const value = Math.sin(time * frequency * Math.PI * 2) * amplitude;
    element.style.transform = `translateY(${value}px)`;
    requestAnimationFrame(animate);
  }

  animate();
}
```

### Multi-Property Oscillation

Different properties at different frequencies.

```javascript
function complexOscillation(element, config) {
  let time = 0;

  function animate() {
    time += 1/60;

    const y = Math.sin(time * config.yFreq * Math.PI * 2) * config.yAmp;
    const rotate = Math.sin(time * config.rotFreq * Math.PI * 2) * config.rotAmp;
    const scale = 1 + Math.sin(time * config.scaleFreq * Math.PI * 2) * config.scaleAmp;

    element.style.transform = `translateY(${y}px) rotate(${rotate}deg) scale(${scale})`;
    requestAnimationFrame(animate);
  }

  animate();
}

// Usage
complexOscillation(element, {
  yFreq: 0.3, yAmp: 10,
  rotFreq: 0.2, rotAmp: 3,
  scaleFreq: 0.4, scaleAmp: 0.02
});
```

## Video/Frame Loops

### Crossfade Loop

Blend end back into beginning.

```javascript
class CrossfadeLoop {
  constructor(video, crossfadeDuration = 0.5) {
    this.video = video;
    this.crossfade = crossfadeDuration;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.setup();
  }

  setup() {
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // Replace video with canvas
    this.video.parentNode.insertBefore(this.canvas, this.video);
    this.video.style.display = 'none';

    this.video.loop = false;
    this.video.addEventListener('timeupdate', () => this.render());
    this.video.play();
  }

  render() {
    const { currentTime, duration } = this.video;
    const remaining = duration - currentTime;

    // Draw current frame
    this.ctx.globalAlpha = 1;
    this.ctx.drawImage(this.video, 0, 0);

    // Crossfade near end
    if (remaining <= this.crossfade) {
      const blendProgress = 1 - (remaining / this.crossfade);

      // Seek to equivalent position at start
      const startTime = remaining;
      this.video.currentTime = startTime;

      // Wait for seek, then blend
      this.ctx.globalAlpha = blendProgress;
      this.ctx.drawImage(this.video, 0, 0);
    }

    if (remaining <= 0.05) {
      this.video.currentTime = 0;
    }
  }
}
```

### Frame Sequence Loop

Sprite sheet or image sequence.

```javascript
class FrameLoop {
  constructor(frames, canvas, fps = 24) {
    this.frames = frames;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fps = fps;
    this.currentFrame = 0;
    this.crossfadeFrames = Math.floor(fps / 2); // 0.5s crossfade

    this.start();
  }

  start() {
    setInterval(() => this.render(), 1000 / this.fps);
  }

  render() {
    const frame = this.frames[this.currentFrame];

    // Draw current frame
    this.ctx.globalAlpha = 1;
    this.ctx.drawImage(frame, 0, 0);

    // Crossfade near loop point
    const framesFromEnd = this.frames.length - this.currentFrame;
    if (framesFromEnd <= this.crossfadeFrames) {
      const blendFrame = this.crossfadeFrames - framesFromEnd;
      const alpha = blendFrame / this.crossfadeFrames;

      this.ctx.globalAlpha = alpha;
      this.ctx.drawImage(this.frames[blendFrame], 0, 0);
    }

    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
  }
}
```

## Audio-Synced Loops

### BPM-Aligned Loop

Loop duration matches musical tempo.

```javascript
function bpmAlignedLoop(element, bpm, beats = 4) {
  const beatDuration = 60 / bpm; // seconds per beat
  const loopDuration = beatDuration * beats;

  gsap.to(element, {
    scale: 1.1,
    duration: beatDuration / 2,
    repeat: -1,
    yoyo: true,
    ease: "power2.out"
  });

  // Total animation aligns with beat structure
  return loopDuration;
}
```

## Particle/System Loops

### Particle Pool Loop

Recycle particles for seamless emission.

```javascript
class ParticlePool {
  constructor(count, emitter) {
    this.particles = Array.from({ length: count }, () => ({
      element: document.createElement('div'),
      active: false,
      life: 0
    }));

    this.emitter = emitter;
    this.maxLife = 2; // seconds
  }

  emit() {
    const particle = this.particles.find(p => !p.active);
    if (!particle) return;

    particle.active = true;
    particle.life = 0;

    // Reset position to emitter
    gsap.set(particle.element, {
      x: this.emitter.x,
      y: this.emitter.y,
      opacity: 1,
      scale: 1
    });

    // Animate lifecycle
    gsap.to(particle.element, {
      y: this.emitter.y - 100,
      opacity: 0,
      scale: 0.5,
      duration: this.maxLife,
      onComplete: () => {
        particle.active = false;
      }
    });
  }

  update(dt) {
    // Emit new particles at regular intervals
    // Particles automatically recycle
  }
}
```

## CSS-Only Seamless Loops

### Infinite Marquee

```css
.marquee {
  display: flex;
  overflow: hidden;
}

.marquee-content {
  display: flex;
  animation: marquee 10s linear infinite;
}

/* Duplicate content for seamless loop */
.marquee-content::after {
  content: '';
  display: flex;
  /* Clone of content */
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
```

### Seamless Background Loop

```css
.scrolling-bg {
  background-image: url('pattern.png');
  background-repeat: repeat-x;
  animation: scrollBg 10s linear infinite;
}

@keyframes scrollBg {
  from { background-position: 0 0; }
  to { background-position: -200px 0; } /* Width of one pattern tile */
}
```

## Easing for Loops

### Symmetric Easing

Use same ease in/out for seamless ping-pong.

```javascript
// Good for loops
gsap.to(element, {
  y: 10,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut" // Symmetric
});

// Avoid for loops (asymmetric)
gsap.to(element, {
  y: 10,
  repeat: -1,
  yoyo: true,
  ease: "power2.out" // Will have visible "seam"
});
```

### Custom Loop Easing

Create perfectly looping ease curve.

```javascript
// Custom ease that returns to start velocity
CustomEase.create("seamless", "M0,0 C0.5,0 0.5,1 1,1 1,0.5 0.5,0 0.5,0");
```

## Performance Tips

1. **Use transforms only** — `transform` and `opacity` are GPU-accelerated
2. **Avoid layout triggers** — Don't animate `width`, `height`, `margin`
3. **Use `will-change`** for complex loops
4. **Consider `requestAnimationFrame` pacing** for custom loops
5. **Pool and recycle** animated elements

```css
.looping-element {
  will-change: transform;
}
```

## Testing Loops

### Visual Inspection

1. Watch for "pop" at loop point
2. Check velocity continuity
3. Verify easing symmetry
4. Test at different speeds (0.5x, 2x)

### Programmatic Check

```javascript
function testLoopSeamlessness(element, property, duration) {
  const startValue = getComputedStyle(element)[property];

  setTimeout(() => {
    const endValue = getComputedStyle(element)[property];
    const isSeamless = Math.abs(parseFloat(startValue) - parseFloat(endValue)) < 0.1;
    console.log(`Loop seamless: ${isSeamless}`);
  }, duration * 1000);
}
```
