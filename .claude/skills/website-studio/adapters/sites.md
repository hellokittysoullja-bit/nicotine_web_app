# Sites adapter

Use this adapter when the user explicitly requests Sites or the project contains Sites hosting metadata.

## Prefer native Sites capabilities

When native `sites-building` and `sites-hosting` skills are available:

1. Load and follow their current instructions.
2. Treat live Sites connector and tool descriptions as the source of truth for arguments, permissions, archive requirements, deployment states, and returned values.
3. Do not copy volatile connector API arguments or deployment internals into this portable skill.
4. Let the native skills own Sites-specific setup, preview, persistence, identity, packaging, versioning, and hosting behavior.
5. Apply Website Studio's design, content, accessibility, security, source, rights, and evidence requirements around that native workflow.

If a native instruction conflicts with a static note in this adapter, use the live native instruction.

## Adapter contract mapping

| Field | Sites mapping |
| --- | --- |
| `scaffold` | Native Sites project setup for a new target; preserve an existing Sites project. |
| `dev` | The development process defined by the native building skill and the current project. |
| `build` | The production build required by the native hosting workflow. |
| `outputDir` | The artifact shape currently required by Sites; obtain it from native instructions rather than hardcoding it here. |
| `preview` | Native preview and available in-app browser handoff. |
| `deploy` | Native Sites hosting skill and live connector. |
| `env` | Sites-managed runtime configuration and secrets. |
| `structuredData` | Sites-provided structured storage when configured; otherwise unavailable. |
| `blobStorage` | Sites-provided object storage when configured; otherwise unavailable. |
| `identity` | The current Sites-supported identity and access model; distinguish authentication from workspace authorization. |
| `connectors` | Connected applications and services exposed to the current agent, limited to their live schemas and granted scopes. |

Do not enable data, storage, identity, or connectors speculatively. Load the corresponding capability recipe only when the product requires it.

## Existing Sites projects

- Preserve the package manager, lockfile, hosting metadata, logical bindings, source structure, and established deployment target.
- Do not replace working infrastructure merely to match a starter.
- Use the current native workflow to update bindings or migrations.
- Keep secrets in Sites-managed runtime configuration, not source files.

## Fallback when Sites is unavailable

If the native Sites skills or required connector are absent:

- Do not claim to have created, previewed, versioned, or deployed a Sites project.
- For an existing repository, use `adapters/existing-project.md` and preserve its source.
- For a new simple-path site, use `adapters/static.md` and prepare a portable static build.
- For a new capability-path product, use `adapters/generic-framework.md` after the user selects a compatible runtime and host.
- If deployment specifically must use Sites, report that the native Sites capability or permission is required and stop before inventing an alternative deployment.

Follow `references/hosting-handoff.md` for a build-only handoff.
