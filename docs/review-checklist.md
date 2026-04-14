# Review Checklist

Use this checklist when reviewing any PR in this repository.

## Scope
- Confirm the PR matches the intended slice in `docs/pr-plan.md`.
- Confirm the changes do not include unrelated product work.
- Confirm the implementation follows `docs/spec.md` as the source of truth.

## Architecture
- Confirm no backend, CMS, or global state library was introduced.
- Confirm routing, navigation, and localStorage usage remain aligned with the spec.
- Confirm shared patterns stay centralized rather than duplicated across pages.

## Code Quality
- Confirm the changes are narrowly scoped and reviewable.
- Confirm lint passes.
- Confirm TypeScript or build validation passes when relevant.

## Content Safety
- Confirm content files were not rewritten or normalized unless the PR explicitly required it.
- If encoding or mojibake issues are present, confirm they are called out clearly rather than silently changed.
