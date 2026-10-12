# Existing-project adapter

Use this adapter whenever the target already contains application or site source. Preserve its working conventions and make the smallest compatible change.

## Inspect first

Identify:

- Framework and runtime.
- Package manager, lockfile, scripts, and supported runtime version.
- Route, component, style, asset, data, test, and build structure.
- Hosting configuration, base path, output directory, redirects, and environment-variable conventions.
- Existing database, storage, identity, upload, connector, analytics, and deployment integrations.
- Current version-control state so unrelated user changes remain untouched.

Read only the files needed to establish this map. Do not run another initializer over the project.

## Adapter contract mapping

| Field | Existing-project behavior |
| --- | --- |
| `scaffold` | Not used. Add only requested files within the established architecture. |
| `dev` | Reuse the existing development script and healthy local URL. |
| `build` | Reuse the existing production build; do not replace it without a requested migration. |
| `outputDir` | Read from current framework and hosting configuration. |
| `preview` | Reuse the project's preview process and available browser tooling. |
| `deploy` | Reuse the configured host and workflow unless the user requests another target. |
| `env` | Follow existing environment naming and secret storage; update the example file with names only when needed. |
| `structuredData` | Reuse the existing database, schema, migration, and ownership patterns. |
| `blobStorage` | Reuse the existing object store and metadata model. |
| `identity` | Reuse the current provider and server-side authorization model. |
| `connectors` | Reuse configured connectors and their current scopes; do not silently add accounts or writes. |

Mark absent optional capabilities as `unavailable` until the product requires and the user authorises an addition.

## Change rules

- Preserve public APIs, route behavior, design tokens, and component conventions unless the request changes them.
- Match the existing language and style rather than introducing a parallel architecture.
- Add the minimum dependency set and keep the active lockfile authoritative.
- Keep server-only modules and secrets out of client imports.
- Do not clean up unrelated code, formatting, warnings, or user changes.
- When a capability is needed, extend the existing provider before proposing a second database, identity system, object store, or connector layer.

## Verification

Run the project's established focused checks, then its production build. Use existing tests as the baseline; separate pre-existing failures from regressions introduced by the requested work.

If browser tooling is available, inspect the changed flows at representative desktop and mobile widths. If it is unavailable, report that visual QA remains manual.

For deployment, follow the existing workflow and `references/hosting-handoff.md`. Without deployment permission, hand off the validated artifact and do not claim a release.
