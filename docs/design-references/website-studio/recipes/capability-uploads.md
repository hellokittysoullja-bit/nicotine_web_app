# Upload capability

Load this recipe when users must submit files, images, documents, audio, video, exports, or other binary objects that survive a session.

## Storage model

Store bytes in the adapter's `blobStorage`. Store searchable metadata, ownership, status, content type, size, checksum, and lifecycle information in `structuredData` when the product needs them.

Do not store durable uploads in source control, localStorage, a relational text field, or an ephemeral application filesystem. Do not expose storage credentials to the browser.

## Upload flow

1. Authenticate and authorize the requester when uploads are not fully public.
2. Enforce size, count, rate, extension, declared MIME type, and allowed-purpose limits.
3. Generate an opaque object key; preserve the user filename only as metadata.
4. Use a server-mediated or time-limited provider upload mechanism.
5. Verify completion, size, checksum, and content signature when feasible.
6. Quarantine or scan risky content before making it downloadable or publicly visible.
7. Record processing, moderation, ready, rejected, and deleted states.
8. Remove temporary objects and incomplete multipart uploads.

For images, consider dimensions, decompression limits, orientation, and metadata that may reveal location or identity. Generate derived versions from the validated original and keep their relationship explicit.

## Access and lifecycle

- Choose public, authenticated, owner-only, workspace, or time-limited access per product need.
- Enforce access at the server or storage-provider boundary, not only in the UI.
- Set download content type and disposition safely.
- Define retention, replacement, deletion, recovery, and orphan cleanup.
- Remove associated objects when a record or account is deleted unless retention is required and disclosed.
- Log object identifiers and outcomes without logging file contents or signed URLs.

## Adapter behavior

- Sites: use the current native blob-storage path when available.
- Existing project: extend its current object-store and metadata conventions.
- Generic framework: select an object store compatible with the chosen host.
- Static adapter: uploads are unavailable unless the user explicitly selects an external upload service; then treat that service as a connector and document its data flow.

## Fallback

If blob storage is unavailable, offer a URL field, local-only file processing that does not claim persistence, or defer the feature. Do not silently retain files in a temporary server directory.

## Verify

- [ ] Valid upload, oversized, wrong-type, interrupted, duplicate, and unauthorised cases behave correctly.
- [ ] Private files cannot be fetched by guessing a path.
- [ ] Signed or temporary access expires as intended.
- [ ] Delete, replacement, processing failure, and orphan cleanup are covered.
- [ ] User-facing privacy and retention language matches the implementation.
