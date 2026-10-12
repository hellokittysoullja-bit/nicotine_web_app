# Portal and internal tool recipe

Use for role-based workspaces, operations consoles, employee portals, approval surfaces, account administration, and task-oriented internal products.

## User job and path

The primary job is “complete a recurring task accurately and quickly.” Most real portals use the capability path because identity, authorization, durable data, search, forms, and auditability are product requirements. A simple path is acceptable only for a clearly labelled prototype with fictional data and no real write operations.

## Recommended structure

1. Role-aware navigation and current workspace context.
2. Task-first home surface: assigned work, exceptions, recent changes, and primary creation action.
3. Search or direct navigation to a record.
4. Dense but readable list/table view.
5. Detail and edit flow with history and ownership.
6. Settings, help, privacy, and access explanation where relevant.

## Capability contract

Define roles, permissions, object ownership, protected routes, data store, audit needs, sensitive fields, and external systems before coding. Authentication proves identity; authorization decides what that identity can read or change.

Never rely on hidden buttons for authorization. Enforce permissions server-side for reads and writes.

## Interaction and states

- Search, filters, sorting, create/edit forms, approval or rejection, bulk operations, and notifications.
- Field validation, unsaved changes, save in progress, success, conflict, failure, and retry.
- 401/sign-in, 403/no permission, expired session, missing record, and deleted record.
- Confirmation for destructive or high-impact actions with a clear object and consequence.
- Audit trail or activity history when accountability matters.

## Visual traps

- Do not wrap every field in decorative cards.
- Do not sacrifice legibility for dashboard density.
- Do not make the navigation more prominent than the current job.
- Avoid optimistic success when the server has not confirmed a write.

## Responsive and accessibility

Identify which tasks are genuinely supported on small screens. Reflow forms and lists without hiding required fields or actions. Maintain keyboard order, visible focus, form labels, error summaries, and focus placement after validation or dialog changes.

## Done criteria

- [ ] Each role sees only allowed routes, records, fields, and actions.
- [ ] Critical tasks have success, failure, conflict, and recovery paths.
- [ ] Destructive actions require deliberate confirmation.
- [ ] Sensitive data is excluded from fixtures, logs, screenshots, and public previews.
- [ ] The interface supports the required desktop and mobile tasks honestly.
