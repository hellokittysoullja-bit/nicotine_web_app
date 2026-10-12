# Generic-framework adapter

Use this adapter for a new capability-path site when no existing project or native platform adapter determines the stack.

## Select by requirements

Choose a framework only after identifying:

- Required rendering: static generation, server rendering, client application, or a mixture.
- Required runtime: long-lived server, serverless functions, edge/worker, or container.
- Target host and its supported runtimes, output formats, databases, object stores, identity, and secret management.
- Team familiarity, package manager, language, accessibility needs, and maintenance expectations.
- Data, auth, uploads, connector, webhook, and background-work requirements.

If two choices would materially change hosting cost, data portability, authentication, or operations, present the tradeoff and request direction. Otherwise choose the smallest conventional stack that satisfies the requirements and state the assumption.

## Adapter contract mapping

Fill these fields for the selected framework and host before implementation:

| Field | Required decision |
| --- | --- |
| `scaffold` | Official or minimal setup, used only in an empty target. |
| `dev` | Standard development entry point and health verification. |
| `build` | Production build and type, lint, or test gates actually used. |
| `outputDir` | Static directory, server bundle, worker, or container artifact expected by the host. |
| `preview` | Local production preview and available browser inspection. |
| `deploy` | Selected host, permission path, immutable revision, and rollback mechanism. |
| `env` | Separation of public build-time values from server-only secrets. |
| `structuredData` | Provider, schema, migrations, ownership, transactions, and backups. |
| `blobStorage` | Provider, object keys, metadata store, access policy, limits, and lifecycle. |
| `identity` | Provider, session model, server-side authorization, and anonymous behavior. |
| `connectors` | Available integrations, scopes, freshness, writes, retries, and auditability. |

Do not hardcode framework commands in Website Studio's core instructions. Keep them in the project or a framework-specific recipe so they can change independently.

## Architecture rules

- Keep secrets and privileged SDKs in server-only modules.
- Separate UI state from durable product state.
- Keep domain logic independent from provider-specific request objects where a small boundary is enough; do not create a speculative abstraction layer.
- Prefer platform-managed services that match the chosen host, while preserving a documented export or migration path for important data.
- Add each optional capability only because a requested user flow needs it.
- Keep error, empty, loading, offline, permission-denied, and disconnected states honest.

## Missing capabilities

If the selected host cannot provide a required capability, change the host or scope with the user's agreement. Do not replace server persistence with browser storage, real auth with client-only route hiding, object storage with an ephemeral filesystem, or live connectors with unlabelled mock data.

If deployment or browser tooling is absent, complete the build and deterministic checks, then use the honest handoff in `references/hosting-handoff.md`.
