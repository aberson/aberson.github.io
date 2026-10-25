---
title: "Skill Mesh v2"
blurb: "57 agent skills for Claude Code, with 54 also packaged for GitHub Copilot and OpenAI Codex: shared workflows for planning, building, reviewing, and shipping."
tech: ["Claude Code", "GitHub Copilot", "OpenAI Codex", "PowerShell", "Python"]
repo: "https://github.com/aberson/skill-mesh"
order: 3
featured: true
---

**[Skill Mesh v2.0.0 is released](https://github.com/aberson/skill-mesh/releases/tag/v2.0.0).**
[Install the release](https://github.com/aberson/skill-mesh#install-or-upgrade),
browse the [complete skill reference](https://github.com/aberson/skill-mesh/blob/main/documentation/skill-reference.md),
or explore [all 57 workflow diagrams](https://github.com/aberson/skill-mesh/tree/main/docs/workflows).

## Problem

Useful agent workflows become difficult to maintain when each host carries its own
copy of the instructions. Planning, implementation, review, and handoff can drift
apart. A successful component check can also obscure whether the user's actual
workflow works.

I built Skill Mesh to keep behavior in shared contracts, make required gates
explicit, and package the same portable workflows for different agent hosts.

## Approach

Each portable skill has one behavior contract and a thin adapter for Claude Code,
GitHub Copilot, or OpenAI Codex. The builder generates host-native packages;
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
- **Show Your Work** validates the source-linked Mermaid diagrams and generates
  the documentation index.

These are separate projects, not an implicit bundle of always-running services.
The [integration table](https://github.com/aberson/skill-mesh#how-utility-projects-are-used)
records which callers exist, which dependencies are optional, and which proposed
hookups remain deferred.

## Outcome

Version 2 includes **57 Claude skills and 54 portable skills each for Copilot and
Codex**, reconciling 15 retained candidates and completing 42 rebuilds. The exact
release candidate passed its full repository suite and all three profiles passed
disposable-home installation, upgrade, uninstall, and preserved-profile restoration.
The published archive was downloaded again and its checksum verified.

The release also includes a complete skill reference and 57 source-linked workflow
diagrams. Qualification is scoped: it does not claim every workflow was live-tested
on every host. Lesson harvesting remains preview-only, Observatory diagnostics are
static-only, and the [release notes](https://github.com/aberson/skill-mesh/releases/tag/v2.0.0)
retain native-host and presentation limitations.

The practical result is a versioned toolkit with inspectable workflows, documented
dependencies, and an installation path that can be checked and reversed.
