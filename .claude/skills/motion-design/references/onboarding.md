
# Onboarding Animation

Motion patterns for user onboarding, tutorials, and first-run experiences.

## Onboarding Types

| Type | Motion Style | Duration |
|------|--------------|----------|
| **Carousel** | Swipe/slide | 300-400ms per slide |
| **Feature Tour** | Spotlight + tooltip | 200-300ms per step |
| **Progressive** | Staged reveal | 150-250ms per element |
| **Story** | Full-screen narrative | 500-1000ms transitions |

## Carousel Onboarding

### Slide Transitions

```jsx
// Framer Motion carousel
<AnimatePresence mode="wait">
  <motion.div
    key={currentSlide}
    initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
    transition={{
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 }
    }}
  >
    <SlideContent {...slides[currentSlide]} />
  </motion.div>
</AnimatePresence>
```

### Illustration Entrance

```javascript
// Staggered illustration elements
const illustrationVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.05, 0.7, 0.1, 1]
    }
  })
};

// Elements enter sequentially
{illustrationParts.map((part, i) => (
  <motion.div
    custom={i}
    variants={illustrationVariants}
    initial="hidden"
    animate="visible"
  >
    {part}
  </motion.div>
))}
```

### Progress Indicators

```css
/* Dot indicator transition */
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.2);
  transition: all 200ms ease-out;
}

.dot.active {
  width: 24px;
  border-radius: 4px;
  background: #000;
}
```

## Feature Tour (Spotlight)

### Spotlight Animation

```javascript
// Animated spotlight mask
function animateSpotlight(target) {
  const rect = target.getBoundingClientRect();

  gsap.to('.spotlight', {
    '--x': rect.left + rect.width / 2,
    '--y': rect.top + rect.height / 2,
    '--size': Math.max(rect.width, rect.height) + 20,
    duration: 0.4,
    ease: 'power2.inOut'
  });
}
```

```css
.spotlight-overlay {
  background: radial-gradient(
    circle at var(--x, 50%) var(--y, 50%),
    transparent 0,
    transparent calc(var(--size, 0) * 0.5px),
    rgba(0, 0, 0, 0.8) calc(var(--size, 0) * 0.5px + 1px)
  );
  transition: all 400ms ease-in-out;
}
```

### Tooltip Positioning

```javascript
const tooltipVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.05, 0.7, 0.1, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
};
```

### Step Transitions

```javascript
// Sequential step animation
async function goToStep(stepIndex) {
  // 1. Exit current tooltip
  await animateOut(currentTooltip);

  // 2. Move spotlight
  await animateSpotlight(steps[stepIndex].target);

  // 3. Enter new tooltip
  await animateIn(steps[stepIndex].tooltip);

  currentStep = stepIndex;
}
```

## Progressive Disclosure

### Staged Content Reveal

```jsx
function OnboardingForm() {
  const [stage, setStage] = useState(0);

  return (
    <div>
      {/* Always visible */}
      <motion.div layout>
        <NameInput />
      </motion.div>

      {/* Stage 1: After name entered */}
      <AnimatePresence>
        {stage >= 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EmailInput />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 2: After email entered */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <PreferencesInput />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

### Celebration on Completion

```javascript
// Onboarding complete celebration
function celebrateCompletion() {
  // 1. Success icon animation
  gsap.fromTo('.success-icon', {
    scale: 0,
    rotation: -180
  }, {
    scale: 1,
    rotation: 0,
    duration: 0.5,
    ease: 'back.out(1.5)'
  });

  // 2. Confetti burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });

  // 3. Text reveal
  gsap.from('.completion-text', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    delay: 0.3
  });
}
```

## Story Onboarding

### Full-Screen Transitions

```jsx
// Narrative transitions between screens
const pageVariants = {
  initial: { opacity: 0, scale: 1.1 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.2, 0, 0, 1]
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: [0.3, 0, 0.8, 0.15]
    }
  }
};
```

### Lottie Illustrations

```jsx
import Lottie from 'lottie-react';
import onboardingAnimation from './onboarding.json';

function OnboardingSlide() {
  const [animationData] = useState(onboardingAnimation);
  const lottieRef = useRef();

  // Play on slide entry
  useEffect(() => {
    lottieRef.current?.goToAndPlay(0);
  }, []);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop={false}
      autoplay={false}
    />
  );
}
```

## Skip/Dismiss Patterns

### Skip Button

```jsx
<motion.button
  whileHover={{ opacity: 0.8 }}
  whileTap={{ scale: 0.95 }}
  onClick={skipOnboarding}
>
  Skip
</motion.button>
```

### Swipe to Dismiss

```javascript
const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) =>
  Math.abs(offset) * velocity;

const onDragEnd = (e, { offset, velocity }) => {
  if (swipePower(offset.x, velocity.x) > swipeConfidenceThreshold) {
    // Skip onboarding
    skipOnboarding();
  }
};
```

## Timing Guidelines

| Element | Duration | Easing |
|---------|----------|--------|
| Slide transition | 300-400ms | emphasized |
| Element entrance | 150-250ms | emphasized-decelerate |
| Spotlight move | 400ms | ease-in-out |
| Tooltip appear | 200ms | emphasized-decelerate |
| Progress dot | 200ms | ease-out |

## Accessibility

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .onboarding-slide {
    transition: opacity 150ms ease;
  }

  /* Disable slide motion */
  .onboarding-slide[data-direction="next"],
  .onboarding-slide[data-direction="prev"] {
    transform: none;
  }
}
```

### Skip Option

```jsx
// Always provide skip
<button
  className="skip-button"
  onClick={skipOnboarding}
  aria-label="Skip introduction"
>
  Skip
</button>
```

### Screen Reader

```jsx
<div
  role="region"
  aria-label={`Onboarding step ${currentStep} of ${totalSteps}`}
  aria-live="polite"
>
  {slideContent}
</div>
```

## Related Skills

- **Dependencies:** easing, duration, sequencing, entrance-patterns
- **See also:** attention-choreography, particles, celebrations
- **Patterns:** Carousel, spotlight, progressive disclosure
