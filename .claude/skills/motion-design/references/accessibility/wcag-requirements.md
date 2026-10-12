# WCAG Motion Requirements

## Relevant Success Criteria

### 2.2.2 Pause, Stop, Hide (Level A)
For moving, blinking, scrolling, or auto-updating information:
- Must provide mechanism to pause, stop, or hide
- Applies if motion starts automatically and lasts >5 seconds

### 2.3.1 Three Flashes or Below Threshold (Level A)
Content must not flash more than three times per second.

### 2.3.2 Three Flashes (Level AAA)
No content flashes more than three times per second (no threshold exception).

### 2.3.3 Animation from Interactions (Level AAA)
Motion triggered by interaction can be disabled, unless essential.

## prefers-reduced-motion

### CSS Media Query
```css
@media (prefers-reduced-motion: reduce) {
  /* Reduced motion styles */
}

@media (prefers-reduced-motion: no-preference) {
  /* Full motion styles */
}
```

### JavaScript Detection
```javascript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// With listener for changes
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', (e) => {
  const reduced = e.matches;
});
```

## What "Essential" Means

Motion is essential when:
1. Removing it would fundamentally change the information
2. The animation IS the content (video, game)
3. Progress indication for long operations

Motion is NOT essential when:
- Decorative flourishes
- Parallax effects
- Hover animations
- Transition animations (can use simpler version)

## Implementation Checklist

- [ ] Check `prefers-reduced-motion` before animating
- [ ] No flashing content >3Hz
- [ ] Auto-playing animations have pause control
- [ ] Provide reduced-motion alternatives
- [ ] Test with reduced motion enabled
- [ ] Document motion behavior in accessibility docs

## Testing

### macOS
System Preferences → Accessibility → Display → Reduce motion

### Windows
Settings → Ease of Access → Display → Show animations

### iOS
Settings → Accessibility → Motion → Reduce Motion

### Android
Settings → Accessibility → Remove animations

## Browser Support

`prefers-reduced-motion` is supported in:
- Chrome 74+
- Firefox 63+
- Safari 10.1+
- Edge 79+
- Opera 62+
