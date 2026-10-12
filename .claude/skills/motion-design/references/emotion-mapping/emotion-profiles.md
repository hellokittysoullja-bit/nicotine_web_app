# Emotion Profiles - Implementation Details

Detailed animation profiles and implementation code for each emotion.

## Celebratory

**Animation Profile:**
```
Duration:        1.2× multiplier (longer to savor)
Exaggeration:    Expressive (1.6×)
Anticipation:    Medium (15-20% of duration)
Squash-Stretch:  Medium (8-12% deformation)
Follow-Through:  Loose (high overshoot)
Easing:          spring-bouncy
```

**Implementation:**
```typescript
// Framer Motion
const celebratoryTransition = {
  type: 'spring',
  damping: 8,
  stiffness: 180,
  mass: 1
};

// CSS
--celebratory-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
--celebratory-duration: calc(var(--base-duration) * 1.2);
```

**Secondary Effects:** Particles, glow, warm color shift

---

## Calming

**Animation Profile:**
```
Duration:        1.4× multiplier (slow, unhurried)
Exaggeration:    Subtle (1.1×)
Anticipation:    Micro (5% of duration)
Squash-Stretch:  None
Follow-Through:  Fluid (gradual settle)
Easing:          ease-in-out-gentle
```

**Implementation:**
```typescript
// Framer Motion
const calmingTransition = {
  type: 'spring',
  damping: 30,
  stiffness: 80,
  mass: 1.5
};

// CSS
--calming-ease: cubic-bezier(0.4, 0, 0.2, 1);
--calming-duration: calc(var(--base-duration) * 1.4);
```

**Secondary Effects:** None (clean, minimal)

---

## Urgent

**Animation Profile:**
```
Duration:        0.8× multiplier (fast, immediate)
Exaggeration:    Moderate (1.3×)
Anticipation:    None (instant response)
Squash-Stretch:  None
Follow-Through:  Snappy (quick settle)
Easing:          emphasized-accelerate
```

**Implementation:**
```typescript
// Framer Motion
const urgentTransition = {
  type: 'spring',
  damping: 30,
  stiffness: 400,
  mass: 0.5
};

// CSS
--urgent-ease: cubic-bezier(0.3, 0, 0.8, 0.15);
--urgent-duration: calc(var(--base-duration) * 0.8);
```

**Secondary Effects:** Pulse, no particles
**Accessibility:** Avoid rapid flashing; use border/color indicators

---

## Playful

**Animation Profile:**
```
Duration:        1.1× multiplier
Exaggeration:    Expressive (1.6×)
Anticipation:    Small (10-15% of duration)
Squash-Stretch:  Medium (8-12% deformation)
Follow-Through:  Bouncy (visible overshoot)
Easing:          spring-bouncy
```

**Implementation:**
```typescript
// Framer Motion
const playfulTransition = {
  type: 'spring',
  damping: 10,
  stiffness: 200,
  mass: 0.8
};
```

**Secondary Effects:** Optional particles, wobble, vibrant colors

---

## Professional

**Animation Profile:**
```
Duration:        1.0× multiplier (standard)
Exaggeration:    Subtle (1.1×)
Anticipation:    Micro (5% of duration)
Squash-Stretch:  None
Follow-Through:  Precise (exact target)
Easing:          standard
```

**Implementation:**
```typescript
// Framer Motion
const professionalTransition = {
  type: 'spring',
  damping: 25,
  stiffness: 150,
  mass: 1
};

// CSS
--professional-ease: cubic-bezier(0.2, 0, 0, 1);
```

**Secondary Effects:** None

---

## Combining Emotions with Brands

### Combination Formula

```typescript
function combineEmotionAndBrand(emotion: Emotion, brand: Brand): Parameters {
  const emotionParams = emotions[emotion].parameters;
  const brandModifiers = brands[brand].modifiers;

  return {
    exaggeration: emotionParams.exaggeration * brandModifiers.exaggeration,
    duration: emotionParams.duration * brandModifiers.duration,
    anticipation: emotionParams.anticipation,
    squashStretch: brand.allowsSquash ? emotionParams.squashStretch : 'none',
    easing: brandModifiers.preferredEasing || emotionParams.easing
  };
}
```

### Example Combinations

#### Celebratory + Elegant Brand
```
Base celebratory:     exaggeration 1.6×, duration 1.2×
Elegant modifier:     exaggeration 0.8×, duration 1.1×
Result:               exaggeration 1.28×, duration 1.32×
Additional:           No squash-stretch, refined spring
```

#### Urgent + Playful Brand
```
Base urgent:          exaggeration 1.3×, duration 0.8×
Playful modifier:     exaggeration 1.3×, duration 1.0×
Result:               exaggeration 1.69×, duration 0.8×
Additional:           Add subtle bounce to error shake
```

---

## Context Modifier Implementation

```typescript
function applyContextModifiers(
  params: Parameters,
  context: UserContext
): Parameters {
  const modifier = contextModifiers[context.type];

  return {
    ...params,
    duration: params.duration * modifier.durationMultiplier,
    exaggeration: params.exaggeration * modifier.exaggerationBoost,
    secondaryIntensity: Math.max(0,
      params.secondaryIntensity + modifier.secondaryBoost
    )
  };
}
```

---

## Emotion Blending Implementation

### Interpolation Method

For scenarios requiring mixed emotions, use weighted averaging:

```typescript
function blendEmotions(
  emotions: Array<{ emotion: Emotion; weight: number }>
): Parameters {
  const totalWeight = emotions.reduce((sum, e) => sum + e.weight, 0);

  return {
    durationMultiplier: emotions.reduce(
      (sum, e) => sum + (emotionParams[e.emotion].durationMultiplier * e.weight),
      0
    ) / totalWeight,

    exaggeration: emotions.reduce(
      (sum, e) => sum + (emotionParams[e.emotion].exaggeration * e.weight),
      0
    ) / totalWeight,

    // For discrete properties, use highest-weighted emotion
    easing: emotions.sort((a, b) => b.weight - a.weight)[0].emotion.easing
  };
}
```

---

## Reduced Motion CSS

```css
@media (prefers-reduced-motion: reduce) {
  .celebratory {
    animation: none;
    opacity: 1;
    transition: opacity 100ms;
  }

  .celebratory::after {
    content: '✓';
    /* Static success indicator */
  }
}
```
