# Directory and catalog recipe

Use for collections people need to discover, search, filter, compare, and open in detail: resource directories, product catalogs, service lists, team directories, libraries, and galleries.

## User job and path

The primary job is “find the right item with confidence.” Use the simple path only for a small, stable collection with client-side search and no saved state. Use the capability path for large or changing datasets, server filtering, accounts, favourites, submissions, inventory, or protected entries.

## Recommended structure

1. Clear scope and collection promise.
2. Search plus the few filters that reflect real decisions.
3. Result count, active-filter summary, and reset action.
4. Scannable result list or grid with comparable fields.
5. Detail route or disclosure with complete information and primary action.
6. Method, freshness, source, or submission notes when trust matters.

## Content and data

Define the item schema, stable identifier, required fields, optional fields, categories, sort keys, and source of truth before building UI. Normalize labels and units. Decide whether filters are independent, hierarchical, or mutually exclusive.

Do not load every field into every card. Cards support selection; detail views support understanding.

## Interaction and states

- Search input, filter controls, sorting, pagination or progressive loading.
- URL state for shareable searches when useful.
- Loading, no results, partial data, error, stale data, and empty collection states.
- Clear recovery: reset filters, revise query, retry, or return to collection.
- Keyboard-operable controls and predictable focus after filtering.

## Visual traps

- Do not make all cards visually equal when some attributes drive the decision.
- Do not hide essential comparison data behind hover.
- Avoid filter sidebars that consume the page on mobile; use an explicit disclosure with active count.
- Avoid decorative thumbnails when no meaningful image exists.

## Responsive and accessibility

Keep search and result count discoverable. Preserve reading order when a grid collapses. Announce result-count changes when filtering is dynamic. Use real labels for inputs, buttons for actions, links for destinations, and table semantics for dense comparison data.

## Done criteria

- [ ] A user can find a known item and explore an unknown one.
- [ ] Search, filters, sorting, reset, deep links, and no-result recovery work.
- [ ] Data freshness, provenance, and missing values are clear.
- [ ] Mobile controls remain reachable without horizontal overflow.
- [ ] Large or protected collections use a real data and authorization path.
