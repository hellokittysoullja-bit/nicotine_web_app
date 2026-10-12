# Contributing

Thanks for helping Website Studio become clearer, more portable, and more honest about what an Agent has actually verified.

## Good contributions

- A new website recipe with a distinct user job and QA checklist.
- A correction backed by official Agent or platform documentation.
- A reproducible validator bug with a minimal fixture.
- A quality rule that prevents a concrete failure without forcing one visual style.
- Accessibility, responsive, security, privacy, rights, or deployment improvements.

## Before changing the package

1. Read `SKILL.md` and the closest related reference or recipe.
2. Keep the change scoped to one problem.
3. Do not copy third-party site text, designs, images, fonts, audio, or video into this repository.
4. Keep user-specific examples fictional and free of personal data.
5. Add or update tests for deterministic behavior.

## Validate locally

Node.js 20 or newer is required for the optional validators.

```bash
npm test
node --check scripts/*.mjs
```

If you changed an HTML example, inspect it at desktop, tablet, 390 px, and 320 px. Test keyboard focus, menus, overflow, critical states, and console errors.

## Pull requests

Explain:

- what changed;
- why the workflow needs it;
- which Agent or website scenario it affects;
- what you directly tested;
- what remains unverified.

Compatibility claims must link to official product documentation. “It worked for me” is useful evidence, but it does not replace a documented support boundary.
