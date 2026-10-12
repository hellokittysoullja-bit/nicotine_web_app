# Security policy

Website Studio is an instruction package with optional local validation scripts. It does not require API keys and should never contain credentials.

## Report a vulnerability

Please use the repository's **Security → Report a vulnerability** flow to send a private report. Do not open a public Issue for a vulnerability that could expose users, credentials, local files, or deployment systems.

Include the affected version, the exact file or workflow, reproduction steps, impact, and any safe mitigation you already tested.

## Trust boundary

- Review `SKILL.md` and `scripts/` before installation.
- Do not grant blanket shell, deployment, or credential access merely because a Skill is hosted on GitHub.
- Run deployment validation only against targets you trust and are authorized to test.
- Website Studio never makes authentication or authorization decisions on behalf of a production backend.
- Security guidance in this repository is an engineering baseline, not a substitute for a professional security review.
