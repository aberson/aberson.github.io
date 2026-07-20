---
title: void-furnace
blurb: "An autonomous code-generation factory: three isolated Claude subprocesses — a planner, a coder, and a critic structurally held out from the coder's own narration — turn filed GitHub issues into merged pull requests on a timer, gated by tests and strict-typed CI."
tech: ["Python", "Claude Code CLI", "SQLite", "systemd"]
repo: "https://github.com/aberson/void-furnace"
order: 2
featured: true
---

## Problem

There is a trust problem at the center of autonomous code generation. If one AI
writes the code and the same AI reviews it, the review is theater: a model that
just spent its reasoning arguing for a change will happily rationalize approving
it. That is why most "autonomous" pipelines quietly keep a human at the merge
gate — the human is the one reviewer nobody suspects of colluding with the author.

I wanted to remove the human from the routine loop entirely: file an issue, and
get back a merged pull request, with nobody watching. The hard part was never
generating the code — a capable model does that. The hard part is making the
_review_ trustworthy enough that I would let it merge to a real branch unattended,
overnight, hundreds of times.

## Approach

I split the work into three isolated roles, each its own Claude subprocess: a
**planner** that turns an issue into a concrete change plan, a **coder** that
implements it, and a **critic** that decides whether it ships.

The load-bearing decision is the boundary between the coder and the critic. The
critic never sees the coder's _narration_ — none of its reasoning, its confidence,
its "here is why this is correct." It sees only the artifact: the diff, the tests,
the objective evidence. A reviewer who can read the author's argument is
half-persuaded before it starts; a reviewer who can only see the code has to judge
the code.

That boundary cannot just be a convention, because conventions erode — a later
refactor threads the coder's context into the critic "just to give it more
information," and the objectivity is gone with no failing test to notice. So I
enforced it structurally, at the level of which data each role is even allowed to
receive, and locked it with an **AST guard in CI**: a check that parses the source
and fails the build if the critic's inputs ever grow to include the coder's
narration. The invariant is defended by the same suite that defends the features.

### The loop

A **systemd timer** wakes the factory every ten minutes, pulls any newly filed
GitHub issues, and runs planner → coder → critic. Tests and the critic gate the
merge; nothing lands that a fresh, isolated critic would not approve on the
evidence alone.

### The audit trail

Every decision streams to **JSONL telemetry** and **SQLite** (WAL) state —
per-role, per-iteration, with **cost ledgers** tracking exactly what each run
spent. When the factory merges a PR at 3am, I can reconstruct afterward what the
plan was, what the coder produced, what the critic saw, and what it cost. An
autonomous system I cannot audit is one I cannot trust; the ledger and the
telemetry are what turn "it merged something" into "here is precisely what it did,
and why."

### Publishing without leaking

The production repo is private, with its own history and operator state. To
open-source the architecture without exposing any of that, I built the export
itself: a script produces a curated, **history-free single-commit** snapshot, and
a second script verifies the result before it is pushed. This public mirror is
that snapshot — the shape of the system, none of the private history.

The later phases pushed on cost and self-improvement: a track where the factory
reads its own telemetry to improve, and an open-model runtime that routes cheap,
high-volume calls to a **local llama.cpp** model chosen by a **diff-scored
bake-off** — candidates are ranked on the actual production artifact (the diff they
produce end to end), never on a transcript, because a model can narrate a beautiful
build and write zero files.

## Outcome

The loop closes. Filed issues become merged pull requests with no human at the
gate — the first product it built end to end was a small calculator app, shipped
issue by issue at a few cents of model spend per merge. (That calculator is
_factory output_, not a project of its own; I cite it only as proof the
issue-to-merged-PR loop actually closes.)

Underneath it is real engineering rigor: roughly two thousand tests, `mypy
--strict`, and the AST-enforced architectural invariants, all gated in CI. To be
precise about scope, because credibility is the whole point: this is a solo
personal project. "Production-grade" here means that rigor — a real suite, strict
typing, hard safety gates, a full audit trail — not a commercial deployment or
external users. It has neither.

What I set out to prove is a general claim about autonomous decision systems: they
become trustworthy only when the reviewer is _structurally_ prevented from
colluding with the producer, and the signal driving the decision is measured on
the real artifact rather than the producer's account of it. Held-out review, hard
gates, cost ledgers, a full audit trail — that is the same architecture a financial
decision or governance system wants, and the reason this project matters to me
beyond shipping a calculator. The transfer is by analogy: there is no finance code
in the factory. But the shape — independent, incorruptible review over an
auditable, cost-tracked loop — is exactly what I spent years wanting in finance,
and what I set out to build here from first principles.
