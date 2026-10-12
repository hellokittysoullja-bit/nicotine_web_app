
# Data Visualization Animation

Motion patterns for charts, graphs, and data-driven interfaces.

## Core Principles

1. **Data Integrity** - Animation must not distort data perception
2. **Object Constancy** - Same data point = same visual element
3. **Staged Reveal** - Complex data shown progressively
4. **Transition Clarity** - Changes must be trackable by the eye

## Chart Entrance Patterns

### Bar Chart

```javascript
// Grow from baseline
bars.transition()
    .duration(500)
    .delay((d, i) => i * 50)  // Stagger
    .attr("height", d => yScale(d.value))
    .attr("y", d => height - yScale(d.value))
    .ease(d3.easeCubicOut);  // M3 standard-decelerate
```

### Line Chart

```javascript
// Path drawing animation
const totalLength = path.node().getTotalLength();

path
    .attr("stroke-dasharray", totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1000)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);
```

### Pie/Donut Chart

```javascript
// Arc interpolation
const arcTween = (d) => {
    const interpolate = d3.interpolate(
        { startAngle: 0, endAngle: 0 },
        d
    );
    return (t) => arc(interpolate(t));
};

slices.transition()
    .duration(750)
    .attrTween("d", arcTween);
```

### Scatter Plot

```javascript
// Scale-in points with stagger
points.transition()
    .duration(300)
    .delay((d, i) => i * 20)
    .attr("r", 5)
    .attr("opacity", 1)
    .ease(d3.easeCubicOut);
```

## Data Update Transitions

### Enter-Update-Exit Pattern

```javascript
// D3 standard pattern
const bars = svg.selectAll(".bar")
    .data(data, d => d.id);  // Key function for object constancy

// EXIT - remove old elements
bars.exit()
    .transition()
    .duration(200)
    .attr("opacity", 0)
    .attr("height", 0)
    .remove();

// UPDATE - animate existing elements
bars.transition()
    .duration(300)
    .attr("x", d => xScale(d.category))
    .attr("height", d => yScale(d.value));

// ENTER - add new elements
bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("opacity", 0)
    .attr("height", 0)
    .transition()
    .duration(300)
    .delay(200)  // After exit completes
    .attr("opacity", 1)
    .attr("height", d => yScale(d.value));
```

### Morphing Between Chart Types

```javascript
// Bar to pie transition
// 1. Bars collapse to center
// 2. Transform to wedges
// 3. Expand radially

function barToPie(bars, pie) {
    // Phase 1: Collapse
    bars.transition()
        .duration(300)
        .attr("width", 20)
        .attr("x", centerX - 10);

    // Phase 2: Morph (using FLIP)
    setTimeout(() => {
        // Replace DOM, animate with FLIP
    }, 300);
}
```

## Number Animation

### Counting Up

```javascript
function animateValue(element, start, end, duration) {
    const range = end - start;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Eased progress
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        const current = start + (range * eased);

        element.textContent = Math.round(current).toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}
```

### Odometer Effect

```css
.digit {
    display: inline-block;
    overflow: hidden;
    height: 1em;
}

.digit-inner {
    transition: transform 0.3s ease-out;
}

/* Move to show correct digit */
.digit-inner[data-value="5"] {
    transform: translateY(-500%);
}
```

## Timing Guidelines

| Chart Type | Duration | Stagger | Easing |
|------------|----------|---------|--------|
| Bar entrance | 500ms | 50ms/bar | ease-out |
| Line draw | 1000ms | - | linear |
| Pie reveal | 750ms | - | ease-out |
| Scatter entrance | 300ms | 20ms/point | ease-out |
| Data update | 300ms | - | ease-in-out |
| Number count | 500-1000ms | - | ease-out |

## Accessibility

### Reduced Motion

```javascript
const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const duration = prefersReducedMotion ? 0 : 500;
const stagger = prefersReducedMotion ? 0 : 50;
```

### Screen Reader Announcements

```javascript
// Announce data changes
function announceUpdate(newValue) {
    const announcement = document.getElementById('sr-announcement');
    announcement.textContent = `Value updated to ${newValue}`;
}
```

## Performance

### Large Datasets

```javascript
// Virtualize off-screen elements
// Only animate visible items
const visibleData = data.filter(d =>
    xScale(d.x) > -margin && xScale(d.x) < width + margin
);

// Use CSS transforms (GPU accelerated)
bars.style("transform", d => `translateY(${yScale(d.value)}px)`);
```

### Canvas for 1000+ Points

```javascript
// Use canvas for large scatter plots
function drawPoints(ctx, data) {
    ctx.clearRect(0, 0, width, height);

    data.forEach(d => {
        ctx.beginPath();
        ctx.arc(xScale(d.x), yScale(d.y), 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Animate with requestAnimationFrame
function animate(progress) {
    const animatedData = data.map(d => ({
        ...d,
        y: d.startY + (d.endY - d.startY) * progress
    }));
    drawPoints(ctx, animatedData);
}
```

## Library-Specific Patterns

### D3.js

```javascript
// Custom easing matching M3
const m3Standard = t =>
    t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;

d3.transition()
    .ease(m3Standard);
```

### Chart.js

```javascript
new Chart(ctx, {
    options: {
        animation: {
            duration: 500,
            easing: 'easeOutCubic',
            onProgress: (animation) => {
                // Custom logic during animation
            }
        },
        transitions: {
            active: {
                animation: {
                    duration: 200
                }
            }
        }
    }
});
```

### Recharts (React)

```jsx
<BarChart>
    <Bar
        dataKey="value"
        animationDuration={500}
        animationEasing="ease-out"
        animationBegin={0}
    />
</BarChart>
```

## Related Skills

- **Dependencies:** easing, duration, sequencing
- **See also:** entrance-patterns, accessibility
- **Tokens:** `tokens/data-visualization.tokens.json`
