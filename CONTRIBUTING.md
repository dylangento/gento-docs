# Maintaining the bilingual documentation

The `review/` records mentioned below are kept locally and are not part of the repository (see `.gitignore`).

1. Identify the Chinese source, product configuration, revision, and relevant pages. Register it in `review/sources.json`.
2. Update the Chinese MDX page first. Preserve warnings and configuration boundaries. Do not invent missing specifications, IPs, joint targets, command syntax, or calibration parameters.
3. Update its English counterpart at the same relative path. Translate diagram labels or provide a readable English legend.
4. Mark technical, translation, and public-release review as pending in `review/page-status.json`. Keep source references in both front matters current.
5. Compare the English translation with the Chinese body. The `source_zh_sha256` fingerprint in the English page records the Chinese body used for translation. Updating the fingerprint records synchronization, not approval.
6. Run `npm run check:content` and `npm run build`. Review both languages, mobile navigation, search, source images, and external resource links.
7. Record reviewer, date, and approved revision in the page-status record before setting that review field to `approved`. Dylan reviews English; the technical reviewer must be assigned by the owner.

The `check:release` command fails while approvals are pending. It is a local preflight check, not a publishing command. Pushing to `main` deploys the site (see the README).

## Updating translation fingerprints

After the English page has been synchronized with a Chinese edit, use SHA-256 of the trimmed Chinese MDX body (after YAML front matter). Update the fingerprint in both page front matters and `review/page-status.json`. Do not update it merely to silence a stale-translation check.

## Upstream SDK changes

Link to authoritative SDK repositories; keep application code in its original repository. Record the exact tag or commit selected for a supported release. A newer upstream commit should create a review task for affected pages, not silently replace installation instructions. Avoid separate long-lived English and Chinese code branches.

## Images and source documents

Preserve provenance for each extracted image. Do not commit signed download URLs, account credentials, controller login instructions, full raw manuals, or customer-specific records. The current content extracts only the selected diagrams and reorganized setup material.
