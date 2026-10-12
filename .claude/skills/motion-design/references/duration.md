
# Duration & Timing

Industry-standard duration tokens with cross-system comparison.

## Standards Reference

| Standard | Documentation |
|----------|---------------|
| W3C DTCG | designtokens.org (duration type) |
| Material Design 3 | m3.material.io/styles/motion/easing-and-duration |
| Fluent 2 | fluent2.microsoft.design/motion |
| Carbon | carbondesignsystem.com/guidelines/motion |

## M3 Duration Scale (Primary)

Load from: `tokens/duration.tokens.json`

| Token | Value | Use Case |
|-------|-------|----------|
| `short-1` | 50ms | Micro-feedback, ripples |
| `short-2` | 100ms | Toggles, checkboxes |
| `short-3` | 150ms | Icons, small elements |
| `short-4` | 200ms | Buttons, chips |
| `medium-1` | 250ms | Cards, list items |
| `medium-2` | 300ms | Dialogs, modals |
| `medium-3` | 350ms | Sheets, drawers |
| `medium-4` | 400ms | Complex expansions |
| `long-1` | 450ms | Page transitions |
| `long-2` | 500ms | Hero animations |

## Selection Guide

```
MICRO-INTERACTION?     → short-1 to short-2 (50-100ms)
SMALL COMPONENT?       → short-3 to short-4 (150-200ms)
MEDIUM COMPONENT?      → medium-1 to medium-2 (250-300ms)
LARGE TRANSITION?      → medium-3 to medium-4 (350-400ms)
PAGE/NAV CHANGE?       → long-1 to long-2 (450-500ms)
```

## Cross-System Comparison

| M3 | Fluent | Carbon | Value |
|----|--------|--------|-------|
| short-1 | ultra-fast | - | 50ms |
| short-2 | faster | fast-02 | 100-110ms |
| short-3 | fast | moderate-01 | 150ms |
| short-4 | normal | - | 200ms |
| medium-1 | - | moderate-02 | 240-250ms |
| medium-2 | slow | - | 300ms |
| medium-4 | slower | slow-01 | 400ms |
| long-2 | ultra-slow | - | 500ms |
| - | - | slow-02 | 700ms |

## Frame Conversion

| Duration | 24fps | 30fps | 60fps |
|----------|-------|-------|-------|
| 50ms | 1 | 2 | 3 |
| 100ms | 2 | 3 | 6 |
| 150ms | 4 | 5 | 9 |
| 200ms | 5 | 6 | 12 |
| 250ms | 6 | 8 | 15 |
| 300ms | 7 | 9 | 18 |
| 400ms | 10 | 12 | 24 |
| 500ms | 12 | 15 | 30 |

## Implementation

### JavaScript
```javascript
import tokens from '../tokens/duration.tokens.json';

const duration = tokens.motion.duration;
const ms = parseInt(duration['medium-1'].$value); // 250

// Convert to seconds for GSAP
gsap.to('.element', { x: 100, duration: ms / 1000 });
```

### Remotion (frames at 30fps)
```javascript
const msToFrames = (ms, fps = 30) => Math.round((ms / 1000) * fps);

// medium-1 (250ms) = 8 frames at 30fps
const frames = msToFrames(250, 30);
```

## Dynamic Duration Calculation

Static durations are amateur. Google calculates duration based on context.

### Distance-Based Duration

```javascript
function durationFromDistance(distancePx) {
  const BASE_DURATION = 300; // ms
  const BASE_DISTANCE = 300; // px

  // Square root scaling feels natural
  const scale = Math.sqrt(distancePx / BASE_DISTANCE);
  const duration = BASE_DURATION * scale;

  // Clamp to M3 range
  return Math.max(100, Math.min(500, Math.round(duration)));
}

// Examples:
durationFromDistance(100);  // 173ms
durationFromDistance(300);  // 300ms
durationFromDistance(600);  // 424ms
durationFromDistance(1000); // 500ms (capped)
```

### Area-Based Duration

```javascript
function durationFromArea(startArea, endArea) {
  const change = Math.abs(endArea - startArea);
  const max = Math.max(startArea, endArea);
  const ratio = change / max;

  const BASE = 250;
  const scale = 1 + (ratio * 0.5);

  return Math.min(500, Math.round(BASE * scale));
}
```

### Platform Multiplier

```javascript
function platformDuration(baseDuration) {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1920;

  if (width >= 1024) return Math.round(baseDuration * 0.7);  // Desktop: 30% faster
  if (width >= 768) return Math.round(baseDuration * 0.85); // Tablet: 15% faster
  return baseDuration; // Mobile: baseline
}
```

### Enter vs Exit Asymmetry

Google M3 requires exits to be 30% faster than enters.

```javascript
function asymmetricDurations(baseDuration) {
  return {
    enter: baseDuration,
    exit: Math.round(baseDuration * 0.7)  // 30% faster
  };
}

// Usage:
const { enter, exit } = asymmetricDurations(300);
// enter: 300ms, exit: 210ms
```

Load ratio from: `tokens/sequencing.tokens.json` → `motion.sequencing.choreography.enter-exit-ratio`

See `duration/duration-by-context.md` for contextual selection.
See `duration/frame-conversion.md` for all frame rate tables.
