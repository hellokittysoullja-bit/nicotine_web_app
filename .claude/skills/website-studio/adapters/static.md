# Static adapter

Use this adapter for new simple-path sites that can be delivered as static files: landing pages, portfolios, documentation, editorial stories, campaign pages, lightweight directories, and small browser-only tools.

## Appropriate scope

A static site may include multiple generated pages, responsive navigation, filters, tabs, disclosures, media embeds, client-side search over bundled data, and device-local preferences. It must not pretend to provide durable shared records, protected server actions, secret-backed APIs, uploads, or real authentication.

Move to the capability path when the product requires any of those features.

## Adapter contract mapping

| Field | Static behavior |
| --- | --- |
| `scaffold` | In an empty target, create the minimum HTML, CSS, JavaScript, and asset structure. Refuse to overwrite a non-empty project. |
| `dev` | Use an available local static server or the host framework's preview; record the actual URL. |
| `build` | Copy or generate deterministic static files and fail on broken required assets. |
| `outputDir` | A self-contained static directory with host-compatible paths and an entry document. |
| `preview` | Browser preview when available; otherwise deterministic validation plus a manual review checklist. |
| `deploy` | Any selected static host that supports the required base path, redirects, and access model. |
| `env` | Public build-time values only. Static client code cannot safely hold secrets. |
| `structuredData` | Bundled read-only JSON/CSV or device-local state only; no shared source of truth. |
| `blobStorage` | Unavailable. Use external links or move to the capability path. |
| `identity` | Unavailable. Host-level access control may restrict the whole site but is not application identity. |
| `connectors` | Public read-only endpoints without secrets, authorised embeds, or offline imports only. |

## Implementation rules

- Prefer semantic HTML and progressive enhancement.
- Keep asset and navigation paths compatible with root and subpath deployment.
- Use relative or configured base paths consistently; test a nested route when relevant.
- Do not put API tokens, private endpoints, or credentials in JavaScript or HTML.
- Label bundled sample data and its freshness. Do not present fixtures as live information.
- Make forms either local-only, mail links, or explicitly connected to a selected external service; a form with no working destination is not complete.
- Provide a useful not-found document when the host supports it.

## Upgrade triggers

Use `adapters/generic-framework.md` plus the relevant capability recipe when the user needs:

- Shared persistence or server-side validation.
- Accounts, roles, private records, or per-user views.
- Uploads or generated files that survive a session.
- A connector or API that requires a secret.
- Scheduled work, webhooks, or external write operations.

If the target host or backend has not been chosen, ask before implementing the affected feature. Do not simulate durability or security in browser storage.
