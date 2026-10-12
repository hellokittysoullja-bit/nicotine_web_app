# Connector capability

Load this recipe when the site reads from or writes to an external application, account, API, calendar, mailbox, drive, database, messaging system, analytics service, or automation platform.

## Discover the real capability

For each connector, record:

- Provider and account or workspace boundary.
- Available tools or API operations from the current live description.
- Granted scopes and whether access is read-only or includes writes.
- Data freshness, pagination, rate limits, and retry behavior.
- Secret and token storage managed by the platform or server.
- User-visible disconnected, denied, stale, partial, and error states.

Treat live tool and connector schemas as the source of truth. Do not copy volatile argument names into this portable recipe or guess operations that are not exposed.

## Selection order

1. Use a purpose-built connector already available to the agent or platform.
2. Otherwise use the provider's documented official API when the user has authorised credentials and the selected runtime can protect them.
3. Otherwise offer explicit CSV/JSON import-export or another user-controlled transfer.
4. Use fixtures only for a clearly labelled demo or test environment.

Do not present imported, cached, or fixture data as a live connection. Do not automate a private website UI when an authorised connector or API is the intended integration path.

## Reads

- Request the smallest scope and data set needed.
- Cache only when freshness and privacy requirements allow it.
- Show the last successful synchronization time when data can become stale.
- Preserve source identifiers for reconciliation without exposing sensitive raw payloads.
- Handle empty, partial, paginated, rate-limited, disconnected, and revoked states.

## Writes and external effects

- Require clear user intent and appropriate authorization before creating, editing, sending, publishing, deleting, purchasing, or scheduling externally.
- Validate the final target, recipients, content, date, quantity, and visibility.
- Use idempotency keys or stored operation identifiers when the provider supports them.
- Make retries safe against duplicate messages, records, payments, or posts.
- Record an audit-safe outcome and return the provider's resulting identifier or URL when available.
- Do not turn a read request into an external write.

## Security and privacy

- Keep credentials in the platform connector or server secret store.
- Never place connector tokens in client code, URLs, logs, screenshots, fixtures, or exports.
- Minimize personal data and explain cross-system data flow, retention, and deletion.
- Do not broaden scopes to work around an authorization failure.
- Disconnect and revoke access cleanly when the product supports account removal.

## Fallback

If the connector or required scope is missing, identify the exact unavailable operation and continue only with a truthful import/export, read-only, or demo mode accepted by the user. Do not fabricate a successful connection, synchronization, write, or returned identifier.

## Verify

- [ ] Connected, disconnected, denied, expired, empty, partial, stale, and rate-limited states are represented.
- [ ] Scopes match the requested workflow.
- [ ] Writes require intent, authorization, validated targets, and duplicate-safe retries.
- [ ] Secrets and unnecessary personal data do not enter the client or logs.
- [ ] The final UI distinguishes live, cached, imported, and fixture data.
