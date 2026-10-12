---
name: motion-design
description: Motion values and patterns for the Breakup app (React Native / Expo, Reanimated). Use when choosing durations, easing, springs, entrance/exit, loops, loading or empty states, chat micro-interactions, notifications, onboarding motion, or reduced-motion handling. For Reanimated code recipes use animate-expo first; this skill supplies the numbers and the pattern vocabulary.
---

# Motion design (curated for Breakup)

A curated subset of soilmass/motion-design-agent v3.3.0 (MIT, see LICENSE). 18 of 86 sub-skills kept, the ones that matter for a mobile app. Web-only, video, Remotion and Disney-theory skills were left out.

## How to use

1. Read the project rules in `CLAUDE.md` first: when this skill disagrees with them (durations, loops, springs), the project rules win.
2. Open only the reference you need from the table below.
3. Take values from `tokens/*.tokens.json` (W3C DTCG format). `tokens/react-native-motion.tokens.json` and `tokens/ios-motion.tokens.json` are the closest to our platform.
4. Most references show CSS, Framer Motion or GSAP code. Translate it to Reanimated 3 (`withTiming`, `withSpring`, `Easing.bezier`) and Gesture Handler; `react-native.md` shows the mapping.
5. Always check `accessibility.md` and respect `useReducedMotion()`.

## References

| File | Use for |
|---|---|
| `references/react-native.md` | Reanimated, Gesture Handler, Moti, expo-haptics, reduced motion. Start here |
| `references/duration.md` | Duration scale by context |
| `references/easing.md` | Curves and springs |
| `references/accessibility.md` | Reduced-motion alternatives |
| `references/ui-micro.md` | Button press, toggles, chat send |
| `references/microstate.md` | Hover/press/selected/disabled states, optimistic UI |
| `references/loading-states.md` | Typing indicator, skeletons, plan "assembling" screen |
| `references/empty-states.md` | First-run screens |
| `references/onboarding.md` | The 16-screen quiz flow |
| `references/notifications.md` | Incoming Nick messages, in-app banners |
| `references/entrance-patterns.md` / `exit-patterns.md` | Message bubbles, sheets, screens |
| `references/sequencing.md` | Stagger and cascade |
| `references/gesture-motion.md` | Swipe, drag, velocity handoff |
| `references/looping.md` | Seamless loops (the craving Wave) |
| `references/opacity.md` / `scale.md` | Breathing patterns, fades |
| `references/emotion-mapping.md` | Calm vs celebratory motion (relapse vs milestone) |

Sub-folders under `references/<name>/` hold the deeper notes each file links to.

## Known gaps

`gesture-motion.md`, `ui-micro.md` and `loading-states.md` link to `references/gesture-implementations.md`, `micro-patterns.md` and `optimistic-patterns.md`. Those files do not exist in the upstream repo either; ignore the links.
