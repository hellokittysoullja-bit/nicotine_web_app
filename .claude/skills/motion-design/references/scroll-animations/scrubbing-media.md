# Scrubbing Lottie & Video to Scroll

## Overview

"Scrubbing" links animation playback position directly to scroll position. As user scrolls, animation progresses frame-by-frame.

## Scrubbing Lottie with GSAP

### Setup

```javascript
import lottie from 'lottie-web';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
```

### Basic Lottie Scrub

```javascript
// Load Lottie (autoplay: false is critical)
const anim = lottie.loadAnimation({
  container: document.getElementById('lottie-container'),
  renderer: 'svg',
  loop: false,
  autoplay: false,  // We control playback
  path: 'animation.json'
});

// Wait for Lottie to load, then set up scrub
anim.addEventListener('DOMLoaded', () => {
  const totalFrames = anim.totalFrames;

  ScrollTrigger.create({
    trigger: '#scroll-section',
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      // Map scroll progress (0-1) to frame number
      const frame = Math.floor(self.progress * (totalFrames - 1));
      anim.goToAndStop(frame, true);
    }
  });
});
```

### Lottie Scrub with Framer Motion

```jsx
import Lottie from 'lottie-react';
import { useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import animationData from './animation.json';

const ScrollLottie = () => {
  const containerRef = useRef(null);
  const lottieRef = useRef(null);
  const [totalFrames, setTotalFrames] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    if (lottieRef.current) {
      setTotalFrames(lottieRef.current.getDuration(true));
    }
  }, []);

  useEffect(() => {
    return scrollYProgress.on('change', (progress) => {
      if (lottieRef.current && totalFrames) {
        const frame = Math.floor(progress * totalFrames);
        lottieRef.current.goToAndStop(frame, true);
      }
    });
  }, [scrollYProgress, totalFrames]);

  return (
    <div ref={containerRef} style={{ height: '300vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <Lottie
          lottieRef={lottieRef}
          animationData={animationData}
          autoplay={false}
          loop={false}
        />
      </div>
    </div>
  );
};
```

## Scrubbing HTML5 Video

### Basic Video Scrub

```javascript
const video = document.querySelector('video');
const section = document.querySelector('#video-section');

// Wait for video metadata
video.addEventListener('loadedmetadata', () => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      // Map progress to video time
      video.currentTime = self.progress * video.duration;
    }
  });
});

// Prevent native playback
video.pause();
```

### Video Scrub with Preloading

For smooth scrubbing, video needs to be fully loaded:

```javascript
const video = document.querySelector('video');

// Force full load
video.preload = 'auto';

// Alternative: Fetch video as blob
fetch('video.mp4')
  .then(res => res.blob())
  .then(blob => {
    video.src = URL.createObjectURL(blob);
    initScrollTrigger();
  });
```

### React Video Scrub

```jsx
import { useRef, useEffect } from 'react';
import { useScroll, useTransform } from 'framer-motion';

const ScrollVideo = ({ src }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    return scrollYProgress.on('change', (progress) => {
      if (video.duration) {
        video.currentTime = progress * video.duration;
      }
    });
  }, [scrollYProgress]);

  return (
    <div ref={containerRef} style={{ height: '400vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh' }}>
        <video
          ref={videoRef}
          src={src}
          muted
          playsInline
          preload="auto"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  );
};
```

## Performance Considerations

### Lottie Performance

| Renderer | Performance | Quality |
|----------|-------------|---------|
| `svg` | Good | Best |
| `canvas` | Better | Good |
| `html` | Varies | Varies |

For scrubbing, `canvas` often performs better:

```javascript
lottie.loadAnimation({
  renderer: 'canvas',
  // ...
});
```

### Video Performance

1. **Use MP4 H.264** — Best browser support
2. **Lower resolution** — 720p often sufficient for scrubbing
3. **Short duration** — Long videos = more memory
4. **Preload fully** — Scrubbing buffered video is janky

### Reduced Motion

Scrubbing itself is user-controlled, but consider:

```javascript
const prefersReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReduced) {
  // Option 1: Show static frame
  anim.goToAndStop(0, true);

  // Option 2: Normal playback (user can pause)
  anim.play();

  // Option 3: Skip animation section entirely
}
```

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Janky scrubbing | Video not preloaded | Preload full video |
| Lottie jumps | Frame rate mismatch | Use `goToAndStop(frame, true)` |
| Memory issues | Large Lottie/video | Reduce complexity, compress |
| Not triggering | Wrong trigger element | Check ScrollTrigger markers |
