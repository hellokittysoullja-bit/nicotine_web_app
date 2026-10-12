# Dashboard and monitor recipe

Use for operational status, KPIs, trends, anomalies, comparisons, and analytical decision support.

## User job and path

The primary job is “understand what changed, why it matters, and what to do next.” A static demonstration may use the simple path with clearly labelled fixture data. Real monitoring, saved filters, alerts, role-specific views, or server data requires the capability path.

## Recommended structure

1. Product-specific header with current scope, freshness, and primary control.
2. A small KPI set with units, comparison periods, and meaning.
3. One dominant analytical view that answers the main question.
4. Supporting breakdowns, anomalies, or drivers.
5. Detail table or event stream for verification and action.
6. Notes about definitions, timezone, latency, and missing data.

## Data contract

Define metric name, formula, grain, unit, timezone, source, refresh cadence, comparison basis, filters, and missing-value behavior. A number without context is decoration.

Use charts only when they reveal a relationship more clearly than a sentence or table. Always provide a readable title, summary, units, legend, and table or text alternative for essential information.

## Interaction and states

- Time range, segment, scope, comparison, drill-down, and reset.
- Loading or skeleton state that preserves layout without faking values.
- Empty, partial, delayed, stale, error, offline, and permission-denied states.
- A clear distinction between filters that update immediately and actions that require apply/submit.
- Preserve or share state in the URL when it benefits collaboration.

## Visual traps

- Do not fill the first viewport with generic sidebar chrome before showing the product's key signal.
- Avoid KPI card walls, rainbow chart palettes, unlabeled sparklines, fake precision, and equal emphasis on every metric.
- Do not use red and green as the only signal.
- Keep dense layouts calm through hierarchy, alignment, whitespace, and consistent units.

## Responsive and accessibility

Recompose instead of shrinking. Prioritize the main question, convert wide tables to scrollable or stacked views deliberately, and keep filters accessible. Chart information must remain available without color, hover, or a pointer.

## Done criteria

- [ ] The page answers the primary operational question in the first viewport.
- [ ] Metrics show definition, unit, timeframe, comparison, and freshness.
- [ ] Filters and drill-downs produce coherent state and can be reset.
- [ ] Empty, error, stale, loading, and permission states are implemented.
- [ ] Essential chart data has a textual or tabular alternative.
- [ ] Demo data is labelled as fixture data; live claims are verified.
