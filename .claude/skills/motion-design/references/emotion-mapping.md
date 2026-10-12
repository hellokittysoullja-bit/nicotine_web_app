
# Emotion Mapping

Transform emotional intent into precise animation parameters. This skill enables autonomous interpretation of mood, tone, and feeling to generate appropriate motion design.

## Emotion Taxonomy

### Primary Emotions

| Emotion | Arousal | Valence | Core Use Case |
|---------|---------|---------|---------------|
| **Celebratory** | High | Positive | Success, achievements, milestones |
| **Calming** | Low | Positive | Reassurance, gentle guidance |
| **Urgent** | High | Neutral | Warnings, time-sensitive actions |
| **Playful** | Medium-High | Positive | Fun interactions, games |
| **Professional** | Low | Neutral | Business contexts, credibility |
| **Mysterious** | Medium | Neutral | Reveals, discovery moments |
| **Energetic** | High | Positive | Active, dynamic experiences |
| **Frustrated** | Medium-High | Negative | Error states (use sparingly) |
| **Trustworthy** | Low | Positive | Security, data handling |
| **Anticipatory** | Medium | Neutral | Loading, waiting states |
| **Delightful** | Medium-High | Positive | Easter eggs, surprises |
| **Focused** | Low | Neutral | Deep work, minimal distraction |
| **Welcoming** | Medium | Positive | Onboarding, first impressions |

### Arousal-Valence Model

Based on Russell's circumplex model of affect:

```
                    HIGH AROUSAL
                         |
        Frustrated       |       Celebratory
        Urgent           |       Energetic
                         |       Delightful
    ─────────────────────┼─────────────────────
    NEGATIVE             |             POSITIVE
                         |       Welcoming
        Focused          |       Trustworthy
                         |       Calming
                         |
                    LOW AROUSAL
```

## Emotion Parameter Mapping

Each emotion maps to specific animation parameters. See `emotion-mapping/emotion-profiles.md` for complete implementation details.

### Quick Reference

| Emotion | Duration | Exaggeration | Easing | Spring |
|---------|----------|--------------|--------|--------|
| Celebratory | 1.2x | 1.6x | spring-bouncy | damping: 8, stiffness: 180 |
| Calming | 1.4x | 1.1x | ease-in-out-gentle | damping: 30, stiffness: 80 |
| Urgent | 0.8x | 1.3x | emphasized-accelerate | damping: 30, stiffness: 400 |
| Playful | 1.1x | 1.6x | spring-bouncy | damping: 10, stiffness: 200 |
| Professional | 1.0x | 1.1x | standard | damping: 25, stiffness: 150 |

## Brand Attitude Modifiers

| Brand | Emotion Bias | Exaggeration Adjust | Duration Adjust |
|-------|--------------|---------------------|-----------------|
| Elegant | +calming, +professional | -20% | +10% |
| Playful | +playful, +delightful | +30% | +0% |
| Bold | +energetic, +urgent | +20% | -10% |
| Friendly | +welcoming, +trustworthy | +10% | +5% |

## Context Modifiers

| Context | Duration | Exaggeration | Secondary |
|---------|----------|--------------|-----------|
| First visit | +20% | +10% | +20% intensity |
| Repeat user | -10% | -10% | -10% intensity |
| Reduced motion | -50% | 0 | Disabled |
| Low power mode | -20% | -20% | -30% intensity |

## Emotion Blending

For scenarios requiring mixed emotions, use weighted averaging:

### Common Blends

| Blend | Emotions | Weights | Use Case |
|-------|----------|---------|----------|
| Confident Success | celebratory + trustworthy | 70/30 | Payment confirmation |
| Gentle Play | playful + calming | 60/40 | Children's apps |
| Business Welcome | professional + welcoming | 50/50 | B2B onboarding |
| Secure Alert | urgent + trustworthy | 60/40 | 2FA prompts |

## Accessibility Considerations

### Emotion-Safe Patterns

| Emotion | Accessibility Risk | Mitigation |
|---------|-------------------|------------|
| Urgent | Anxiety induction | Clear resolution path, no rapid flash |
| Frustrated | Stress amplification | Keep brief, offer help |
| Energetic | Motion sensitivity | Provide reduced alternative |
| Celebratory | Distraction | Allow dismissal |

### Reduced Motion Mapping

When `prefers-reduced-motion: reduce` is active:

| Original Emotion | Reduced Alternative |
|------------------|---------------------|
| Celebratory | Gentle fade + success icon |
| Playful | Standard transition |
| Energetic | Quick fade |
| Frustrated | Static error state + icon |

## Quick Reference: Emotion Selection

```
What's the user feeling or should feel?
├── Positive outcome → Celebratory
├── Error occurred → Frustrated (brief) → Offer resolution
├── Waiting → Anticipatory
├── Learning something new → Welcoming
├── Making a decision → Professional
├── Playing/exploring → Playful
├── Achieved something → Delightful
├── Needs reassurance → Calming
├── Time pressure → Urgent
├── Security context → Trustworthy
├── Deep work → Focused
└── Discovery moment → Mysterious
```

## Implementation Checklist

- [ ] Identify primary emotion for interaction
- [ ] Check brand compatibility
- [ ] Apply context modifiers (first visit, device, preferences)
- [ ] Generate parameters using formula
- [ ] Implement reduced motion alternative
- [ ] Test emotional resonance with users

## Related Skills

- `animation-recipes` - Pre-built animations for common emotional contexts
- `accessibility` - WCAG compliance for all emotional animations
- `easing` - Curve selection for different emotional profiles
- `duration` - Timing selection based on emotional context
