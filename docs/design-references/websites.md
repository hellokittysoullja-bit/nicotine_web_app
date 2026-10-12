# UI design reference sites — digest

Fetched 2026-10-12. **None of the six URLs loaded directly**: WebFetch failed with `getaddrinfo ENOTFOUND` for every host, and curl through the session proxy got `CONNECT tunnel failed, response 403` (proxy policy denial) for every host, including web.archive.org. Where possible, the findings below come from the projects' **own source**, fetched through channels that were open (raw.githubusercontent.com and the npm registry). Each section says which source was actually read. Nothing below was read from the live websites themselves.

Legend: **[read]** = taken from a source I actually read. **[applied]** = my application of that source to the app (dark messenger-style anti-nicotine app with a character chat, craving-wave animation and paywall). It is not a claim made by the site.

---

## 1. SL UI Library — https://sltowl.github.io/sl-ui-library/

Source read: `raw.githubusercontent.com/SLtowl/sl-ui-library/main/README.md` and `docs/integration.md`. The site was not reachable (ENOTFOUND / proxy 403).

- **What it is [read]:** a component library plus an AI plugin. It has 297 interactive components in plain HTML/CSS/JS across 10 categories (Buttons 63, Inputs 30, Toggles 30, Checkboxes 35, Sliders 34, Menus 25, Navigation 20, Overlays 20, Feedback 20, Data display 20). It has no runtime dependencies and no remote fonts. The current version is 1.1.2.
- **License [read]:** MIT. The bundled Instrument Sans font is under SIL OFL 1.1, and `OFL.txt` must stay with the downloads.
- **Installable Claude skill/plugin [read]:** yes, as a Claude Code plugin from its own GitHub marketplace:
  ```sh
  claude plugin marketplace add SLtowl/sl-ui-library && claude plugin install sl-ui-library@sl-ui-library
  # or inside Claude Code:
  /plugin marketplace add SLtowl/sl-ui-library
  /plugin install sl-ui-library@sl-ui-library
  ```
  There is also a plugin ZIP for Claude (Customize → Plugins). For a single component: `node component.mjs like ./my-button`. The source CLI needs Node.js 22+. The plugin requires a passing source audit (component ID, variant, source hashes) before an agent may claim an integration.
- **Platform [read]:** web only. Each package is "an independent HTML/CSS/JavaScript example, not a framework-specific component". In React you mount the controller after the DOM exists and call `destroy()` on removal. **Not usable in React Native/Expo**: there is no DOM, so it would have to be rewritten. Automated QA covers Chrome only; physical touch devices "still need a separate release check".
- **Useful ideas [read → applied]:**
  1. In demos, success is only simulated. "In production, show success after your own operation succeeds." → Show paywall "Unlocked" or "Message sent" states only after the purchase or API call resolves.
  2. Verify "repeat activation, cancellation and cleanup rather than just the first click". → Test that the craving-wave start/stop and the chat send button work correctly when triggered repeatedly.
  3. Every component ships keyboard interaction, visible focus and reduced-motion support. → The craving wave needs a reduced-motion variant.
  4. "Render user-entered text as text, not HTML." → Chat bubbles.
  5. Overlay controllers expose `open()/close()/reset()/destroy()` plus a commit event. That is a clean API shape for a paywall or modal sheet.

---

## 2. UI Skills — https://ui-skills.com

Source read: `raw.githubusercontent.com/ibelick/ui-skills/main/README.md` and the published npm package `ui-skills@0.2.4`. The tarball contains the site source and the bundled `SKILL.md` files. The site itself was not reachable.

- **What it is [read]:** a skill collection and registry ("Skills for Design Engineers") by ibelick. The registry (`src/data/registry.ts`) lists **182 skills** from many authors. They include Emil Kowalski's `emil-design-eng` and `apple-design`, callstack's `react-native-best-practices`, `12-principles-of-animation` and the MengTo animation skills. Its own bundled skills are `baseline-ui`, `fixing-accessibility`, `fixing-motion-performance`, `fixing-metadata`, `improve-ui` and `ui-skills-root`. There is also a "Playbook" page (not read).
- **License [read]:** MIT.
- **Installable Claude skills [read]:** yes.
  ```bash
  npx ui-skills start
  npx ui-skills categories
  npx ui-skills list --category motion
  npx ui-skills get baseline-ui
  ```
  There is also an MCP endpoint at `https://www.ui-skills.com/mcp` with the tools `list_skills` and `get_skill`. The `ui-skills-root` routing rule is: "Prefer 1 skill… Never use more than 3."
