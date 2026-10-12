# Authentication and authorization capability

Load this recipe only when the product needs identity-aware UI, private routes, user-owned data, roles, workspace restrictions, or attributable write actions.

## Choose the identity model

Prefer, in order:

1. The current platform's managed identity and access controls.
2. The existing project's established provider.
3. A maintained identity provider compatible with the selected host and runtime.

Do not build a password, token, session, or OAuth system from scratch. Do not add authentication to a public read-only site without a concrete protected workflow.

For Sites projects, load the native Sites authentication instructions and treat them as current. Do not copy their volatile routes, headers, claims, or arguments into this portable recipe.

## Separate concerns

- **Authentication** establishes who the requester is.
- **Authorization** decides whether that identity may access a route, record, workspace, or action.
- **Host access control** may protect an entire deployment but does not necessarily provide application identity.

Enforce authorization on the server for every protected read and write. Do not trust client-submitted user IDs, roles, email addresses, hidden controls, or browser-only route guards.

## Required behavior

- Define anonymous, signed-in, signed-out, expired-session, denied, and removed-account states.
- Use provider-supported secure sessions and server-side identity verification.
- Validate return and redirect targets.
- Apply least privilege to roles and scopes.
- Associate durable records with stable provider identifiers, not mutable display names.
- Provide sign-out and access-revocation behavior.
- Plan account deletion, data export, and orphaned-resource handling when users own data.
- Avoid leaking whether a sensitive account or record exists.

## Fallback

If no valid identity provider is available:

- Keep the surface public and omit protected actions, or
- Pause the identity-dependent feature until the user selects and authorises a provider.

Do not simulate sign-in with localStorage, query parameters, hardcoded users, or client-only visibility. A labelled visual prototype may demonstrate the UI only when the user accepts that it is not secure or functional.

## Verify

- [ ] Anonymous users see only intended public content.
- [ ] Authenticated users cannot access another user's or workspace's records.
- [ ] Every protected API and server action rejects missing or insufficient identity.
- [ ] Sign-out, expiration, redirect, denial, and account removal behave correctly.
- [ ] Private content is absent from static output, public caches, metadata, and social previews.
