# Data capability

Load this recipe when information must survive reloads, devices, users, or deployments, or when records need filtering, ownership, transactions, or history.

## Classify the state

- **Ephemeral UI state:** open panels, temporary filters, and unsaved interaction state may stay in memory.
- **Device-local preference:** theme, dismissed notices, and explicitly local drafts may use browser storage.
- **Offline application data:** use a deliberate local database and synchronization design; do not imply it is shared before sync exists.
- **Durable product data:** use server-accessible structured storage.
- **Files and blobs:** use object storage and keep searchable metadata in structured storage.

Do not add a database for content that can be shipped as static files. Do not use browser storage as the source of truth for data the product promises to remember across devices or users.

## Design the model

Define:

- Stable identifiers and ownership boundaries.
- Required fields, constraints, relationships, indexes, and lifecycle states.
- Created, updated, archived, and deletion behavior where relevant.
- Authorization rules for every read and write path.
- Migration, seed, backup, export, and recovery expectations.
- Data retention and personal-data minimization.

Keep schema changes reviewable and versioned. Use parameterized queries or the selected provider's safe query interface. Use transactions for operations whose partial completion would corrupt product state.

## Map to the adapter

- Sites: use the current native Sites structured-data path when available.
- Existing project: extend its established database and migration conventions.
- Generic framework: select a database supported by the chosen runtime and host.
- Static adapter: only bundled read-only data or explicitly device-local state is valid.

Record the provider and verification under `structuredData`. Keep credentials in the server environment.

## Fallback

When durable storage is unavailable, choose one honestly:

- Reduce the feature to read-only bundled data.
- Keep a clearly labelled device-local version when that meets the user's intent.
- Provide import/export without claiming synchronization.
- Defer the persistent feature until the user selects a provider or grants access.

Never display sample records as live customer or production data.

## Verify

- [ ] Create, read, update, and delete or archive behavior matches the product.
- [ ] Ownership and authorization are enforced server-side.
- [ ] Constraints and migrations work on a clean environment and an upgrade path.
- [ ] Empty, conflict, validation, unavailable, and retry states are visible.
- [ ] Export, deletion, retention, and recovery expectations are documented.