- **Platform [read]:** the bundled skills are web-oriented (`baseline-ui` mandates Tailwind, `motion/react`, Base UI/Radix/React Aria, `h-dvh`). The registry does list a React Native skill: `callstackincubator/agent-skills` → `react-native-best-practices` (FPS, TTI, re-renders, animations). The principles transfer to RN; the Tailwind and CSS specifics do not.
- **Useful rules (verbatim from `baseline-ui`) [read → applied]:**
  1. "NEVER add animation unless it is explicitly requested" / "NEVER exceed `200ms` for interaction feedback" / "SHOULD use `ease-out` on entrance". → Use instant or ≤200 ms feedback on chat send and taps. Reserve the craving wave as the one deliberate animation.
  2. "MUST animate only compositor props (`transform`, `opacity`)"; "NEVER animate large `blur()` or `backdrop-filter` surfaces"; "MUST pause looping animations when off-screen". → Drive the craving wave with transform/opacity on the native thread (e.g. Reanimated). Pause it when the screen is backgrounded. Do not use an animated blur behind the chat.
  3. "NEVER use gradients unless explicitly requested", "NEVER use purple or multicolor gradients", "NEVER use glow effects as primary affordances", "SHOULD limit accent color usage to one per view". → A dark UI with one accent per screen; the paywall CTA gets the accent, not a glow.
  4. "MUST respect `safe-area-inset` for fixed elements", "MUST show errors next to where the action happens", "MUST use an `AlertDialog` for destructive or irreversible actions". → Chat composer and paywall footer inside safe areas. Show a failed send inline on the bubble. Confirm "reset streak" in a dialog.
  5. "MUST use `tabular-nums` for data", "MUST give empty states one clear next action". → Days smoke-free and money saved counters. An empty chat shows a single prompt.

---

## 3. beautifului.dev — https://beautifului.dev

**Could not be read at all.** WebFetch gave `ENOTFOUND` and curl gave proxy `CONNECT 403`. No npm package named `beautifului` exists (404), and I found no source repository. I have no verified information on what it is, its license, or how it distributes content. Nothing is reported here, to avoid inventing content.

---

## 4. coss ui — https://coss.com/ui

Source read: `raw.githubusercontent.com/cosscom/coss/main/README.md`, `apps/ui/README.md`, and the `LICENSE` header. The site was not reachable.

- **What it is [read]:** "coss.com/ui (formerly Origin UI)" is "the official Cal.com Design System". It is a component library of "accessible, and composable components for your React apps. Built on top of Base UI and styled with Tailwind CSS… designed for you to copy, paste, and own." Legacy Origin UI (Radix/shadcn-style) is included as a snapshot with limited support. Active development is on "Particles" components.
- **License [read]:** mixed. `apps/ui/` and `apps/origin/` are **MIT**; the rest of the monorepo is **AGPL-3.0**. Use only the MIT component code.
- **Install [read]:** copy-paste, plus a shadcn registry. The repo builds "a json file that is compatible with both v0 and the shadcn/ui cli" (`bun run registry:build`). The exact public `npx shadcn add <url>` command is on the site, which I could not read. **No Claude skills found.**
- **Platform [read]:** web only (React DOM, Base UI, Tailwind, Next.js). **Not usable in React Native/Expo** as code.
- **Useful ideas [read → applied]:** only high-level, because component docs were not readable.
  1. Use accessible headless primitives (Base UI) under a thin styled layer. → In RN, follow the same split: logic and accessibility in primitives, visuals in tokens.
  2. "Copy, paste, and own" means vendoring components rather than depending on a styled package. That is a reasonable model for a small RN design system.

---

## 5. RareUI — https://rareui.com

**rareui.com could not be read** (ENOTFOUND / proxy 403). The npm package `rareui` (v0.1.6, MIT) and its repo `github.com/Codewithswappy/rareui` exist, but they give their homepage as **rareui.in**, not rareui.com. **I cannot confirm they are the same project.** The following describes that npm/GitHub project only:

- **What it is [read]:** "The most unique & premium library of animated React components", designed to be copy-pasted. Stack: React 19, Next.js 16, Tailwind CSS 4, Framer Motion 12. Dark mode supported.
- **License [read]:** MIT (repo badge and npm).
- **Install [read]:** `npx rareui init`, `npx rareui add liquid-button`, `npx rareui add particle-card soft-button`, `npx rareui add .` (all). Copy-paste is also possible. **No Claude skills.**
- **Platform [read]:** web only (DOM + Framer Motion). **Not usable in React Native/Expo** without a rewrite.
- **Design rules:** none read. The README only lists component names in examples ("liquid-metal", "liquid-button", "particle-card", "soft-button"). These are decorative effects; per the other sources, use them only for rare moments such as the paywall hero, never for frequent chat interactions.

