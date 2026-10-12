# Каталог скиллов

Все скиллы прочитаны целиком перед установкой. Порядок приоритета при споре — в `CLAUDE.md`.

## Установлены (`.claude/skills/`, срабатывают сами)

Пометка «вручную» — скилл не срабатывает сам, только по команде `/имя`.

| Скилл | Источник · лицензия | Что делает |
|---|---|---|
| `animate` | emilkowalski/skills · MIT | Build an animation from scratch, making the decisions in the order that determines whether it feels right — should it animate at all, what purpose, which tool, which properties, which curve and duration, how it interrupts, how it … |
| `animation-performance` | emilkowalski/skills · MIT | Keep web animations inside the frame budget — animate composite-only properties, keep motion off the main thread when the page is busy, and find the cause when an animation drops frames. Covers the layout/paint/composite pipeline,… |
| `animation-vocabulary` | emilkowalski/skills · MIT | Reverse-lookup glossary that turns a vague description of a web animation or motion effect into its exact term ("the bouncy thing when a popover opens" → Pop in; "the iOS rubber-band scroll" → Rubber-banding). Use when the user as… |
| `apple-design` | emilkowalski/skills · MIT | Apple's approach to interface design and fluid, physical motion, translated for the web. Use when building or reviewing gesture-driven UI, spring animations, drag/swipe/sheet interactions, momentum and interruptible transitions, t… |
| `ask-sonner` | emilkowalski/skills · MIT | Guide to Sonner, the React toast library — install and wire up the Toaster, pick the right toast() call, promise and loading toasts, updating, dismissing and persisting toasts, styling, theming and icons, positioning and multiple … |
| `baseline-ui` (вручную) | ui-skills (npm 0.2.4) · MIT | Quickly deslop UI code by fixing spacing, hierarchy, typography, and small layout issues. Use when the interface needs a fast cleanup or polish pass. |
| `break-ui` | emilkowalski/skills · MIT | Try to break a piece of UI by feeding it worst-case data — long names, unbreakable emails, one-letter names, missing fields, huge counts, zero items, long labels, non-Latin text, emoji, extreme numbers — then render it behind a "D… |
| `coss` | cosscom/coss (apps/ui) · MIT | Helps implement coss UI components correctly. Use when building UIs with coss primitives and patterns (buttons, dialogs, selects, forms, menus, tabs, segmented controls, inputs, toasts, etc.), migrating from shadcn/Radix to coss/B… |
| `coss-particles` | cosscom/coss (apps/ui) · MIT | Index of all COSS UI particle examples. Use when implementing UI features to find copy-paste-ready component patterns built on coss primitives. Each particle has a description and a JSON URL for easy installation. |
| `emil-design-eng` | emilkowalski/skills · MIT | This skill encodes Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great. |
| `find-animation-opportunities` | emilkowalski/skills · MIT | Search a codebase or UI for places that don't animate but should, and reject everything that shouldn't. Read-only; it proposes motion with exact values, it does not implement it. Use when the user asks "what could be animated here… |
| `fixing-accessibility` | ui-skills (npm 0.2.4) · MIT | Audit and fix HTML accessibility issues including ARIA labels, keyboard navigation, focus management, color contrast, and form errors. Use when adding interactive controls, forms, dialogs, or reviewing WCAG compliance. |
| `fixing-metadata` | ui-skills (npm 0.2.4) · MIT | Audit and fix HTML metadata including page titles, meta descriptions, canonical URLs, Open Graph tags, Twitter cards, favicons, JSON-LD structured data, and robots directives. Use when adding SEO metadata, fixing social share prev… |
| `fixing-motion-performance` | ui-skills (npm 0.2.4) · MIT | Audit and fix animation performance issues including layout thrashing, compositor properties, scroll-linked motion, and blur effects. Use when animations stutter, transitions jank, or reviewing CSS/JS animation performance. |
| `frontend-design` | anthropics/skills · Apache-2.0 | Guidance for distinctive, intentional visual design when building new UI or reshaping an existing one. Helps with aesthetic direction, typography, and making choices that don't read as templated defaults. |
| `improve-animations` | emilkowalski/skills · MIT | Survey a codebase's animation and motion code as a senior motion advisor, then produce a prioritized audit and self-contained implementation plans for other agents (or cheaper models) to execute. Read-only on source code — it plan… |
| `mobile-native` | emilkowalski/skills · MIT | Make a web app feel native on a phone — the small CSS and meta-tag fixes that separate "a website in a browser" from something that feels installed. Covers sticky hover states, tap highlight flashes, the 100vh bug, inputs that zoo… |
| `motion-design` | soilmass/motion-design-agent, 34 из 86 разделов · MIT | Motion values and patterns for the Breakup website/web app (phase 1) and Expo app (phase 2). Use when choosing durations, easing, springs, entrance/exit, scroll and page transitions, SVG/morphing, loops, loading or empty states, c… |
| `pick-ui-library` (вручную) | emilkowalski/skills · MIT | Pick the right library for a given frontend task from a curated, opinionated list — numbers, OTP inputs, charts, command menus, virtualization, drag and drop, toasts, state, styling, and more. Only runs when explicitly invoked; it… |
| `prototype` (вручную) | emilkowalski/skills · MIT | Build multiple genuinely different versions of a UI piece you describe, rendered behind a visual picker so you can flip through them live and promote the one that feels right. Only runs when explicitly invoked; it does not trigger… |
| `redesign-existing-projects` | Leonxlnx/taste-skill · MIT | Upgrades existing websites and apps to premium quality. Audits current design, identifies generic AI patterns, and applies high-end design standards without breaking functionality. Works with any CSS framework or vanilla CSS. |
| `review-animations` (вручную) | emilkowalski/skills · MIT | Reviews animation and motion code against a high craft bar derived from Emil Kowalski's design engineering philosophy. Default to flagging; approval is earned. |
| `design-taste-frontend` | Leonxlnx/taste-skill · MIT | Anti-slop frontend skill for landing pages, portfolios, and redesigns. The agent reads the brief, infers the right design direction, and ships interfaces that do not look templated. Real design systems when applicable, audit-first… |
| `ui-styling` | nextlevelbuilder/ui-ux-pro-max-skill · MIT (шрифты OFL) | Create beautiful, accessible user interfaces with shadcn/ui components (built on Radix UI + Tailwind), Tailwind CSS utility-first styling, and canvas-based visual designs. Use when building user interfaces, implementing design sys… |
| `ui-ux-pro-max` | nextlevelbuilder/ui-ux-pro-max-skill · MIT | UI/UX design intelligence for web, mobile, and desktop. This skill should be used when designing, building, reviewing, or fixing interfaces, including pages, components, design systems, accessibility, interaction, responsive layou… |
| `vercel-composition-patterns` | vercel-labs/agent-skills · MIT | React composition patterns that scale. Use when refactoring components with boolean prop proliferation, building flexible component libraries, or designing reusable APIs. Triggers on tasks involving compound components, render pro… |
| `vercel-react-best-practices` | vercel-labs/agent-skills · MIT | React and Next.js performance optimization guidelines from Vercel Engineering. This skill should be used when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns. Triggers on tasks involvin… |
| `web-design-guidelines` | vercel-labs/agent-skills + web-interface-guidelines @434b7f9 · MIT | Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices". |
| `webapp-testing` | anthropics/skills · Apache-2.0 | Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs. |
| `website-studio` | Do-fei/website-studio-skill · MIT | Plans, designs, builds, validates, and prepares polished responsive websites and lightweight web apps from brief through hosting handoff. Use when creating or redesigning a landing page, portfolio, editorial site, knowledge hub, d… |

