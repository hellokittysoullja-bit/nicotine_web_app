
# Advanced CSS Animation

Modern CSS features for sophisticated motion design.

## Browser Support Overview

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| View Transitions | 111+ | Flag | 18+ | 111+ |
| Scroll-driven | 115+ | No | No | 115+ |
| @starting-style | 117+ | No | 17.5+ | 117+ |
| Discrete animations | 117+ | No | 17+ | 117+ |

## View Transitions API

### Basic Page Transition

```javascript
// Trigger view transition
document.startViewTransition(async () => {
  // Update DOM
  await updateContent();
});
```

```css
/* Default crossfade */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 300ms;
  animation-timing-function: ease-in-out;
}

/* Custom animation */
::view-transition-old(root) {
  animation: slide-out 300ms ease-in-out;
}

::view-transition-new(root) {
  animation: slide-in 300ms ease-in-out;
}

@keyframes slide-out {
  to { transform: translateX(-100%); }
}

@keyframes slide-in {
  from { transform: translateX(100%); }
}
```

### Named View Transitions

```css
/* Mark elements for individual transitions */
.card {
  view-transition-name: card;
}

.hero-image {
  view-transition-name: hero;
}

/* Animate specific elements */
::view-transition-old(card),
::view-transition-new(card) {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
}

/* Shared element transition */
::view-transition-group(hero) {
  animation-duration: 500ms;
  animation-timing-function: ease-in-out;
}
```

### MPA View Transitions

```css
/* Enable cross-document transitions */
@view-transition {
  navigation: auto;
}

/* Page-specific animations */
::view-transition-old(root) {
  animation: fade-and-scale-out 250ms ease-in;
}

::view-transition-new(root) {
  animation: fade-and-scale-in 250ms ease-out;
}
```

## Scroll-Driven Animations

### Scroll Progress

```css
@keyframes reveal {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(0); }
}

.scroll-reveal {
  animation: reveal linear;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

### Scroll Timeline

```css
/* Named scroll timeline */
.scroll-container {
  scroll-timeline-name: --main-scroll;
  scroll-timeline-axis: block;
}

/* Attach animation to scroll */
.parallax-element {
  animation: parallax linear;
  animation-timeline: --main-scroll;
}