---

## 6. Emil Kowalski — "You don't need animations" — https://emilkowal.ski/ui/you-dont-need-animations

**The article itself could not be read** (ENOTFOUND / proxy 403; web.archive.org is also blocked). The rules below come from **Emil Kowalski's own skill file**: `raw.githubusercontent.com/emilkowalski/skill/main/skills/emil-design-eng/SKILL.md` (MIT, © 2026 Emil Kowalski), linked from the ui-skills registry. That file encodes his animation philosophy, including the "should this animate at all" decision that the article is about. **These are not quotes from the article.** Wording may differ from the article.

- **Installable skill [read]:** `npx skills@latest add emilkowalski/skills` (README of `emilkowalski/skill`). It is a Markdown skill, framework-agnostic in principle, with CSS examples.

### When NOT to animate [read, verbatim from the skill]
| Frequency | Decision |
|---|---|
| 100+ times/day (keyboard shortcuts, command palette toggle) | No animation. Ever. |
| Tens of times/day (hover effects, list navigation) | Remove or drastically reduce |
| Occasional (modals, drawers, toasts) | Standard animation |
| Rare/first-time (onboarding, feedback forms, celebrations) | Can add delight |

- "**Never animate keyboard-initiated actions.** … Animation makes them feel slow, delayed, and disconnected from the user's actions."
- "Raycast has no open/close animation. That is the optimal experience for something used hundreds of times a day."
- "If the purpose is just 'it looks cool' and the user will see it often, don't animate."
- Valid purposes: spatial consistency, state indication, explanation, feedback (scale on press), preventing jarring changes.

### Durations [read]
- Button press feedback 100–160 ms; tooltips and small popovers 125–200 ms; dropdowns and selects 150–250 ms; modals and drawers 200–500 ms.
- "**UI animations should stay under 300ms.** A 180ms dropdown feels more responsive than a 400ms one."
- Stagger 30–80 ms between items; "never block interaction while stagger animations are playing."
- Exit faster than enter. "Slow where the user is deciding, fast where the system is responding" (hold-to-delete 2 s linear, release 200 ms ease-out).

### Easing [read]
- Entering or exiting → ease-out. Moving or morphing on screen → ease-in-out. Hover or color → ease. Constant motion (progress, marquee) → linear.
- "**Never use ease-in for UI animations.**"
- Custom curves: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`; `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`; iOS-like drawer `cubic-bezier(0.32, 0.72, 0, 1)`.
- Springs are fine: e.g. `{ type: "spring", duration: 0.5, bounce: 0.2 }`.
- Press scale 0.95–0.98. "Never animate from scale(0)": start at ≥0.9 with opacity.
- Use transitions (interruptible) over keyframes for interactive UI.

### Applied to the app [applied]
1. **Chat (used dozens of times a day):** sending a message and opening the keyboard should be instant or ≤160 ms ease-out. Avoid bouncy bubble entrances: a short opacity + translateY with ease-out, no scale(0).
2. **Craving wave (rare, purposeful):** it has a real purpose (explanation and state indication: the urge peaks and passes), so it may be slower. Use ease-in-out for the on-screen rise and fall, or linear for a timer-style progress. Pause it off-screen and provide a reduced-motion version.
3. **Paywall (rare, first-time):** this is the one place for delight. Use a sheet with the drawer curve and a 200–500 ms entrance, and an exit faster than the entrance. Never block the close button while the stagger plays.
4. **Tab switches and navigation (frequent):** no or minimal animation.

---

## Summary: installable Claude skills / plugins
- **SL UI Library:** Claude Code plugin via `claude plugin marketplace add SLtowl/sl-ui-library && claude plugin install sl-ui-library@sl-ui-library` (web HTML/CSS/JS components).
- **UI Skills:** skills via `npx ui-skills get <slug>` or the MCP endpoint `https://www.ui-skills.com/mcp`. The registry includes `react-native-best-practices` (callstack) and Emil's skills.
- **Emil Kowalski:** `npx skills@latest add emilkowalski/skills` (via his GitHub repo, not the article page).
- coss ui and RareUI (npm/.in project) offer components via shadcn registry or CLI, not Claude skills. beautifului.dev: unknown.
- **React Native/Expo:** none of the component libraries are usable directly; they are all DOM/Tailwind. Only the rules and skills transfer.
