# Responsive and accessibility standard

Responsive design and accessibility are implementation constraints, not a final polish pass. Test the actual interface at the viewports declared in `site-quality.config.json` and with keyboard, zoom, and reduced motion.

## Responsive composition

- Begin with the smallest supported layout and add capacity when content benefits from it.
- Choose breakpoints from layout failure, not device names.
- Use fluid gutters and type with sensible minimum and maximum values.
- Constrain reading text by measure; constrain app content by task, not an arbitrary marketing-page width.
- Transform multi-column layouts into a meaningful reading and focus order.
- Do not use `overflow: hidden` or `clip` to conceal broken text, controls, tables, or charts.
- Check visible element bounds as well as `document.scrollWidth`; decorative full-bleed layers may be exempt, functional content is not.
- Preserve important image subjects with explicit `object-fit` and focal rules.
- Give wide tables an intentional small-screen treatment: priority columns, horizontal region with a label, or a task-specific card view.
- Keep fixed headers, bottom bars, menus, and dialogs usable at short viewport heights.

At minimum, include one desktop viewport at or above 1024 px and one phone viewport at or below 480 px. Add intermediate widths where the layout changes.

## Semantic page structure

- Provide one descriptive page heading in each rendered route.
- Use `header`, `nav`, `main`, `aside`, and `footer` according to their purpose.
- Use heading levels to describe hierarchy, not font size.
- Add a visible-on-focus skip link when repeated navigation precedes primary content.
- Use lists, tables, figures, definitions, and time elements when they represent the content accurately.
- Keep link text meaningful out of context.

## Keyboard and focus

- Every action must work without a pointer.
- Focus order must follow the visible reading and task order.
- Never remove the focus indicator without supplying a visible replacement.
- When a menu, dialog, or disclosure closes, return focus to the control that opened it when appropriate.
- Escape closes temporary overlays; Tab remains contained inside modal dialogs.
- Tabs use roving focus, arrow keys, `aria-selected`, `aria-controls`, and labelled tab panels.
- Do not make noninteractive containers clickable. Use native links, buttons, inputs, and details elements first.

## Forms and validation

- Every input has a persistent label; placeholder text is not a label.
- Explain format requirements before submission.
- Connect errors to fields programmatically and summarize multiple errors near the form start.
- Preserve entered values after validation and recoverable network errors.
- Mark required fields in text as well as programmatically.
- Success messages must identify what happened and what the user can do next.
- Destructive actions require specific wording and an appropriate confirmation or undo path.

## Images, media, and motion

- Meaningful images need concise alternative text that explains their purpose in context.
- Decorative images use an empty alternative and should not create redundant announcements.
- Every iframe has a title; media controls remain keyboard reachable.
- Captions, transcripts, or equivalent text are required when the media carries necessary information.
- `prefers-reduced-motion: reduce` removes nonessential animation and smooth scrolling.
- Do not rely on autoplay, parallax, blinking, or motion to communicate state.

## Data interfaces

- Charts have a descriptive title, units, legend or direct labels, and a text or table alternative for essential values.
- Color is not the only distinction between series or statuses.
- Tooltips are reachable by keyboard and do not contain the only copy of important data.
- Loading, empty, stale, unavailable, permission-denied, and error states are visually and semantically distinct.
- Announce material asynchronous updates with an appropriate live region; avoid announcing continuous noise.

## Visual checks

- Text and controls meet contrast requirements in default, hover, focus, active, disabled, and error states.
- Text zoom at 200% does not remove information or actions.
- Browser zoom and increased text spacing do not cause destructive overlap.
- Touch targets are comfortably sized and separated.
- Content remains understandable with images, fonts, embeds, or JavaScript delayed or unavailable where the rendering model permits.

Automated accessibility tools are a gate, not proof. Complete a manual keyboard pass and inspect the rendered accessibility tree for critical flows.
