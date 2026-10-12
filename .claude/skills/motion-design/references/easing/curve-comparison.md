# Easing Curve Comparison

## Visual Characteristics

### M3 Standard (0.2, 0, 0, 1)
- Quick acceleration at start
- Gradual deceleration
- Settles smoothly

### M3 Emphasized-Decelerate (0.05, 0.7, 0.1, 1)
- Very fast initial movement
- Long, smooth settle
- Best for entrances

### M3 Emphasized-Accelerate (0.3, 0, 0.8, 0.15)
- Slow start
- Quick exit
- Best for dismissals

## Cross-System Mapping

| Purpose | M3 | Fluent | Carbon | CSS Keyword |
|---------|-----|--------|--------|-------------|
| Default | standard | decelerate | productive-standard | ease-out |
| Enter | emphasized-decelerate | decelerate | productive-entrance | - |
| Exit | emphasized-accelerate | accelerate | productive-exit | - |
| Linear | linear | linear | - | linear |

## Curve Values

### Material Design 3
```
standard:             (0.2, 0, 0, 1)
emphasized:           (0.2, 0, 0, 1)
emphasized-decelerate: (0.05, 0.7, 0.1, 1)
emphasized-accelerate: (0.3, 0, 0.8, 0.15)
standard-decelerate:  (0, 0, 0, 1)
standard-accelerate:  (0.3, 0, 1, 1)
```

### Fluent 2
```
decelerate:  (0.1, 0.9, 0.2, 1)
accelerate:  (0.9, 0.1, 1, 0.2)
```

### Carbon
```
productive-standard:  (0.2, 0, 0.38, 0.9)
productive-entrance:  (0, 0, 0.38, 0.9)
productive-exit:      (0.2, 0, 1, 0.9)
expressive-standard:  (0.4, 0.14, 0.3, 1)
expressive-entrance:  (0, 0, 0.3, 1)
expressive-exit:      (0.4, 0.14, 1, 1)
```

## CSS Implementation

```css
:root {
  /* M3 */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.05, 0.7, 0.1, 1);
  --ease-exit: cubic-bezier(0.3, 0, 0.8, 0.15);

  /* Fluent */
  --ease-fluent-decel: cubic-bezier(0.1, 0.9, 0.2, 1);
  --ease-fluent-accel: cubic-bezier(0.9, 0.1, 1, 0.2);

  /* Carbon */
  --ease-carbon-standard: cubic-bezier(0.2, 0, 0.38, 0.9);
  --ease-carbon-enter: cubic-bezier(0, 0, 0.38, 0.9);
  --ease-carbon-exit: cubic-bezier(0.2, 0, 1, 0.9);
}
```

## When Curves Differ

M3 curves are generally "snappier" than Fluent or Carbon. If building:
- Windows app → Use Fluent curves
- IBM enterprise → Use Carbon curves
- Cross-platform → M3 is safest baseline
