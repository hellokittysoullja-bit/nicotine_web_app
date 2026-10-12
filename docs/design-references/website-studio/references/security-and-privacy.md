# Security and privacy

Apply these controls in proportion to the product's data, users, and exposure. A static public page needs a smaller threat model than a multi-user application, but neither should leak secrets or misrepresent privacy.

## Establish the boundary

Before implementation, identify:

- Public, private, and privileged routes or actions.
- Data collected, its sensitivity, owner, retention period, and deletion path.
- Trust boundaries between browser, server, storage, identity provider, upload service, and connectors.
- External origins that receive requests or data.
- Actions that create, modify, publish, delete, pay, or message outside the application.

Collect the minimum data needed for the requested workflow. Do not add analytics, tracking, fingerprinting, or telemetry speculatively.

## Secrets and configuration

- Keep secrets in the target platform's secret or environment store.
- Commit only an example file containing variable names and safe descriptions, never real values.
- Do not expose secrets through client bundles, generated HTML, logs, screenshots, URLs, error messages, or repository history.
- Treat every value sent to browser code as public.
- Scope credentials to the minimum system, environment, operation, and lifetime required.
- Rotate credentials after accidental exposure rather than merely deleting the visible file.

## Authentication and authorization

- Prefer a platform-managed or established identity provider.
- Treat authentication as identity proof and authorization as a separate server-side decision.
- Enforce ownership, role, workspace, or allowlist checks on every protected server action and data query.
- Do not rely on hidden buttons, route guards running only in the browser, or unverified identity headers.
- Use secure, HTTP-only, same-site cookies where the chosen platform supports them; protect state-changing requests against cross-site request forgery.
- Validate redirect targets and keep them same-origin unless an explicit allowlist is required.
- Provide sign-out, access revocation, and account/data deletion behavior when accounts are part of the product.

## Input, output, and requests

- Validate input on the server for type, length, range, format, and authorization.
- Encode untrusted content for its output context. Avoid inserting raw HTML; sanitise it with a maintained library when rich text is required.
- Use parameterized database queries and narrowly scoped data access.
- Allowlist outbound server destinations when users can influence URLs. Block private-network and metadata endpoints to reduce SSRF risk.
- Set timeouts and response-size limits for external requests.
- Do not disclose stack traces, internal paths, queries, or credentials to users.

## Uploads and downloads

- Apply the controls in `recipes/capability-uploads.md`.
- Verify file size, declared type, extension, and content signature where feasible.
- Use generated object keys rather than user filenames as storage paths.
- Keep untrusted files outside executable or public application directories.
- Require authorization for private upload and download operations.
- Remove unnecessary image metadata when it may reveal location or identity.

## Connectors and external actions

- Request the narrowest scopes and separate read access from write access.
- Require clear user intent before consequential external writes.
- Design retries to avoid duplicate messages, records, charges, or publications.
- Log action identifiers and outcomes without recording secrets or unnecessary personal data.
- Display stale, disconnected, or partial states honestly.

## Browser and hosting protections

- Use HTTPS in production.
- Configure security headers appropriate to the host, including content-type protection, framing policy, referrer policy, and a content security policy compatible with required assets and embeds.
- Restrict cross-origin access to known origins and required methods; do not use a wildcard with credentials.
- Keep dependencies and lockfiles reviewable. Add libraries only when they reduce risk or are needed by the product.
- Avoid exposing source maps publicly when they contain sensitive source context.

## Privacy handoff

Document what data is collected, why, where it is stored, who can access it, how long it remains, and how a user can correct or delete it. State known limitations rather than presenting a generic privacy notice that does not match the implementation.

## Release check

- [ ] No secret appears in source, build output, logs, screenshots, or URLs.
- [ ] Protected operations enforce server-side authorization.
- [ ] Inputs, uploads, outbound requests, and rendered content are constrained.
- [ ] Data collection, retention, deletion, and external sharing match the stated policy.
- [ ] External writes are scoped, attributable, and safe to retry.
- [ ] Public and private routes were tested in the corresponding anonymous and authenticated states.
