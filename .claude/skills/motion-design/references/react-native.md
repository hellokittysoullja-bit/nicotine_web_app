
# React Native Animation

Cross-platform mobile animation with native performance.

## API Selection

| API | Use Case | Performance |
|-----|----------|-------------|
| **Animated** | Simple animations, transforms | Good (native driver) |
| **Reanimated 3** | Gesture-driven, complex | Excellent (worklets) |
| **LayoutAnimation** | Layout changes | Good (auto) |
| **Moti** | Declarative (Reanimated wrapper) | Excellent |

## Animated API

### Basic Animation

```jsx
import { Animated } from 'react-native';

const fadeAnim = useRef(new Animated.Value(0)).current;

// Fade in
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 300,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: true  // Always use when possible
}).start();

// Apply
<Animated.View style={{ opacity: fadeAnim }}>
  <Content />
</Animated.View>
```

### M3-Aligned Easing

```javascript
import { Easing } from 'react-native';

const M3Easing = {
  // Standard
  standard: Easing.bezier(0.2, 0, 0, 1),

  // Emphasized-decelerate (entrance)
  emphasizedDecelerate: Easing.bezier(0.05, 0.7, 0.1, 1),

  // Emphasized-accelerate (exit)
  emphasizedAccelerate: Easing.bezier(0.3, 0, 0.8, 0.15),

  // Standard-decelerate
  standardDecelerate: Easing.bezier(0, 0, 0, 1)
};
```

### Spring Animation

```jsx
Animated.spring(scaleAnim, {
  toValue: 1,
  tension: 100,     // Stiffness equivalent
  friction: 10,     // Damping equivalent
  useNativeDriver: true
}).start();

// M3-aligned springs
const M3Springs = {
  fast: { tension: 400, friction: 20 },      // Small elements
  default: { tension: 200, friction: 18 },   // Standard UI
  slow: { tension: 100, friction: 15 }       // Large elements
};
```

### Parallel & Sequence

```jsx
// Parallel (simultaneous)
Animated.parallel([
  Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
  Animated.timing(translateY, { toValue: 0, duration: 300, useNativeDriver: true })
]).start();

// Sequence (one after another)
Animated.sequence([
  Animated.timing(scale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
  Animated.spring(scale, { toValue: 1, ...M3Springs.fast, useNativeDriver: true })
]).start();

// Stagger
Animated.stagger(50, items.map((_, i) =>
  Animated.timing(anims[i], { toValue: 1, duration: 300, useNativeDriver: true })
)).start();
```

## Reanimated 3

### Basic Usage

```jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming
} from 'react-native-reanimated';

function AnimatedBox() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const onPress = () => {
    scale.value = withSpring(1.2, {
      damping: 15,
      stiffness: 150
    });
  };

  return (
    <Animated.View style={[styles.box, animatedStyle]} />
  );
}
```

### M3 Springs (Reanimated)

```javascript
import { withSpring } from 'react-native-reanimated';

const m3Spring = {
  fast: {
    spatial: { damping: 20, stiffness: 400 },
    effects: { damping: 25, stiffness: 600 }
  },
  default: {
    spatial: { damping: 15, stiffness: 200 },
    effects: { damping: 20, stiffness: 400 }
  },
  slow: {
    spatial: { damping: 12, stiffness: 100 },
    effects: { damping: 15, stiffness: 200 }
  }
};

// Usage
scale.value = withSpring(1, m3Spring.default.spatial);
opacity.value = withSpring(1, m3Spring.default.effects);
```

### Gesture Integration

```jsx
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS
} from 'react-native-reanimated';

function SwipeCard() {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      opacity.value = 1 - Math.abs(e.translationX) / 300;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > 150) {
        // Dismiss
        translateX.value = withSpring(e.translationX > 0 ? 400 : -400);
        opacity.value = withTiming(0, { duration: 200 });
      } else {
        // Snap back
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
      }
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: opacity.value
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.card, style]} />
    </GestureDetector>
  );
}
```

### Layout Animations

```jsx
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  Layout
} from 'react-native-reanimated';

// Entering/Exiting
<Animated.View
  entering={FadeIn.duration(300)}
  exiting={FadeOut.duration(200)}
>
  <Content />
</Animated.View>

// Custom entering
<Animated.View
  entering={SlideInRight.springify().damping(15)}
  exiting={SlideOutLeft.duration(200)}
>
  <Content />
</Animated.View>

// Layout animation (for list reordering)
<Animated.View layout={Layout.springify()}>
  <Content />
</Animated.View>
```

## LayoutAnimation (Simple)

```jsx
import { LayoutAnimation, UIManager, Platform } from 'react-native';

// Enable on Android
if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// Before state change
LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
setExpanded(!expanded);

// Custom config
LayoutAnimation.configureNext({
  duration: 300,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.85
  }
});
```

## Accessibility

```jsx
import { AccessibilityInfo } from 'react-native';

// Check reduced motion
const [reduceMotion, setReduceMotion] = useState(false);

useEffect(() => {
  AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion);

  const subscription = AccessibilityInfo.addEventListener(
    'reduceMotionChanged',
    setReduceMotion
  );

  return () => subscription.remove();
}, []);

// Conditional animation
const duration = reduceMotion ? 0 : 300;
```

## Haptic Feedback

```jsx
import * as Haptics from 'expo-haptics';
// or
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

// Pair with animations
const onButtonPress = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

  scale.value = withSequence(
    withTiming(0.95, { duration: 50 }),
    withSpring(1)
  );
};
```

## Duration Scale

| Token | RN Duration | Use |
|-------|-------------|-----|
| `short-1` | 50 | Micro-feedback |
| `short-4` | 200 | Buttons, toggles |
| `medium-2` | 300 | Modals, sheets |
| `long-2` | 500 | Screen transitions |

## Performance Tips

1. **Always use `useNativeDriver: true`** when possible
2. **Avoid animating layout properties** (width, height, margin)
3. **Use `transform` and `opacity`** for best performance
4. **Reanimated worklets** run on UI thread
5. **Memoize animated styles** to prevent re-renders

## Related Skills

- **Dependencies:** easing, duration, spring, gesture-motion
- **See also:** ios-native, android-native, accessibility
- **Libraries:** react-native-reanimated, react-native-gesture-handler, moti
