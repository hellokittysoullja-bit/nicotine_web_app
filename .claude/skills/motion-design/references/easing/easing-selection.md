# Easing Selection Guide

## Quick Reference

| Animation Type | Easing | Token |
|----------------|--------|-------|
| Element appearing | emphasized-decelerate | `{motion.easing.emphasized-decelerate}` |
| Element disappearing | emphasized-accelerate | `{motion.easing.emphasized-accelerate}` |
| Element moving | standard | `{motion.easing.standard}` |
| Continuous/looping | linear | `{motion.easing.linear}` |
| State change | standard | `{motion.easing.standard}` |

## Decision Flow

```
START
│
├─ Is the element ENTERING the viewport?
│   └─ YES → emphasized-decelerate
│
├─ Is the element EXITING the viewport?
│   └─ YES → emphasized-accelerate
│
├─ Is the element MOVING within viewport?
│   └─ YES → standard
│
├─ Is it a CONTINUOUS animation (spinner, progress)?
│   └─ YES → linear
│
└─ Is it a simple STATE CHANGE (color, opacity)?
    └─ YES → standard
```

## Why These Choices

### Emphasized-Decelerate for Entrances
- Fast start captures attention
- Slow settle feels natural (like catching a ball)
- Creates welcoming feel

### Emphasized-Accelerate for Exits
- Slow start prevents jarring departure
- Fast exit doesn't block user
- Feels like throwing away

### Standard for Movement
- Balanced feel for repositioning
- Not too fast, not too slow
- Universal use case

### Linear for Continuous
- No artificial "slowing down"
- Consistent speed for progress indicators
- Feels mechanical (appropriate for loading)

## Edge Cases

### Hover States
Use `standard` with short duration (150-200ms).

### Toggle Switches
Use `standard` — both on and off are state changes, not enter/exit.

### Accordions
- Opening: `emphasized-decelerate` (content entering)
- Closing: `emphasized-accelerate` (content exiting)

### Tooltips
- Show: `emphasized-decelerate`
- Hide: `emphasized-accelerate`

### Page Transitions
Use `emphasized` for both entering and exiting pages (creates continuity).

## Common Mistakes

1. **Using ease-in for entrances** — Feels sluggish
2. **Using ease-out for exits** — Feels like it's fighting to stay
3. **Using linear for UI** — Feels robotic (except progress)
4. **Ignoring physics** — Curves should feel natural