@keyframes parallax {
  from { transform: translateY(-50px); }
  to { transform: translateY(50px); }
}
```

### View Timeline (Intersection)

```css
/* Animate when element enters/exits viewport */
.card {
  animation: card-enter linear;
  animation-timeline: view();
  animation-range: entry 0% cover 50%;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

### Sticky Header Animation

```css
.header {
  animation: header-shrink linear;
  animation-timeline: scroll(root);
  animation-range: 0px 100px;
}

@keyframes header-shrink {
  from {
    padding-block: 2rem;
    background: transparent;
  }
  to {
    padding-block: 0.5rem;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }
}
```

## @starting-style

### Entry Animations

```css
/* Animate from DOM insertion */
.modal {
  opacity: 1;
  transform: scale(1);
  transition: opacity 300ms, transform 300ms;

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }
}

/* Popover with starting-style */
[popover] {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 200ms,
    transform 200ms,
    overlay 200ms allow-discrete,
    display 200ms allow-discrete;

  @starting-style {
    opacity: 0;
    transform: translateY(-10px);
  }
}

/* Exit animation */
[popover]:not(:popover-open) {
  opacity: 0;
  transform: translateY(-10px);
}
```

## Discrete Property Animation

### Display Transitions

```css
/* Animate display: none → block */
.element {
  transition:
    opacity 300ms,
    display 300ms allow-discrete;
}

.element.hidden {
  opacity: 0;
  display: none;
}

.element.visible {
  opacity: 1;
  display: block;

  @starting-style {
    opacity: 0;
  }
}
```

### Dialog Animation

```css
dialog {
  opacity: 1;
  transform: scale(1);
  transition:
    opacity 300ms ease-out,
    transform 300ms ease-out,
    overlay 300ms allow-discrete,
    display 300ms allow-discrete;

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }
}

dialog:not([open]) {
  opacity: 0;
  transform: scale(0.95);
  display: none;
}
```

## Container Queries + Animation

```css
/* Responsive animations based on container */
.card-container {
  container-type: inline-size;
  container-name: card;
}

.card {
  transition: all 300ms ease-out;
}

@container card (min-width: 400px) {
  .card {
    /* Different animation for larger containers */
    transition-duration: 400ms;
  }

  .card:hover {
    transform: translateY(-8px);
  }
}

@container card (max-width: 399px) {
  .card:hover {
    transform: scale(1.02);
  }
}
```

## CSS Anchor Positioning + Animation

```css
/* Animate anchored elements */
.tooltip {
  position: absolute;
  anchor-name: --trigger;

  /* Position relative to anchor */
  top: anchor(--trigger bottom);
  left: anchor(--trigger center);

  /* Animate position changes */
  transition:
    top 200ms ease-out,
    left 200ms ease-out;
}

/* Fallback positioning with animation */
.tooltip {
  position-fallback: --tooltip-positions;
}

@position-fallback --tooltip-positions {
  @try {
    top: anchor(bottom);
    left: anchor(center);
  }
  @try {
    bottom: anchor(top);
    left: anchor(center);
  }
}
```

## Motion Path (Offset Path)

```css
/* Animate along SVG path */
.element {
  offset-path: path('M 0 200 Q 150 0 300 200 T 600 200');
  offset-distance: 0%;
  animation: move-along-path 3s ease-in-out infinite;
}

@keyframes move-along-path {
  to { offset-distance: 100%; }
}

/* With rotation */
.element {
  offset-path: path('M 0 100 C 100 0 200 200 300 100');
  offset-rotate: auto;
  animation: follow-path 2s linear infinite;
}
```

## Individual Transform Properties

```css
/* Separate transform animations */
.element {
  translate: 0 0;
  scale: 1;
  rotate: 0deg;

  transition:
    translate 200ms ease-out,
    scale 150ms ease-out,
    rotate 300ms ease-out;
}

.element:hover {
  translate: 0 -10px;
  scale: 1.05;
  rotate: 3deg;
}

/* Independent keyframes */
@keyframes complex-transform {
  0% {
    translate: 0 0;
    scale: 1;
    rotate: 0deg;
  }
  50% {
    translate: 100px 0;
    scale: 1.2;
    rotate: 180deg;
  }
  100% {
    translate: 0 0;
    scale: 1;
    rotate: 360deg;
  }
}
```

## Color Interpolation

```css
/* Smooth color transitions in different spaces */
.gradient-animation {
  background: linear-gradient(
    in oklch longer hue,
    oklch(70% 0.15 0),
    oklch(70% 0.15 360)
  );
  background-size: 200% 100%;
  animation: rainbow 3s linear infinite;
}

@keyframes rainbow {
  to { background-position: -200% 0; }
}

/* Color transition with interpolation */
.button {
  background: oklch(60% 0.2 250);
  transition: background 300ms in oklch;
}

.button:hover {
  background: oklch(70% 0.25 280);
}
```

## Progressive Enhancement

```css
/* Feature detection */
@supports (animation-timeline: view()) {
  .scroll-animate {
    animation: reveal linear;
    animation-timeline: view();
  }
}

@supports not (animation-timeline: view()) {
  .scroll-animate {
    /* Fallback: use IntersectionObserver */
    opacity: 0;
    transition: opacity 300ms;
  }
  .scroll-animate.visible {
    opacity: 1;
  }
}

@supports (view-transition-name: test) {
  /* Use view transitions */
}
```

## Performance Tips

```css
/* Optimize scroll-driven animations */
.scroll-animated {
  will-change: transform, opacity;
  contain: layout style paint;
}

/* Use content-visibility for off-screen */
.section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}

/* Hardware acceleration */
.animated {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## Related Skills

- **Dependencies:** easing, duration, entrance-patterns, exit-patterns
- **See also:** scroll-animation, page-transitions, accessibility
- **Browser:** Chrome 115+, Safari 18+ for most features
