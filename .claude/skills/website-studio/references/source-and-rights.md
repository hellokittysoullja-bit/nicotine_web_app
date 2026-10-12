# Sources, media, and data rights

Load this reference when the site contains researched claims, third-party media, brand assets, user uploads, client data, API data, or public distribution.

This is an operational publishing policy, not legal advice. If the basis for using material remains unclear, do not publish it.

## Keep two records

Facts and media permissions are separate questions.

- A **source ledger** records the claim, source URL, publisher or creator, verification date, and confidence.
- A **media manifest** records each asset, rights holder, permission or licence, attribution, usage scope, and release status.

A reliable article may support a date without granting permission to republish its images. A credit line identifies a creator but does not create a licence.

## Source discipline

Prefer primary or first-party sources for names, dates, product claims, pricing, release information, policies, and technical capabilities. Use reputable secondary sources for context. Treat community material as a discovery lead or clearly labelled interpretation unless independently verified.

- Paraphrase rather than copying long passages.
- Keep quotations short, necessary, and attributed.
- Label interpretation, estimates, rumours, unresolved announcements, and stale information.
- Record a verification date for information likely to change.
- Never claim to have collected “everything on the internet.”

## Media status vocabulary

Use one controlled status for every external or generated asset:

| Status | Public release | Evidence |
| --- | --- | --- |
| `original` | Allowed | Created and owned by the project or assigned to it. |
| `licensed` | Allowed | Licence or written permission covers the planned use. |
| `public-domain` | Allowed | Public-domain basis and relevant jurisdiction are documented. |
| `cc` | Allowed | Exact Creative Commons terms and attribution are satisfied. |
| `official-embed` | Allowed | Media remains on the authorised provider; no local mirror. |
| `user-provided` | Allowed conditionally | Provider confirms ownership or authority for the intended public use. |
| `internal-review-only` | Blocked publicly | Cleared only for a controlled prototype or review. |
| `unknown` | Blocked publicly | Source, ownership, permission, or intended-use coverage is incomplete. |

Do not invent softer status names for unclear assets.

## Image and media choices

- Use imagery only when it improves recognition, trust, explanation, or emotion.
- Reject an attractive hero image that is unrelated to the subject.
- Prefer suitable, documented media from authorised sources when real imagery matters.
- Generate original imagery only when the design needs it and existing suitable media is unavailable; inspect generated text, anatomy, branding, and factual implications.
- Prefer official embeds or outbound links for hosted audio and video.
- Give every image an explicit crop, focal, alt, caption, and credit strategy.
- Do not scrape or mirror large media collections because they are publicly reachable.

## Customer and connector data

For client, employee, customer, analytics, account, or connector data:

- collect only fields required by the product flow;
- define who can view, change, export, and delete records;
- keep secrets and credentials in platform secret storage;
- avoid real private data in fixtures, screenshots, logs, examples, and public demos;
- document retention and deletion behavior when the product stores personal or sensitive information;
- do not claim data is live when the page uses a fixture or mock.

## Public release gate

Before public release:

1. Resolve every factual claim to a source or label it as interpretation.
2. Resolve every shipped or embedded asset to the media manifest.
3. Remove all `internal-review-only`, `unknown`, or unrecorded assets from source, export, cache, thumbnails, and social previews.
4. Confirm that fonts, icons, logos, data, and user-provided content are covered for repository and deployment use.
5. Verify the deployed version and public repository, not only the local preview.

A noncommercial, educational, fan, or internal notice explains intent only. It does not grant permission or waive privacy and data obligations.
