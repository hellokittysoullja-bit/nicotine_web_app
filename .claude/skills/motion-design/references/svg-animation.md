
# SVG Animation

Techniques for animating Scalable Vector Graphics.

## Animation Methods

| Method | Browser Support | Interactivity | Complexity |
|--------|-----------------|---------------|------------|
| **CSS** | Excellent | Limited | Low |
| **SMIL** | Good (no IE) | Declarative | Medium |
| **JavaScript** | Excellent | Full | High |
| **Web Animations API** | Good | Full | Medium |

## CSS Animation

### Transform Animation

```css
/* Rotate icon */
.icon-spin {
  animation: spin 1s linear infinite;
  transform-origin: center;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Scale on hover */
.icon-button:hover svg {
  transform: scale(1.1);
  transition: transform 200ms ease-out;
}
```

### Stroke Animation

```css
/* Draw-on effect */
.path-draw {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw 2s ease-out forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
```

```javascript
// Calculate actual path length
const path = document.querySelector('.path-draw');
const length = path.getTotalLength();
path.style.strokeDasharray = length;
path.style.strokeDashoffset = length;
```

### Fill Animation

```css
/* Color transition */
.icon path {
  fill: #666;
  transition: fill 200ms ease;
}

.icon:hover path {
  fill: #2563eb;
}

/* Gradient animation (via CSS custom properties) */
@keyframes gradient-shift {
  0% { --gradient-stop: 0%; }
  100% { --gradient-stop: 100%; }
}
```

## SMIL Animation (Declarative)

### Basic Animate

```xml
<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="20">
    <!-- Animate radius -->
    <animate
      attributeName="r"
      values="20;25;20"
      dur="1s"
      repeatCount="indefinite"
    />
  </circle>
</svg>
```

### AnimateTransform

```xml
<svg viewBox="0 0 100 100">
  <rect x="25" y="25" width="50" height="50">
    <!-- Rotate -->
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 50 50"
      to="360 50 50"
      dur="2s"
      repeatCount="indefinite"
    />
  </rect>
</svg>
```

### AnimateMotion (Path Following)

```xml
<svg viewBox="0 0 200 100">
  <path id="motionPath" d="M10,50 Q50,10 100,50 T190,50" fill="none"/>

  <circle r="5" fill="blue">
    <animateMotion
      dur="3s"
      repeatCount="indefinite"
      rotate="auto"
    >
      <mpath href="#motionPath"/>
    </animateMotion>
  </circle>
</svg>
```

### Morphing (Values Animation)

```xml
<svg viewBox="0 0 100 100">
  <path>
    <animate
      attributeName="d"
      dur="2s"
      repeatCount="indefinite"
      values="
        M10,50 L50,10 L90,50 L50,90 Z;
        M25,25 L75,25 L75,75 L25,75 Z;
        M10,50 L50,10 L90,50 L50,90 Z
      "
    />
  </path>
</svg>
```

## JavaScript Animation

### GSAP

```javascript
// Path drawing
gsap.fromTo('.logo-path', {
  strokeDashoffset: pathLength
}, {
  strokeDashoffset: 0,
  duration: 2,
  ease: 'power2.inOut'
});

// Morphing (with MorphSVG plugin)
gsap.to('.shape', {
  morphSVG: '.target-shape',
  duration: 1,
  ease: 'power2.inOut'
});

// Stagger paths
gsap.from('.icon path', {
  strokeDashoffset: (i, el) => el.getTotalLength(),
  duration: 0.8,
  stagger: 0.1,
  ease: 'power2.out'
});
```

### anime.js

```javascript
anime({
  targets: '.path',
  strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 1500,
  delay: (el, i) => i * 250
});

// Morphing
anime({
  targets: '.morph-path',
  d: [
    { value: 'M10,50 L50,10 L90,50 L50,90 Z' },
    { value: 'M25,25 L75,25 L75,75 L25,75 Z' }
  ],
  easing: 'easeInOutQuad',
  duration: 1000
});
```

