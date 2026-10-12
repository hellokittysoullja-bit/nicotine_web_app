# Duration by Context

## Element Size Guide

| Element Size | Token | Value | Example |
|--------------|-------|-------|---------|
| Micro | short-1 | 50ms | Ripple, tooltip |
| Tiny | short-2 | 100ms | Checkbox, toggle |
| Small | short-3 | 150ms | Icon, badge |
| Medium-Small | short-4 | 200ms | Button, chip |
| Medium | medium-1 | 250ms | Card, list item |
| Medium-Large | medium-2 | 300ms | Dialog, modal |
| Large | medium-3 | 350ms | Drawer, sheet |
| Full | medium-4 | 400ms | Full expansion |
| Page | long-1 | 450ms | Page transition |
| Hero | long-2 | 500ms | Hero animation |

## Component-Specific Recommendations

### Buttons
```
Hover state: short-2 (100ms)
Press state: short-1 (50ms)
Loading: short-4 (200ms)
```

### Cards
```
Hover lift: short-3 (150ms)
Expand: medium-1 (250ms)
Collapse: short-4 (200ms)
```

### Modals/Dialogs
```
Open: medium-2 (300ms)
Close: short-4 (200ms)
Backdrop: medium-1 (250ms)
```

### Navigation
```
Tab switch: medium-1 (250ms)
Page transition: long-1 (450ms)
Drawer slide: medium-3 (350ms)
```

### Lists
```
Item hover: short-2 (100ms)
Item select: short-3 (150ms)
Reorder: medium-1 (250ms)
Stagger delay: short-1 (50ms) per item
```

### Toasts/Snackbars
```
Enter: medium-1 (250ms)
Exit: short-4 (200ms)
Auto-dismiss delay: 4000-6000ms
```

## Perception Guidelines

| Duration | Perception |
|----------|------------|
| <100ms | Instantaneous |
| 100-200ms | Quick, responsive |
| 200-300ms | Noticeable but efficient |
| 300-400ms | Deliberate, smooth |
| 400-500ms | Expressive |
| >500ms | Consider if necessary |

## Platform Considerations

### Mobile
- Use slightly shorter durations
- Touch feedback: <100ms
- Transitions: ~80% of desktop

### Desktop
- Standard M3 durations
- Hover states need quick feedback
- More tolerance for longer transitions

### Reduced Motion
- Cap all at short-2 (100ms)
- Or use instant (0ms) for decorative
