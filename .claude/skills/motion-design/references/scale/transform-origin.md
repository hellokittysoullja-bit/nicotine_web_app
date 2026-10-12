# Transform Origin Reference

Detailed guide to transform origins for scale animations.

## Understanding Transform Origin

Transform origin defines the point around which transforms (scale, rotate) occur. For scale animations, this determines which edge/corner stays fixed.

## Default Behavior

```css
transform-origin: center center; /* or just "center" */
```

Element scales uniformly from its center point.

## CSS Syntax

```css
/* Keywords */
transform-origin: top;          /* center top */
transform-origin: bottom left;  /* left bottom */
transform-origin: center right; /* right center */

/* Percentages (from top-left corner) */
transform-origin: 0% 0%;        /* top-left */
transform-origin: 100% 0%;      /* top-right */
transform-origin: 50% 50%;      /* center (default) */
transform-origin: 50% 100%;     /* bottom-center */

/* Pixels (from top-left corner) */
transform-origin: 0px 0px;      /* top-left */
transform-origin: 20px 20px;    /* 20px from top-left */

/* 3D (with z-offset) */
transform-origin: center center 50px; /* z-offset for 3D */
```

## Common UI Patterns

### Dropdown Menus (Origin: Top)

Menu appears to grow from the trigger button.

```css
.dropdown-trigger {
  /* position: relative to contain dropdown */
}

.dropdown-menu {
  transform-origin: center top;
  transform: scaleY(0);
  opacity: 0;
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

.dropdown-trigger:focus + .dropdown-menu,
.dropdown-menu:focus-within {
  transform: scaleY(1);
  opacity: 1;
}
```

### Tooltips (Origin: Varies by Position)

Tooltip grows from the edge nearest to trigger.

```css
/* Tooltip above trigger */
.tooltip.top {
  transform-origin: center bottom;
}

/* Tooltip below trigger */
.tooltip.bottom {
  transform-origin: center top;
}

/* Tooltip to the left */
.tooltip.left {
  transform-origin: right center;
}

/* Tooltip to the right */
.tooltip.right {
  transform-origin: left center;
}
```

### FAB Speed Dial (Origin: Bottom-Right)

Speed dial options expand from the FAB button.

```css
.fab {
  position: fixed;
  bottom: 16px;
  right: 16px;
}

.fab-options {
  transform-origin: right bottom;
  transform: scale(0);
  opacity: 0;
}

.fab:focus-within .fab-options {
  transform: scale(1);
  opacity: 1;
}
```

### Context Menu (Origin: Click Point)

Dynamic origin based on click position.

```javascript
function showContextMenu(event, menu) {
  const rect = menu.getBoundingClientRect();

  // Calculate origin based on click position
  const originX = event.clientX - rect.left;
  const originY = event.clientY - rect.top;

  menu.style.transformOrigin = `${originX}px ${originY}px`;
  menu.classList.add('visible');
}
```

### Card Expansion (Origin: Trigger Element)

Card expands from a thumbnail or trigger.

```javascript
function expandCard(thumbnail, expandedCard) {
  const thumbRect = thumbnail.getBoundingClientRect();
  const cardRect = expandedCard.getBoundingClientRect();

  // Calculate origin relative to expanded card
  const originX = thumbRect.left - cardRect.left + thumbRect.width / 2;
  const originY = thumbRect.top - cardRect.top + thumbRect.height / 2;

  expandedCard.style.transformOrigin = `${originX}px ${originY}px`;
}
```

## Framework Implementations

### Framer Motion

```tsx
// Using style prop
<motion.div
  style={{ originX: 0, originY: 0 }} // top-left (0-1 range)
  animate={{ scale: 1 }}
  initial={{ scale: 0 }}
/>

// Using percentages
<motion.div
  style={{ transformOrigin: "left top" }}
  animate={{ scale: 1 }}
  initial={{ scale: 0 }}
/>

// Dynamic origin
<motion.div
  style={{
    originX: useMotionValue(0.5),
    originY: useMotionValue(0.5)
  }}
/>
```

### GSAP

```javascript
// Set before animation
gsap.set(element, { transformOrigin: "left top" });
gsap.from(element, { scale: 0 });

// Or inline
gsap.from(element, {
  scale: 0,
  transformOrigin: "right bottom"
});

// Dynamic update
gsap.to(element, {
  transformOrigin: "50% 100%", // can animate!
  duration: 0.3
});
```

### Remotion

```tsx
export const ScaleFromCorner: React.FC = () => {
  const frame = useCurrentFrame();
  const scale = spring({
    frame,
    fps: 30,
    config: { damping: 15 }
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'left top'
      }}
    >
      Content
    </div>
  );
};
```

## M3 Container Transform

Material Design 3's container transform uses dynamic origin based on the source container's position relative to the destination.

```javascript
function calculateContainerTransformOrigin(source, destination) {
  const sourceRect = source.getBoundingClientRect();
  const destRect = destination.getBoundingClientRect();

  // Origin is where source center maps to destination
  const originX = ((sourceRect.left + sourceRect.width / 2) - destRect.left) / destRect.width * 100;
  const originY = ((sourceRect.top + sourceRect.height / 2) - destRect.top) / destRect.height * 100;

  return `${originX}% ${originY}%`;
}
```

## Scale Direction Patterns

### Scale Y Only (Accordion, Collapse)

```css
.accordion-content {
  transform-origin: center top;
  transform: scaleY(0);
  height: auto; /* or fixed height */
}

.accordion.open .accordion-content {
  transform: scaleY(1);
}
```

### Scale X Only (Horizontal Reveal)

```css
.horizontal-reveal {
  transform-origin: left center;
  transform: scaleX(0);
}

.horizontal-reveal.visible {
  transform: scaleX(1);
}
```

## Performance Notes

1. **Transform origin change** triggers a repaint, not a reflow
2. **Animate scale, not origin** when possible
3. **Set origin before animation** rather than during
4. **Use `will-change: transform`** for optimization
5. **3D origins** require `perspective` on parent for visible effect

## Accessibility Considerations

1. **Reduce motion** users: Consider instant origin or no origin animation
2. **Focus management**: Ensure focus follows expanding content
3. **Screen readers**: Scale animations don't affect content reading
