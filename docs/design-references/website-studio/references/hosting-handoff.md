# Hosting handoff

Publishing is complete only when the validated source or artifact reaches the intended host and the resulting access model has been verified. If deployment capability is unavailable, provide a precise handoff without claiming publication.

## Handoff record

Record:

- Deployment target, environment, region when relevant, and intended public or private access.
- Source revision or immutable build identifier.
- Build command or adapter action and deployable `outputDir` or server artifact.
- Runtime version and required public configuration keys.
- Secret names, described without values, and where an authorised operator must set them.
- Structured-data bindings, migrations, blob-storage bindings, identity configuration, and connector requirements.
- Base path, canonical URL, redirect, rewrite, trailing-slash, custom-domain, and cache expectations.
- Health-check path, representative asset paths, rollback method, and responsible contact.

Do not put credentials, write tokens, private keys, or sensitive environment values in the handoff document.

## Before deployment

1. Build from the exact source revision intended for release.
2. Run automated checks and resolve blocking media, source, security, and accessibility findings.
3. Confirm that the adapter's output format matches the target host: static files, server bundle, worker, container, or another documented artifact.
4. Apply or stage reviewed database migrations using the platform's normal process.
5. Confirm that required secrets and bindings exist in the target environment without printing their values.
6. Decide whether the release should be public, private, workspace-restricted, or allowlisted.

## Deployment behavior

- Prefer the project's existing deployment workflow.
- Use an available hosting connector or platform tool according to its current live schema and permission model.
- Keep deployment credentials out of remote URLs, command history, logs, and persistent project configuration.
- Do not silently change hosts, access mode, domains, or storage providers to work around an error.
- Treat quota, permission, ownership, and policy failures as decisions for the user or administrator.
- Preserve the last known good release and document how to return to it.

## Post-deployment verification

Test the deployed result, not only the local preview:

- Public sites: open the canonical URL without an authenticated session and confirm that it does not redirect to sign-in or an access-request screen.
- Private sites: verify both authorised access and correct rejection of an anonymous or unauthorised visitor.
- Check the page response, representative CSS, JavaScript, image and social-preview assets, and their content types.
- Refresh at least one deep link and test the not-found route.
- Exercise one critical read flow and, when safe, one reversible write flow for capability-path products.
- Confirm that current notices, metadata, source attribution, and rights statements match the validated build.
- Recheck base-path and cache behavior on hosts that publish below a repository or project subpath.

## When deployment is unavailable

Provide:

1. The validated deployable directory or server artifact.
2. The target adapter and exact missing prerequisite, such as permission, account choice, secret, domain, or connector.
3. Environment variable names, binding names, migrations, and access-mode decisions still required.
4. A short operator checklist for deploy and post-deploy verification.

Say that the project is **ready to deploy** or **build-validated**, not deployed. Do not invent a URL, status, account, or successful browser check.

## Final report

Return the verified URL when one exists, state the access model, summarize the checks performed, and list any remaining operational risk. Keep credentials and internal deployment identifiers out of ordinary user-facing output unless the user explicitly needs them.
