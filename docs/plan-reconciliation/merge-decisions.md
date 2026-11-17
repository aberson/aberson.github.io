# Merge extraction and decisions

## Original site plan

- Vision / goal: accessible professional static portfolio, free subdomain first.
- Phase list: 1–6 and later M1 delivered; M2 pending, optional M3 deferred.
- Data contracts: original Markdown content collection, root-base static routes and vendored tokens; no API/DB.
- External dependencies: Astro/Node, Pages/Actions, operator identity/career sources, optional registrar.
- Kill criteria and rollbacks: fail deployment gates on broken links, placeholders or accessibility regressions; retain free subdomain until optional domain selected.

## Work refresh plan

- Vision / goal: observatory-fed five-group Work section with coherent tools narrative and auto-theme brand.
- Phase list: 7–12 delivered per later root/CLAUDE record; M4 human acceptance pending.
- Data contracts: version1 portfolio JSON and Zod/count pins; local featured Markdown bodies; registry-owned URLs.
- External dependencies: Observatory export, xmarks published dossier, vendored site brand, Pages workflow.
- Kill criteria and rollbacks: fail loudly on schema/count drift; linkless private repos; local gates before publishing and operator visual acceptance.

[PATTERN: same-goal-different-fidelity] Refresh replaces earlier static card shape; current code/CLAUDE is spine.
[PATTERN: implicit-prerequisites] Refresh retains original routes/accessibility/deploy/security prerequisites.
[PATTERN: conflicting-invariants] Later recorded deployment supersedes local-only handoff; real PDF commit supersedes placeholder prose. Neither closes M4.
[PATTERN: implicit-prerequisites] Optional M3 mixes operator and code; split M3A preserves every configuration requirement under the same issue.