### Web Animations API

```javascript
const path = document.querySelector('.path');
const length = path.getTotalLength();

path.style.strokeDasharray = length;

path.animate([
  { strokeDashoffset: length },
  { strokeDashoffset: 0 }
], {
  duration: 1000,
  easing: 'ease-out',
  fill: 'forwards'
});
```

## SVG Filter Animation

### Blur Animation

```xml
<svg>
  <defs>
    <filter id="blur">
      <feGaussianBlur stdDeviation="0">
        <animate
          attributeName="stdDeviation"
          values="0;5;0"
          dur="1s"
          repeatCount="indefinite"
        />
      </feGaussianBlur>
    </filter>
  </defs>

  <circle filter="url(#blur)" cx="50" cy="50" r="30"/>
</svg>
```

### Glow Effect

```xml
<defs>
  <filter id="glow">
    <feGaussianBlur stdDeviation="3" result="blur"/>
    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
  </filter>
</defs>

<style>
  .icon:hover {
    filter: url(#glow);
  }
</style>
```

### Color Matrix

```xml
<filter id="desaturate">
  <feColorMatrix type="saturate" values="1">
    <animate
      attributeName="values"
      values="1;0;1"
      dur="2s"
      repeatCount="indefinite"
    />
  </feColorMatrix>
</filter>
```

## Common Patterns

### Icon Hover States

```javascript
// Multi-element icon animation
const iconElements = {
  primary: '.icon-primary',
  secondary: '.icon-secondary',
  accent: '.icon-accent'
};

function animateIconHover() {
  gsap.to(iconElements.primary, {
    scale: 1.1,
    duration: 0.2
  });
  gsap.to(iconElements.secondary, {
    rotation: 15,
    duration: 0.3
  });
  gsap.to(iconElements.accent, {
    opacity: 1,
    duration: 0.2
  });
}
```

### Loading Spinner

```xml
<svg viewBox="0 0 50 50" class="spinner">
  <circle
    cx="25" cy="25" r="20"
    fill="none"
    stroke="currentColor"
    stroke-width="4"
    stroke-dasharray="80 40"
  >
    <animateTransform
      attributeName="transform"
      type="rotate"
      from="0 25 25"
      to="360 25 25"
      dur="1s"
      repeatCount="indefinite"
    />
  </circle>
</svg>
```

### Checkmark Draw

```javascript
const checkPath = document.querySelector('.checkmark-path');
const length = checkPath.getTotalLength();

// Set up
checkPath.style.strokeDasharray = length;
checkPath.style.strokeDashoffset = length;

// Animate on success
function showSuccess() {
  gsap.to(checkPath, {
    strokeDashoffset: 0,
    duration: 0.5,
    ease: 'power2.out'
  });
}
```

## Performance Tips

1. **Use `transform` and `opacity`** - hardware accelerated
2. **Avoid animating `d` attribute** on complex paths - expensive
3. **Use CSS for simple animations** - less overhead
4. **Add `will-change`** for frequently animated elements
5. **Pause offscreen animations** - IntersectionObserver

```css
.animated-svg {
  will-change: transform, opacity;
}

/* Pause when not visible */
.animated-svg:not(.is-visible) {
  animation-play-state: paused;
}
```

## Accessibility

```xml
<svg role="img" aria-labelledby="icon-title">
  <title id="icon-title">Loading</title>
  <!-- animation content -->
</svg>

<!-- Respect reduced motion -->
<style>
@media (prefers-reduced-motion: reduce) {
  svg * {
    animation: none !important;
    transition: none !important;
  }
}
</style>
```

## Related Skills

- **Dependencies:** easing, duration, morphing
- **See also:** lottie, brand-animation, loading-states
- **Libraries:** GSAP, anime.js, Snap.svg, SVG.js