## Для фазы 2, приложение (`docs/app-phase/skills/`)

Переезжают в `.claude/skills/` в начале работы над Expo-приложением.

| Скилл | Источник · лицензия | Что делает |
|---|---|---|
| `animate-expo` | emilkowalski/skills · MIT | Build animations in React Native and Expo, making the decisions in the order that determines whether they feel right — should it animate, which thread it runs on, which properties, spring or timing, how the gesture hands off, how … |
| `react-native-best-practices` | callstackincubator/agent-skills · MIT | Provides React Native performance optimization guidelines for FPS, TTI, bundle size, memory leaks, re-renders, and animations. Applies to tasks involving Hermes optimization, JS thread blocking, bridge overhead, FlashList, native … |
| `react-native-testing` | callstack/react-native-testing-library · MIT | Write tests using React Native Testing Library (RNTL) v13 and v14 (`@testing-library/react-native`). Use when writing, reviewing, or fixing React Native component tests. Covers: render, screen, queries (getBy/getAllBy/queryBy/find… |
| `react-navigation` | callstackincubator/agent-skills · MIT | Provides React Navigation UI patterns for stacks, tabs, drawers etc. Use when building navigation UIs with React Navigation, configuring headers, bottom sheets or handling safe areas and insets. |
| `upgrading-react-native` | callstackincubator/agent-skills · MIT | Upgrades React Native apps to newer versions by applying rn-diff-purge template diffs, updating package.json dependencies, migrating native iOS and Android configuration, resolving CocoaPods and Gradle changes, and handling breaki… |
| `vercel-react-native-skills` | vercel-labs/agent-skills · MIT | React Native and Expo best practices for building performant mobile apps. Use when building React Native components, optimizing list performance, implementing animations, or working with native modules. Triggers on tasks involving… |

## Справочники (`docs/design-references/`, сами не срабатывают)

- `taste/` — стилистические варианты taste-skill: soft, minimalist, brutalist, gpt-taste, stitch, image-to-code, генерация макетов для веба и мобильных, брендкит. Брать, когда сознательно выбираем один из этих стилей.
- `emil/` — лицензия скиллов Эмиля (сами скиллы установлены).
- `ui-ux-pro-max/` — дизайн-система (токены) и бренд; скрипты убраны.
- `vercel-react-view-transitions/` — экспериментальный API переходов между экранами в React.
- `websites.md` — конспект сайтов: sl-ui-library, ui-skills.com, coss.com/ui, rareui, beautifului.dev, статья Эмиля про анимации. Сами сайты из этой среды не открылись (прокси 403), данные взяты из их исходников на GitHub и npm.

## Проверены и не установлены

| Что | Почему |
|---|---|
| `ui-skills-root` и CLI ui-skills | Тянет текст скиллов с сайта без закреплённой версии — канал для подмены инструкций |
| `deploy-to-vercel` | Отправляет архив проекта (включая ключи вне `.env`) на сторонний адрес |
| `vercel-cli-with-tokens` | Печатает токен Vercel в лог, делает `git add .` |
| `vercel-optimize` | Нужен живой трафик и платный Observability Plus — вернуться после запуска |
| `writing-guidelines` (Vercel) | Правила английского текста, грузятся из сети |
| design, banner-design, slides (ui-ux-pro-max) | Платные API генерации картинок, чтение глобальных `.env`; не по задаче |
| папка `stack/` ui-ux-pro-max | Настройки открывают чтение всего `/home` и MCP-серверы без версий |
| output-skill (taste) | Заставляет давать максимально длинные ответы на любую задачу |
| use-sl-ui | Ванильный HTML/CSS, правила запрещают Base UI и shadcn — конфликт с coss |
| web-artifacts-builder, theme-factory, brand-guidelines, canvas-design, skill-creator (Anthropic) | Не по задаче или уже встроены в Claude Code |
| agent-device, dogfood (Callstack) | Нужны симуляторы; dogfood заранее разрешает запуск npm-пакета без версии |
| 52 раздела motion-design | Видео, Remotion, Lottie, теория Диснея — не нужны продукту |
