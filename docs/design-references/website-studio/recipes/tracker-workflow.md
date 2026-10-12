# Tracker and workflow recipe

Use for tasks, issues, applications, requests, pipelines, checklists, reviews, and any product where records move through defined states.

## User job and path

The primary job is “create a record, understand its current state, and move it safely toward completion.” Real workflows require the capability path for durable data, identity, authorization, concurrent edits, and history. A static prototype must use fictional data and label writes as simulated.

## Model the workflow first

Define:

- record type, stable identifier, required fields, owner, and timestamps;
- allowed states and legal transitions;
- who may perform each transition;
- validation and side effects for create, edit, transition, archive, restore, and delete;
- history, comments, attachments, notifications, and retention requirements;
- concurrency and conflict behavior.

Do not let UI labels become the only definition of the state machine.

## Recommended structure

1. Scope, status summary, and primary creation action.
2. Search, filters, saved views, and sorting.
3. List, table, or board matched to the workflow's comparison needs.
4. Record detail with current status, owner, next valid actions, and history.
5. Create/edit flow with validation and safe cancellation.
6. Activity, audit, or notification surface where required.

## Interaction and states

- Normal, empty, loading, error, offline, stale, and permission-denied views.
- Creating, saving, saved, failed, conflicting, deleting, and restoring states.
- Optimistic updates only when rollback is implemented and understandable.
- Preserve filters and view state in a shareable URL when useful.
- After creation or transition, place focus on the resulting record or status confirmation.

## Visual traps

- Do not use a Kanban board when users primarily compare fields across many records.
- Do not encode state with color alone.
- Avoid ambiguous actions such as “Done” when several transitions exist.
- Do not hide history, ownership, or failure behind decorative simplicity.

## Responsive and accessibility

On narrow screens, prioritize record identity, state, owner, and next action. Make drag-and-drop optional; every transition needs an equivalent keyboard and touch-safe control. Use live announcements for confirmed state changes without flooding the user.

## Done criteria

- [ ] The state model and authorization rules exist independently of presentation.
- [ ] Illegal transitions and conflicting writes are rejected safely.
- [ ] Create, edit, transition, archive/delete, and recovery flows are tested.
- [ ] Board, list, and detail views remain usable with keyboard and small screens.
- [ ] History records who changed what and when when accountability is required.
