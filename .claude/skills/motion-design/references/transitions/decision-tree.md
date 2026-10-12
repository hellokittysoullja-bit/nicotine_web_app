# Transition Selection Decision Tree

Quick decision logic for selecting the correct Google M3 transition pattern.

## ASCII Decision Tree

```
┌─────────────────────────────────────────────────────────┐
│                  TRANSITION SELECTOR                     │
│              (Google Material Design 3)                  │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │ Does a container persist │
              │ and transform?           │
              └─────────────────────────┘
                    │           │
                   YES          NO
                    │           │
                    ▼           ▼
        ┌───────────────┐  ┌─────────────────────────┐
        │  CONTAINER    │  │ Is there a spatial      │
        │  TRANSFORM    │  │ relationship between    │
        │               │  │ old and new content?    │
        │  Duration:    │  └─────────────────────────┘
        │  300ms        │        │           │
        │               │       YES          NO
        │  Use for:     │        │           │
        │  • Card→Detail│        ▼           ▼
        │  • FAB→Dialog │  ┌───────────────┐  ┌─────────────────┐
        │  • List→Full  │  │  SHARED AXIS  │  │ Is there any    │
        └───────────────┘  │  (X, Y, or Z) │  │ content         │
                           │               │  │ relationship?   │
                           │  Duration:    │  └─────────────────┘
                           │  400ms        │        │      │
                           │               │      WEAK    NONE
                           │  Use for:     │        │      │
                           │  • Tabs (X)   │        ▼      ▼
                           │  • Lists (Y)  │  ┌─────────┐ ┌──────┐
                           │  • Drill (Z)  │  │  FADE   │ │ FADE │
                           └───────────────┘  │ THROUGH │ │      │
                                              │         │ │ 200ms│
                                              │  300ms  │ │      │
                                              └─────────┘ └──────┘
```

## Quick Selection Guide

### Container Transform
**Duration:** 300ms | **Easing:** emphasized

Use when:
- One element morphs into another
- Card → detail page
- FAB → dialog
- List item → full screen
- Thumbnail → gallery

**Key indicator:** The origin element IS the destination element.

### Shared Axis
**Duration:** 400ms | **Easing:** emphasized

Use when:
- Navigation has spatial meaning
- Content moves along an axis

Axis selection:
- **X-axis:** Horizontal navigation (tabs, swipe pages)
- **Y-axis:** Vertical navigation (scroll lists, expandable sections)
- **Z-axis:** Depth changes (dialogs appearing, drill-down navigation)

**Key indicator:** "Where did that come from?" has an intuitive spatial answer.

### Fade Through
**Duration:** 300ms | **Easing:** standard

Use when:
- Content has weak relationship
- Bottom navigation switches
- Dashboard widget changes
- Same location, different content type

**Key indicator:** Same container, totally different content.

### Fade
**Duration:** 200ms | **Easing:** standard

Use when:
- No relationship at all
- Tooltips, toasts
- Simple show/hide
- Transient UI

**Key indicator:** Could appear anywhere; no spatial meaning.

## Decision Questions

Ask these in order:

1. **"Does a UI element morph into another?"**
   - YES → Container Transform
   - NO → Continue

2. **"Is there a clear directional relationship?"**
   - YES → Shared Axis (pick X, Y, or Z)
   - NO → Continue

3. **"Do the old and new content share any semantic relationship?"**
   - YES (weak) → Fade Through
   - NO → Fade

## Code Example

```javascript
function selectTransition(context) {
  if (context.elementMorphs) {
    return {
      type: 'container-transform',
      duration: 300,
      easing: [0.2, 0, 0, 1]
    };
  }

  if (context.spatialRelationship) {
    return {
      type: 'shared-axis',
      axis: context.axis, // 'x' | 'y' | 'z'
      duration: 400,
      easing: [0.2, 0, 0, 1]
    };
  }

  if (context.weakContentRelationship) {
    return {
      type: 'fade-through',
      duration: 300,
      easing: [0.2, 0, 0, 1]
    };
  }

  return {
    type: 'fade',
    duration: 200,
    easing: [0.2, 0, 0, 1]
  };
}
```

## Anti-Patterns

### Wrong: Using Fade for Everything
```javascript
// Lazy approach - loses spatial meaning
const transition = { type: 'fade', duration: 200 };
```

### Wrong: Container Transform for Unrelated Content
```javascript
// Card doesn't transform into settings page
// Use shared-axis or fade-through instead
containerTransform(card, settingsPage); // Wrong!
```

### Wrong: Same Duration for All
```javascript
// Container transform needs more time than fade
const duration = 300; // For everything? No!
```

## Real-World Examples

| Scenario | Pattern | Why |
|----------|---------|-----|
| Email list → email detail | Container Transform | Row becomes detail view |
| Tab 1 → Tab 2 | Shared Axis X | Horizontal navigation |
| Scroll down feed | Shared Axis Y | Vertical navigation |
| Profile → Settings | Shared Axis Z | Drill-down |
| Dashboard → Analytics | Fade Through | Same area, different widget |
| Show toast | Fade | Transient, no relationship |
| Photo grid → Photo viewer | Container Transform | Thumbnail morphs |
| App drawer open | Shared Axis Z | Depth change |
