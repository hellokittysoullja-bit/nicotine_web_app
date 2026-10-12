---
name: motion-design
description: Motion values and patterns for the Breakup website/web app (phase 1) and Expo app (phase 2). Use when choosing durations, easing, springs, entrance/exit, scroll and page transitions, SVG/morphing, loops, loading or empty states, chat micro-interactions, notifications, onboarding motion, or reduced-motion handling. For code recipes use animate (web) or the app-phase animate-expo; this skill supplies the numbers and the pattern vocabulary.
---

# Motion design (curated for Breakup)

A curated subset of soilmass/motion-design-agent v3.3.0 (MIT, see LICENSE). 34 of 86 sub-skills kept: the ones that matter for a website and a mobile app. Video, Remotion, Lottie export and Disney-theory skills were left out.

## How to use

1. Read the project rules in `CLAUDE.md` first: when this skill disagrees with them (durations, loops, springs), the project rules win.
2. Open only the reference you need from the table below.
3. Take values from `tokens/*.tokens.json` (W3C DTCG format): `motion`, `easing`, `duration`, `spring` for the web; `react-native-motion` and `ios-motion` for the app.
4. References show CSS, Framer Motion (Motion) or GSAP code: use it directly on the website. For the Expo phase translate it to Reanimated 3; `react-native.md` shows the mapping.
5. Always check `accessibility.md` and respect `useReducedMotion()`.

## References

| File | Use for |
|---|---|
| `references/react-native.md` | Phase 2: Reanimated, Gesture Handler, Moti, expo-haptics |
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

| `references/transitions.md` / `container-transform.md` | Page and view transitions, shared-element moves |
| `references/scroll-animations.md` / `scrollytelling.md` | Landing page scroll story |
| `references/svg-animation.md` / `stroke.md` / `morphing.md` | The Wave path, brain drawing, Nick's avatar morphing per product |
| `references/particles.md` / `physics.md` | Receptor dots, money falling into the piggy bank |
| `references/data-visualization.md` | Brain-by-weeks, savings chart |
| `references/css-advanced.md` | CSS-only techniques, `@property`, view transitions |
| `references/blur.md` / `depth.md` / `glow-shadow.md` | Layering in a dark UI (use sparingly, see CLAUDE.md) |
| `references/typography.md` / `reveals.md` | Text reveals for the landing hero |

## Known gaps

`gesture-motion.md`, `ui-micro.md` and `loading-states.md` and a few web references link to `gesture-implementations.md`, `micro-patterns.md`, `optimistic-patterns.md`, `kinetic-typography.md` and `scrollytelling-patterns.md`. Those files do not exist in the upstream repo either; ignore the links.
