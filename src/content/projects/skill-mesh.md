---
title: "Skill Mesh v3"
blurb: "50 agent skills for Claude Code, with 48 also packaged for OpenAI Codex: shared workflows for planning, building, independent review, and shipping."
tech: ["Claude Code", "OpenAI Codex", "PowerShell", "Python"]
repo: "https://github.com/aberson/skill-mesh"
order: 3
featured: true
---

**[Skill Mesh v3.0.2 is released](https://github.com/aberson/skill-mesh/releases/tag/v3.0.2).**
[Install the release](https://github.com/aberson/skill-mesh#install-or-upgrade),
browse the [complete skill reference](https://github.com/aberson/skill-mesh/blob/main/documentation/skill-reference.md),
or explore [all 50 workflow diagrams](https://github.com/aberson/skill-mesh/tree/main/docs/workflows).

## Problem

Useful agent workflows become difficult to maintain when each host carries its own
copy of the instructions. Planning, implementation, review, and handoff can drift
apart. A successful component check can also obscure whether the user's actual
workflow works.

I built Skill Mesh to keep behavior in shared contracts, make required gates
explicit, and package the same portable workflows for different agent hosts.

## Approach

Each portable skill has one behavior contract and a thin adapter for Claude Code
or OpenAI Codex. The builder generates host-native packages;
the installer records ownership so upgrades and removal can distinguish managed
files from unrelated user content.

The delivery workflow connects planning, GitHub issue preparation, isolated build
steps, automated checks, independent review, and acceptance. Session skills preserve
task state and distinguish a durable handoff from unfinished work. Missing required
host capabilities produce explicit holds rather than weaker substitute checks.

### Utility projects do the mechanical work

- **Drift Ranger** preserves the intended outcome and evidence of progress; skills
  fall back to private session state when the utility is unavailable.
- **Find Again** offers optional prior-work retrieval during feature planning.
- **dev-observatory** supplies portfolio validation and static launcher diagnostics.
- **Citation Needed** owns evidence records and scoring while review skills
  coordinate independent judges.
- **Passing Notes** carries notes between windows that each own a lane of a
  project's work, so parallel sessions coordinate without the operator relaying.
- **Show Your Work** validates the source-linked Mermaid diagrams and generates
  the documentation index.

These are separate projects, not an implicit bundle of always-running services.
The [integration table](https://github.com/aberson/skill-mesh#how-utility-projects-are-used)
records which callers exist, which dependencies are optional, and which proposed
hookups remain deferred.

## Outcome

Version 3 includes **50 Claude skills, 48 of them also packaged for Codex**. It
retired, folded or moved eleven little-used skills, rebuilt the project-status skill
around verified facts, a routed board and lanes, and made reviews fail only on real
defects instead of style notes. Tests are now sized to the change: the one full
repository run per release dropped from about 3 h 46 min to about 1 h 05 min. Every
v3 release passed that run after install, and the installed files were checked
byte for byte against the published archive, after the check was shown to catch a
planted defect.

GitHub Copilot is no longer supported; its old profile is removed in v4. The release
includes a complete skill reference and 50 source-linked workflow diagrams.
Qualification is scoped: it does not claim every workflow was live-tested on every
host. Lesson harvesting remains preview-only, and the
[release notes](https://github.com/aberson/skill-mesh/releases/tag/v3.0.2) record
the checks that ran and installation limits.

The practical result is a versioned toolkit with inspectable workflows, documented
dependencies, and an installation path that can be checked and reversed.
