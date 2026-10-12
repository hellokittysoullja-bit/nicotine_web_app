# Content and UX

Treat content, information architecture, and interaction as one system. A polished interface cannot rescue an unclear user job or missing evidence.

## Start With the User Job

Write the primary job as:

> When `[situation]`, the visitor needs to `[task]` so they can `[outcome]`.

Every route and major section should help complete that job, answer an objection, or build necessary trust. Remove sections whose only purpose is to make the page longer.

## Build the Information Architecture

For each route, define:

- visitor intent on arrival;
- primary heading and action;
- required evidence or content;
- navigation entry and exit paths;
- possible empty, error, loading, and permission states;
- next step after success.

Use one primary action per context. Secondary actions should support, not compete with, it.

Navigation labels should match visitor language. Avoid clever labels that require interpretation. Deep pages need breadcrumbs, local navigation, or another clear orientation mechanism.

## Use Real Content Early

Design with realistic titles, names, dates, prices, descriptions, images, and data ranges. Placeholder copy hides wrapping, hierarchy, data-density, and localization problems.

Separate:

- **claims**, which need evidence;
- **instructions**, which need clarity;
- **interface labels**, which need brevity;
- **narrative copy**, which can carry voice;
- **legal or rights text**, which must remain precise.

Do not fabricate testimonials, customer logos, usage metrics, awards, availability, or research findings.

## Model Content and Data

Define stable fields before building repeated UI. Include identifiers, labels, status vocabulary, source or owner, timestamps when useful, and optional fields. Distinguish absent data from zero, unknown, unavailable, and not applicable.

For dynamic products, specify ownership and refresh behavior. Explain what is live, cached, user-entered, calculated, or illustrative.

## Complete Interaction Flows

For every primary flow, trace:

1. entry;
2. required input or selection;
3. validation and feedback;
4. success result;
5. recovery from errors;
6. safe cancellation or back navigation.

Forms need visible labels, helpful constraints, field-level errors, submission state, success confirmation, and preservation of valid input after failure. Destructive actions require proportionate confirmation and recovery.

Search and filtering need initial, active, no-results, cleared, and failed states. Preserve useful state in the URL when sharing or returning to the view matters.

## Build Trust

Use evidence appropriate to the archetype: case-study outcomes, product screenshots, source links, authorship, update ownership, pricing detail, security or privacy notes, contact information, or clear limitations.

When using third-party text or media:

- verify factual claims through appropriate sources;
- record rights and attribution separately from factual sourcing;
- prefer authorized embeds or links over mirrored protected files;
- do not assume public visibility or noncommercial use grants redistribution rights.

## Metadata and Share Context

Set an accurate page title, description, language, canonical behavior when relevant, favicon, and social preview. The preview should represent the real site and must not introduce unsupported claims or unreadable generated text.

## UX Review

- [ ] Every route has a clear arrival intent, primary action, and next step.
- [ ] Navigation uses audience language and preserves orientation.
- [ ] Realistic content proves the layout at long and short extremes.
- [ ] Claims, evidence, data ownership, and limitations are clear.
- [ ] Every reachable loading, empty, error, success, and permission state is handled.
- [ ] Forms and destructive actions provide recovery.
- [ ] Metadata and social context accurately describe the finished experience.
