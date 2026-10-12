# Repository instructions

This repository contains one portable Agent Skill: `website-studio`.

## Working rules

- Keep `SKILL.md` concise and route detailed guidance into one-level-deep files.
- Preserve the cross-agent core. Do not depend on vendor-only frontmatter or tools.
- Do not add binary media, third-party brand assets, fonts, photos, audio, or video.
- Use relative paths inside the Skill and keep every referenced file present.
- Do not claim a client, deployment, browser flow, or public URL was tested without direct evidence.
- When compatibility details change, cite the product's official documentation in `docs/agent-setup.md`.
- Never include secrets, local machine paths, customer data, or copyrighted project media.

## Verification

Run before every pull request or release:

```bash
npm test
```

For script syntax checks:

```bash
node --check scripts/*.mjs
```

For a release, commit first and then run:

```bash
npm run package:release
```

Extract the generated ZIP into a fresh directory and run `npm test` from the extracted `website-studio` folder.
