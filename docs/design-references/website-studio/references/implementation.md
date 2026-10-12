# Implementation workflow

Use this reference after the project has a clear brief and an approved design direction. Preserve the project's existing framework and conventions unless the brief explicitly requires a new stack.

## Classify the project first

Record these decisions in `site-quality.config.json` before building:

- `siteType`: the product and information pattern being built;
- `renderMode`: `static`, `spa`, or `ssr`;
- `accessMode`: `public-anonymous`, `authenticated`, or `internal`;
- routes and their required content or anonymous response behavior;
- browser viewports and critical user flows;
- output directory, base path, required files, and critical assets.

Do not assume that every website is a public landing page. Access, rendering, persistence, and failure behavior determine the implementation.

## Choose the right shell

| Site type | Primary shell | Essential implementation concerns |
| --- | --- | --- |
| Landing page | Public narrative | One promise, supporting proof, clear CTA, fast first load |
| Portfolio | Public narrative plus case-study routes | Project media, case-study depth, contact path, stable URLs |
| Editorial story | Long-form narrative | Reading rhythm, sources, media provenance, captions |
| Knowledge hub | Discovery shell | Taxonomy, search, filtering, freshness, useful empty results |
| Directory or catalog | Discovery shell | Sort, filter, comparison, detail routes, result counts |
| Dashboard | Data application shell | Data freshness, units, filters, charts, loading and error states |
| Internal portal | Authenticated application shell | Roles, navigation, search, breadcrumbs, 403 and session expiry |
| Tracker or workflow | Stateful application shell | Valid transitions, persistence, validation, undo or recovery |

## Build in vertical slices

Implement one complete route or critical flow before multiplying components.

1. Establish the page or app shell, semantic landmarks, route behavior, and access boundary.
2. Implement the primary task with real content or realistic structured fixtures.
3. Add loading, empty, error, success, disabled, and permission-denied states where applicable.
4. Confirm keyboard behavior and narrow-screen transformation.
5. Extract repeated tokens or components only after a real repetition exists.

Avoid creating a large generic component library in advance. A component earns reuse through consistent behavior, not merely similar appearance.

## Design-system minimum

Define semantic tokens rather than page-specific colors:

- surfaces, text, muted text, borders, focus, accent, success, warning, and danger;
- readable type, display type when needed, and data or monospace type when useful;
- fluid page gutters, content widths, spacing steps, control heights, and layer levels;
- radii, shadows, motion durations, and chart colors only when the product needs them.

Every color token must have a purpose. Status must never depend on color alone.

## Content and data

- Keep headings, labels, dates, units, and button text specific. Do not ship placeholder or invented production claims.
- Preserve source and media provenance for public editorial content.
- Show data origin, relevant filters, timezone, units, and last-updated state for analytical interfaces.
- Distinguish zero from unavailable, delayed, redacted, or not applicable.
- Do not hide incomplete data behind decorative charts or false precision.

## Interaction and state

- Use links for navigation and buttons for actions.
- Make filters reversible and expose the current result count or active criteria.
- Keep form values when validation or network submission fails.
- Prevent duplicate submissions and explain destructive consequences before confirmation.
- Announce asynchronous success or failure without moving keyboard focus unexpectedly.
- Protect authenticated operations on the server or trusted boundary; hiding a control is not authorization.

## Rendering profiles

### Static

Every configured route must resolve to an exported HTML file. All local references and base-path prefixes must survive deployment.

### SPA

The static shell may not contain route headings or content. Validate shell metadata and assets locally, then validate rendered routes and deep-link fallback in a real browser and deployed host.

### SSR

Do not use static-export validation as proof of correctness. Build and type-check the application, then validate deployed routes, redirects, access behavior, and rendered DOM.

## Completion condition

Implementation is complete only when configured routes exist, critical flows cover their named states, responsive and keyboard behavior have been observed, deterministic validators pass, and deployment behavior matches the configured access mode.
