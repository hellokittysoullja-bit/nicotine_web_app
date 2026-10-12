# Design Choice Flow

Use this flow when an unresolved visual decision would materially change the result. Skip it when direction is already clear, the change must follow an existing design system, or the user asks the agent to decide.

## Choose the Decision

Compare one decision per round. Good candidates include:

- full-page art direction;
- information layout;
- palette and contrast rhythm;
- typography pairing;
- visual density;
- component geometry;
- illustration or photography language.

Do not ask the user to choose implementation details that have no visible or strategic consequence.

## Prepare Exactly Three Options

For every high-impact comparison, produce exactly three options. They must use the same realistic content, viewport, aspect ratio, and medium so the chosen variable is easy to judge.

Each option must have:

- a stable identifier and short title;
- a genuinely distinct design thesis;
- the same amount and hierarchy of content as the other options;
- an artifact path or viewable preview when rendering is available;
- an implementation brief covering palette, type, grid, spacing, imagery, interaction, and motion;
- a concise statement of strengths and tradeoffs.

Reject near-duplicates, intentionally weak options, and options that differ mainly through decorative imagery.

## Preview Medium

Use the lightest medium that communicates the decision accurately:

- HTML and CSS for layout, typography, density, navigation, component style, and responsive composition;
- image previews for art direction or illustration language when static imagery is the actual decision;
- structured text only when no reliable rendering path exists.

Keep preview files outside product source until a direction is selected. Do not let temporary preview code become production code accidentally.

## Present Sequentially

Show one comparison at a time and wait for the selection before preparing another. Later rounds must preserve all earlier selections.

Use no more than four rounds. Stop sooner as soon as the visual direction is implementation-ready. Common sequences are:

1. full-page direction;
2. layout or information density;
3. palette and typography;
4. one remaining high-risk component decision.

Do not open several pickers concurrently or repeatedly revisit a settled choice without new evidence.

## Capability Fallbacks

Use this order without installing new browser software merely to show options:

1. Use an available visual picker with the three preview artifacts.
2. Render the three HTML options with an existing browser or approved renderer.
3. Provide the three self-contained artifacts for the user to open.
4. Present a compact text comparison with exact implementation values.

If a browser is unavailable, preserve the comparison by keeping content, viewport assumptions, and briefs identical. State that the decision was made from specifications rather than rendered evidence.

If the user delegates the choice, select the strongest option against the brief, record why it wins, and continue without manufacturing a picker interaction.

## Lock the Direction

After the final selection, create a compact decision record:

- one-sentence art direction;
- selected option identifiers;
- color, type, spacing, geometry, and imagery rules;
- responsive transformations;
- interaction and motion rules;
- explicit rejected patterns.

Treat the selected preview as the visual source of truth when it conflicts with an earlier prose description. Changes after selection should solve implementation evidence, not silently replace the chosen concept.

## Choice-Flow Check

- [ ] A real high-impact uncertainty justified the comparison.
- [ ] Exactly three comparable options were produced.
- [ ] Only one variable or coherent direction changed in the round.
- [ ] All options used realistic shared content and the same viewport assumptions.
- [ ] No more than four sequential rounds were used.
- [ ] The chosen direction is recorded in implementation-ready terms.
