
# Empty State Animations

Motion patterns for empty, null, and zero-data UI states.

## Empty State Types

| Type | Context | Animation Style |
|------|---------|-----------------|
| **First-time** | New user, no data yet | Welcoming, guiding |
| **No results** | Search/filter returned empty | Helpful, suggestive |
| **Cleared** | User deleted all items | Acknowledging, light |
| **Error** | Failed to load data | Reassuring, retry-focused |
| **Offline** | No network connection | Informative, patient |

## Illustration Animation

### Gentle Float

```css
/* Subtle floating motion */
@keyframes gentle-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.empty-illustration {
  animation: gentle-float 3s ease-in-out infinite;
}

/* Reduced motion: static */
@media (prefers-reduced-motion: reduce) {
  .empty-illustration {
    animation: none;
  }
}
```

### Breathing Pulse

```css
@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.02);
    opacity: 0.9;
  }
}

.empty-icon {
  animation: breathe 2.5s ease-in-out infinite;
}
```

### Subtle Rotation

```javascript
// For circular or balanced illustrations
gsap.to('.empty-illustration', {
  rotation: 360,
  duration: 20,
  repeat: -1,
  ease: 'none'
});
```

## Entrance Animation

### Fade + Scale

```javascript
// Primary entrance for empty states
const emptyStateEntrance = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.4,
    ease: [0.05, 0.7, 0.1, 1]
  }
};

// Staggered content
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};
```

### Illustration First

```jsx
function EmptyState({ illustration, title, description, action }) {
  return (
    <motion.div variants={containerVariants} initial="initial" animate="animate">
      <motion.div
        variants={itemVariants}
        transition={{ duration: 0.5 }}
      >
        {illustration}
      </motion.div>

      <motion.h3
        variants={itemVariants}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {title}
      </motion.h3>

      <motion.p
        variants={itemVariants}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        {description}
      </motion.p>

      <motion.button
        variants={itemVariants}
        transition={{ duration: 0.3, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {action}
      </motion.button>
    </motion.div>
  );
}
```

## Context-Specific Patterns

### No Search Results

```javascript
// Emphasize search bar, suggest alternatives
const noResultsAnimation = {
  illustration: {
    initial: { opacity: 0, scale: 0.9 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 }
    }
  },
  searchHighlight: {
    animate: {
      boxShadow: [
        '0 0 0 0 rgba(59, 130, 246, 0)',
        '0 0 0 4px rgba(59, 130, 246, 0.3)',
        '0 0 0 0 rgba(59, 130, 246, 0)'
      ],
      transition: {
        duration: 1.5,
        delay: 0.5,
        repeat: 2
      }
    }
  }
};
```

### First-Time Empty

```javascript
// Welcoming, guide to action
const firstTimeAnimation = {
  container: {
    animate: {
      transition: { staggerChildren: 0.15 }
    }
  },
  illustration: {
    initial: { opacity: 0, y: -20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 15
      }
    }
  },
  ctaButton: {
    animate: {
      scale: [1, 1.02, 1],
      transition: {
        delay: 1,
        duration: 0.5,
        repeat: 2,
        repeatDelay: 2
      }
    }
  }
};
```

### Error State

```javascript
// Reassuring, focus on retry
const errorAnimation = {
  icon: {
    animate: {
      rotate: [0, -5, 5, 0],
      transition: {
        duration: 0.4,
        delay: 0.3
      }
    }
  },
  retryButton: {
    whileHover: {
      scale: 1.02,
      transition: { duration: 0.2 }
    },
    whileTap: { scale: 0.98 }
  }
};
```

### Offline State

```javascript
// Patient, informative
const offlineAnimation = {
  cloudIcon: {
    animate: {
      opacity: [1, 0.5, 1],
      transition: {
        duration: 2,
        repeat: Infinity
      }
    }
  },
  connectionLine: {
    animate: {
      strokeDashoffset: [0, 20],
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  }
};
```

## Transition to Content

### Content Arrives

```jsx
function ListWithEmpty({ items }) {
  return (
    <AnimatePresence mode="wait">
      {items.length === 0 ? (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <EmptyState />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ItemList items={items} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

### Smooth Replacement

```javascript
// Empty state fades out as content fades in
const exitTransition = {
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 }
  }
};

const enterTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      delay: 0.1  // Slight delay after empty exits
    }
  }
};
```

## Lottie Integration

```jsx
import Lottie from 'lottie-react';
import emptyAnimation from './empty-state.json';

function EmptyStateWithLottie() {
  return (
    <div className="empty-state">
      <Lottie
        animationData={emptyAnimation}
        loop={true}
        autoplay={true}
        style={{ width: 200, height: 200 }}
      />
      <h3>No items yet</h3>
      <p>Create your first item to get started</p>
    </div>
  );
}
```

## Performance Considerations

```javascript
// Pause animation when not visible
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => setIsVisible(entry.isIntersecting)
  );
  observer.observe(emptyStateRef.current);
  return () => observer.disconnect();
}, []);

// Only animate when visible
<Lottie
  animationData={animation}
  loop={isVisible}
  autoplay={isVisible}
/>
```

## Timing Guidelines

| Element | Duration | Notes |
|---------|----------|-------|
| Illustration entrance | 400-500ms | Slightly longer for visual impact |
| Text entrance | 200-300ms | Fast, readable |
| Button entrance | 200ms | Quick, actionable |
| Stagger delay | 100-150ms | Between elements |
| Loop animation | 2-3s cycle | Gentle, not distracting |

## Related Skills

- **Dependencies:** easing, duration, entrance-patterns
- **See also:** loading-states, error-states, onboarding
- **Patterns:** Float, breathe, pulse, stagger entrance
