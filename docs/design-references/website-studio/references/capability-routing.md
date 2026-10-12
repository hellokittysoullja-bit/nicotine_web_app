# Capability routing

Choose the smallest execution path that can satisfy the requested product. A portable website skill coordinates available capabilities; it does not invent tools, credentials, hosting, databases, identity, or connectors that the current agent does not have.

## Choose a path

Use the **simple path** when all of these are true:

- The site is primarily content or presentation.
- One or a few routes are enough.
- Interactions can run entirely in the browser.
- The product does not require durable shared data, sign-in, uploads, secret-backed server calls, or external write operations.

Use the **capability path** when any of these are required:

- Durable or multi-user structured data.
- Authentication, authorization, private routes, or user-owned records.
- File uploads or generated/downloadable blobs.
- Server-side use of secrets.
- Live connectors, scheduled synchronization, or writes to external systems.
- A server runtime, background work, or host-specific infrastructure.

Multi-route navigation alone does not require the capability path if every route can still be exported statically.

## Inspect before selecting

Determine:

1. Whether this is an existing project or an empty target.
2. The existing framework, package manager, lockfile, scripts, output conventions, and hosting configuration.
3. Whether the user named a framework, host, access model, or deployment target.
4. Which browser, deployment, storage, identity, upload, and connector capabilities are actually available.
5. Which missing choice would materially change the architecture.

Preserve an existing working project. Do not migrate it merely to use a preferred starter or platform.

## Adapter contract

Every adapter should describe the following fields. Use `supported`, `conditional`, or `unavailable`, then name the provider, verification method, fallback, and any user choice required.

| Field | Contract |
| --- | --- |
| `scaffold` | How a new project is created, or why no scaffold is needed. It must not overwrite a non-empty project. |
| `dev` | How the local development experience runs and how health is verified. |
| `build` | How a production build is produced and what constitutes success. |
| `outputDir` | The deployable directory or server artifact, including base-path constraints. |
| `preview` | How a human-visible preview is opened and whether browser inspection is available. |
| `deploy` | How publishing occurs, what permission it needs, and how success is verified. |
| `env` | Where public configuration and secrets live; secrets must never enter client bundles or source control. |
| `structuredData` | The durable database or service, ownership model, migrations, and fallback. |
| `blobStorage` | The object or file store, metadata relationship, limits, retention, and fallback. |
| `identity` | Authentication provider, server-side authorization boundary, and anonymous behavior. |
| `connectors` | Available external systems, supported read/write operations, scopes, and honest fallback. |

Record this contract in a compact capability matrix before implementing the capability path.

## Adapter selection

Use this order:

1. If an existing project is present, use `adapters/existing-project.md` and retain its established platform unless the user requests a migration.
2. If the user explicitly requests Sites, or the project has Sites hosting metadata, use `adapters/sites.md` when native Sites skills are available.
3. For a new simple-path site with no required framework, use `adapters/static.md`.
4. For a new capability-path product, use `adapters/generic-framework.md` and select a stack that matches the target host and required server capabilities.
5. If the requested target cannot provide a required capability, surface the conflict before building the affected feature.

## Honest fallbacks

- **No browser:** Build and run deterministic checks, provide a manual review checklist, and state that visual browser QA was not performed.
- **No deployment tool or permission:** Produce the validated deployable artifact and host-specific handoff notes. Say “ready to deploy,” not “deployed,” and do not invent a URL.
- **No connector:** Prefer a documented official API when authorised; otherwise offer explicit CSV/JSON import-export or labelled fixture data. Never claim live synchronization.
- **No durable data service:** Keep only genuinely device-local preferences in browser storage. Remove or defer shared persistence rather than pretending it is durable.
- **No identity provider:** Keep the surface public or pause the protected feature. Client-only hiding is not authentication.
- **No blob storage:** Accept links or defer uploads. Do not store user uploads in source control, browser storage, or an ephemeral filesystem.

## Routing completion check

- [ ] Simple or capability path is stated.
- [ ] The chosen adapter matches the current project and requested host.
- [ ] All adapter contract fields have an explicit state.
- [ ] Architecture-changing gaps were raised; harmless gaps have documented fallbacks.
- [ ] The implementation and handoff do not claim capabilities that were unavailable or unverified.
