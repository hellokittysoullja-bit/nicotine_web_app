# Container Transform Timing Breakdown

Detailed frame-by-frame timing for the Google M3 container transform pattern.

## Total Duration: 300ms

At 30fps = 9 frames
At 60fps = 18 frames

## Component Timeline

### Container Bounds Animation
- **Start**: Frame 0 (0ms)
- **End**: Frame 9 (300ms)
- **Easing**: Emphasized `cubic-bezier(0.2, 0, 0, 1)`
- **Properties**: x, y, width, height, borderRadius

### Old Content Fade Out
- **Start**: Frame 0 (0ms)
- **End**: Frame 3 (100ms)
- **Easing**: Linear
- **Property**: opacity 1 → 0

### New Content Fade In
- **Start**: Frame 3 (100ms)
- **End**: Frame 9 (300ms)
- **Easing**: Linear
- **Property**: opacity 0 → 1

### Scrim (if used)
- **Start**: Frame 0 (0ms)
- **End**: Frame 5 (150ms)
- **Easing**: Linear
- **Property**: opacity 0 → 0.32 (standard)

### Arc Path (if aspect ratio change >10%)
- **Start**: Frame 0 (0ms)
- **Peak**: Frame 5 (150ms) — maximum arc offset
- **End**: Frame 9 (300ms)
- **Easing**: Emphasized
- **Property**: Y offset (typically -50px at peak)

## Frame-by-Frame at 30fps

| Frame | Time | Bounds | Old Content | New Content | Arc Y |
|-------|------|--------|-------------|-------------|-------|
| 0 | 0ms | 0% | 100% | 0% | 0px |
| 1 | 33ms | 15% | 67% | 0% | -15px |
| 2 | 67ms | 35% | 33% | 0% | -30px |
| 3 | 100ms | 52% | 0% | 0% | -42px |
| 4 | 133ms | 67% | 0% | 17% | -48px |
| 5 | 167ms | 78% | 0% | 33% | -50px |
| 6 | 200ms | 87% | 0% | 50% | -45px |
| 7 | 233ms | 93% | 0% | 67% | -35px |
| 8 | 267ms | 97% | 0% | 83% | -18px |
| 9 | 300ms | 100% | 0% | 100% | 0px |

## Arc Path Decision

```javascript
function shouldUseArc(startBounds, endBounds) {
  const startAspect = startBounds.width / startBounds.height;
  const endAspect = endBounds.width / endBounds.height;
  const change = Math.abs(startAspect - endAspect) / startAspect;

  return change > 0.1; // 10% threshold from position.tokens.json
}

function getArcIntensity(startBounds, endBounds) {
  const startAspect = startBounds.width / startBounds.height;
  const endAspect = endBounds.width / endBounds.height;
  const change = Math.abs(startAspect - endAspect) / startAspect;

  // Scale arc offset based on aspect ratio change
  // More change = more pronounced arc
  const baseOffset = 50; // pixels
  return Math.min(change * 2, 1) * baseOffset;
}
```

## Common Scenarios

### Card to Detail (Portrait to Landscape)
- Aspect ratio: 0.75 → 1.5 (100% change)
- Arc: YES, pronounced (-50px)
- Use case: Product card → Product detail

### FAB to Dialog (Square to Portrait)
- Aspect ratio: 1.0 → 0.7 (30% change)
- Arc: YES, medium (-30px)
- Use case: Floating action button → Full dialog

### List Item to Sheet (Wide to Tall)
- Aspect ratio: 3.0 → 0.6 (80% change)
- Arc: YES, pronounced (-50px)
- Use case: Email row → Email viewer

### Thumbnail to Fullscreen (Same Ratio)
- Aspect ratio: 1.78 → 1.78 (0% change)
- Arc: NO, linear path
- Use case: Video thumbnail → Video player

## Performance Considerations

1. **GPU Acceleration**: Use `transform` and `opacity` only
2. **Will-change**: Apply `will-change: transform, opacity` before animation
3. **Composite layers**: Container should be its own compositing layer
4. **Avoid layout thrash**: Don't read layout during animation

```css
.container-transform {
  will-change: transform, opacity;
  contain: layout style;
}
```
