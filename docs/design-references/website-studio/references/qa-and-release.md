# QA and release workflow

Release evidence must match the configured rendering and access model. A successful build or deployment action does not prove that routes, assets, authentication, or critical flows work.

## Deterministic gates

Run from the Website Studio package or adapt the paths for the consuming project:

```bash
node scripts/inspect-project.mjs /path/to/project
node scripts/validate-config.mjs /path/to/site-quality.config.json
node scripts/validate-export.mjs --config /path/to/site-quality.config.json
node scripts/audit-media.mjs --manifest /path/to/media-manifest.json --release-mode public
node scripts/validate-deployment.mjs --config /path/to/site-quality.config.json https://example.com/
```

- Use export validation only for `static` and `spa` builds.
- Media audit is required when a public release includes third-party or user-provided media.
- Deployment validation uses anonymous requests. Authenticated behavior still requires a browser session or integration test.

## Browser evidence

For every configured viewport:

- capture the first screen and a full-page or full-workspace view;
- check console errors, failed requests, broken images, and unexpected redirects;
- inspect text wrapping, element bounds, image crop, fixed UI, dialogs, tables, and charts;
- test the primary navigation and every configured critical flow;
- exercise each named flow state, including failure and permission states;
- complete a keyboard-only pass and reduced-motion pass.

For data products, record the fixture or dataset state shown in the screenshot. A polished screenshot with fabricated or unexplained data is not valid evidence.

## Access-aware deployment checks

### Public anonymous

- Every configured route must resolve anonymously to an allowed successful status, normally 200.
- The final page must not be a sign-in, access-request, private-preview, or platform error screen.
- Required route text and representative assets must be present.
- Assets must return an appropriate MIME type rather than a soft-404 HTML page.

### Authenticated

- Anonymous requests must match each route's `expectedAnonymousStatuses` without exposing protected content.
- Test successful sign-in separately with an authorised test account.
- Verify role boundaries, direct navigation to protected routes, session expiry, sign-out, and 403 behavior.
- Do not record credentials, tokens, personal data, or private screenshots in release artifacts.

### Internal

- Verify the intended network, identity, or gateway restriction from outside the trusted context as well as inside it.
- A public 200 response is a release blocker unless the route is explicitly designed as a public entry screen.
- Confirm that static assets, source maps, exports, and API endpoints do not bypass the access boundary.

## Route and state matrix

For each route, record:

- expected anonymous response;
- authenticated roles, if any;
- page heading and primary action;
- loading, empty, error, success, and permission behavior;
- critical assets or data dependencies;
- deep-link and refresh result.

For each critical flow, record the start state, action, expected state transition, recovery path, and observable success evidence.

## Release checklist

- [ ] Configuration passes and matches the implemented capabilities.
- [ ] Build, lint, type checks, and project tests pass.
- [ ] Static or SPA export passes when applicable.
- [ ] Public media has cleared status and evidence.
- [ ] All configured routes and critical flows have browser evidence.
- [ ] Mobile, desktop, keyboard, zoom, and reduced-motion checks pass.
- [ ] Anonymous deployment behavior matches `accessMode`.
- [ ] Required monitoring, removal contact, support route, or owner is documented.
- [ ] Rollback target and rollback command or host action are known.

## Handoff

Provide the site brief, configuration, routes and flow matrix, build and verification results, desktop/mobile evidence, deployed URL or protected-access instructions, known limitations, and rollback path. State skipped checks plainly; do not report an inaccessible or unverified URL as finished.
