# Frame Conversion Tables

## Standard Frame Rates

| Use Case | Frame Rate |
|----------|------------|
| Film | 24 fps |
| Web/TV (NTSC) | 30 fps |
| Web/TV (PAL) | 25 fps |
| High-quality video | 60 fps |
| Gaming | 60+ fps |

## Conversion Formula

```javascript
frames = Math.round((milliseconds / 1000) * fps)
milliseconds = (frames / fps) * 1000
```

## M3 Duration to Frames

### At 24 fps (Film)

| Token | ms | Frames |
|-------|-----|--------|
| short-1 | 50 | 1 |
| short-2 | 100 | 2 |
| short-3 | 150 | 4 |
| short-4 | 200 | 5 |
| medium-1 | 250 | 6 |
| medium-2 | 300 | 7 |
| medium-3 | 350 | 8 |
| medium-4 | 400 | 10 |
| long-1 | 450 | 11 |
| long-2 | 500 | 12 |
| long-3 | 550 | 13 |
| long-4 | 600 | 14 |

### At 30 fps (Web Standard)

| Token | ms | Frames |
|-------|-----|--------|
| short-1 | 50 | 2 |
| short-2 | 100 | 3 |
| short-3 | 150 | 5 |
| short-4 | 200 | 6 |
| medium-1 | 250 | 8 |
| medium-2 | 300 | 9 |
| medium-3 | 350 | 11 |
| medium-4 | 400 | 12 |
| long-1 | 450 | 14 |
| long-2 | 500 | 15 |
| long-3 | 550 | 17 |
| long-4 | 600 | 18 |

### At 60 fps (High-Quality)

| Token | ms | Frames |
|-------|-----|--------|
| short-1 | 50 | 3 |
| short-2 | 100 | 6 |
| short-3 | 150 | 9 |
| short-4 | 200 | 12 |
| medium-1 | 250 | 15 |
| medium-2 | 300 | 18 |
| medium-3 | 350 | 21 |
| medium-4 | 400 | 24 |
| long-1 | 450 | 27 |
| long-2 | 500 | 30 |
| long-3 | 550 | 33 |
| long-4 | 600 | 36 |

## Utility Functions

### JavaScript
```javascript
const msToFrames = (ms, fps = 30) => Math.round((ms / 1000) * fps);
const framesToMs = (frames, fps = 30) => (frames / fps) * 1000;
```

### TypeScript (Remotion)
```typescript
import { fps } from 'remotion';

export const msToFrames = (ms: number, videoFps: number = fps) =>
  Math.round((ms / 1000) * videoFps);

export const getTokenFrames = (
  tokenValue: string,
  videoFps: number = fps
): number => {
  const ms = parseInt(tokenValue);
  return msToFrames(ms, videoFps);
};
```

## Lottie Frame Rates

Lottie animations typically use:
- 30 fps (most common)
- 60 fps (smooth animations)
- 24 fps (film-like quality)

Frame rate is specified in the Lottie JSON:
```json
{
  "fr": 30,
  "ip": 0,
  "op": 90
}
```
