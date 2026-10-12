
# Loading States

Animation patterns that keep users informed and engaged during asynchronous operations. Good loading states reduce perceived wait time and prevent abandonment.

## Core Principles

1. **Immediate feedback** - Show something within 100ms
2. **Progressive disclosure** - More detail as wait extends
3. **Accurate expectations** - Determinate when possible
4. **Minimal distraction** - Subtle animation, not attention-grabbing

## Pattern Categories

| Pattern | Use When | Duration |
|---------|----------|----------|
| Skeleton | Content structure known | 200ms - 3s |
| Spinner | Unknown structure/duration | 200ms - 10s |
| Progress bar | Duration known/calculable | 500ms - 60s |
| Optimistic UI | Action likely to succeed | Instant |
| Placeholder | Content being generated | 1s+ |

## Skeleton Screens

Placeholder that mirrors content structure. Reduces perceived load time by 30-40%.

### CSS Implementation

```css
/* Base skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--skeleton-base) 25%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
}

:root {
  --skeleton-base: #e0e0e0;
  --skeleton-highlight: #f0f0f0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --skeleton-base: #2a2a2a;
    --skeleton-highlight: #3a3a3a;
  }
}

@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Skeleton shapes */
.skeleton-text { height: 1em; border-radius: 4px; }
.skeleton-title { height: 1.5em; width: 60%; border-radius: 4px; }
.skeleton-avatar { width: 48px; height: 48px; border-radius: 50%; }
.skeleton-image { aspect-ratio: 16/9; border-radius: 8px; }
```

## Progress Indicators

### Determinate Progress

```css
/* Linear progress bar */
.progress-bar {
  height: 4px;
  background: var(--progress-track);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--progress-fill);
  border-radius: 2px;
  transition: width 200ms ease-out;
}
```

### Indeterminate Progress

```css
/* Indeterminate linear */
.progress-indeterminate {
  height: 4px;
  background: var(--progress-track);
  overflow: hidden;
  position: relative;
}

.progress-indeterminate::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: var(--progress-fill);
  animation: indeterminate 1.5s ease-in-out infinite;
}

@keyframes indeterminate {
  0% { left: -30%; }
  100% { left: 100%; }
}
```

## Optimistic UI

Update UI immediately, reconcile with server after. See `references/optimistic-patterns.md` for implementation details.

### Key Pattern

```typescript
// Optimistic update flow
const handleAction = async () => {
  const newValue = !value;
  setValue(newValue); // Optimistic update

  try {
    await api.update(newValue);
  } catch {
    setValue(!newValue); // Revert on failure
  }
};
```

## Content Placeholder Transitions

Smooth transition from skeleton to real content:

```typescript
<AnimatePresence mode="wait">
  {isLoading ? (
    <motion.div
      key="skeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {skeleton}
    </motion.div>
  ) : (
    <motion.div
      key="content"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )}
</AnimatePresence>
```

## Timing Guidelines

| Wait Duration | Pattern |
|---------------|---------|
| < 100ms | No indicator needed |
| 100ms - 300ms | Subtle opacity change |
| 300ms - 1s | Skeleton or spinner |
| 1s - 10s | Progress bar if determinable |
| 10s+ | Progress + time estimate |

## Accessibility

```tsx
// Announce loading state to screen readers
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading && <span className="sr-only">Loading content...</span>}
  {!isLoading && content}
</div>

// Progress bar with aria labels
<div
  role="progressbar"
  aria-valuenow={progress}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Upload progress"
>
  {progress}%
</div>
```

## Common Mistakes

1. **No immediate feedback** - Always show something within 100ms
2. **Spinner for known content** - Use skeleton when structure is known
3. **Indeterminate when determinate possible** - Show progress when calculable
4. **Forgetting error states** - Loading can fail, handle it
5. **Jarring transitions** - Smooth fade from skeleton to content

## Related Skills

- `animation-recipes` - Pre-built loading animation recipes
- `accessibility` - WCAG compliance for loading states
- `component-animations` - Button loading states, form submissions
