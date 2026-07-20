---
title: Alpha4Gate
blurb: "A self-improving StarCraft II bot: a Claude-advised loop that reads its own telemetry and auto-commits fixes (gated by tests + validation games), plus a self-play arena with an Elo ladder."
tech: ["Python", "PyTorch/SB3", "FastAPI", "React"]
repo: "https://github.com/aberson/Alpha4Gate"
order: 1
featured: true
---

## Problem

Most game-playing agents are trained once and then frozen. The genuinely hard
engineering problem isn't beating StarCraft II — it's building a system that
improves _itself_, on its own schedule, without a human in the loop for every
fix. I wanted to know whether I could close that loop end to end: let a bot play,
watch itself lose, reason about _why_ it lost, write the fix, prove the fix is
safe, and ship it — all without me touching the keyboard.

That goal runs straight into three problems that make most "self-improving"
systems either unsafe or dishonest.

The first is **trust**. An agent that can rewrite its own code can just as easily
break itself. If a proposed change regresses play, an unattended system will
happily commit it and keep going, compounding the damage over hundreds of games.
So any change the system makes to itself has to clear a gate that a bad change
cannot pass by accident.

The second is **a reliable feedback signal**. "Did this change help?" is
deceptively hard in a game with enormous variance — a single match tells you
almost nothing, because a strong version loses games it should win and a weak one
steals wins it doesn't deserve. Without a measurement I actually trust, every
downstream decision is built on noise.

The third is **transparency**. A closed loop that improves in the dark is
impossible to debug and impossible to believe. When the bot promotes a new
version at 3am, I need to be able to reconstruct exactly what changed, what
evidence justified it, and what the alternative was.

Alpha4Gate is my answer to all three, built solo over roughly eight months.

## Approach

I split self-improvement into **two independent learning loops**, deliberately,
because they fail in different ways and I didn't want a single mechanism to be
load-bearing for both correctness and strength.

### Loop 1 — the Claude-advised repair loop

The first loop treats the bot's own telemetry as a bug report. After a batch of
games, an advisor built on the Claude CLI reads the structured game logs,
diagnoses a concrete failure mode, and proposes a code change to address it. The
key decision here is what happens _next_: nothing the advisor writes reaches the
main branch until it has **passed the full test suite and then won a gate of five
validation games**. Tests catch the change that is merely broken; the validation
games catch the change that compiles, passes unit tests, and still makes the bot
play worse. A fix has to survive both to be auto-committed.

The reason this matters is that unit tests and live play measure different
things. A change can be perfectly correct in isolation and still be a regression
in the only unit that counts — actual games won. Requiring both gates is the
difference between "the code runs" and "the bot is better," and I refused to
conflate them.

### Loop 2 — the self-play arena

The second loop answers a different question: given several viable versions of
the bot, which is actually strongest? Here versions compete **head-to-head in a
self-play arena**, gated by fitness and regression checks, with an **Elo ladder**
that auto-promotes winners. Elo is the right instrument because it aggregates
many noisy match outcomes into a stable strength estimate — exactly the reliable
signal that a single game can't give you. A version only earns promotion by
beating the incumbents repeatedly, so promotion tracks real strength rather than
a lucky streak.

Underneath both loops, the policy itself is a PyTorch model trained with Stable
Baselines 3 — PPO with an LSTM so the agent carries memory across a match, warm-
started with imitation pretraining so it doesn't begin from noise. Training runs
inside a Docker substrate so a run is reproducible and isolated from my
workstation. Match and evaluation state persists in SQLite, which becomes the
audit trail: every promotion, every validation result, every Elo update is a row
I can query after the fact.

### Making the loop observable

The transparency requirement drove a real-time layer. A FastAPI backend streams
every decision over WebSocket to a React/TypeScript dashboard, so when the system
diagnoses a failure, runs a validation gate, or promotes a version, I can watch it
happen live and replay it later. This wasn't decoration — being able to _see_ the
loop is what made it debuggable enough to trust unattended.

I want to be precise about scope, because credibility is the whole point of a
portfolio. Alpha4Gate is a solo personal project. "Production-grade" here means
engineering rigor — a real test suite, typed interfaces, reproducible training,
hard safety gates — not a commercial deployment or external users. There is no
finance code anywhere in it. I mention finance only by way of analogy: the
architecture — a self-improving decision engine with a trustworthy feedback
signal, hard promotion gates, and a full audit trail — is the same shape a
disciplined trading or risk system wants, and that transfer is the reason the
project matters to me beyond the game.

## Outcome

The system works as a closed loop. Over roughly **eight months and about 630
commits**, it grew through **14 shipped phases** into a platform that trains,
diagnoses, repairs, and promotes itself, backed by around **1,800 tests** that
the repair loop must clear before any self-authored change is allowed to land.
The self-play arena auto-promoted a lineage of versions from **v0 through v13**,
each one having earned its place on the Elo ladder rather than being hand-picked
by me.

What I'm proudest of isn't any single win rate — it's that the guardrails held.
The five-validation-game gate and the Elo-gated promotion meant the bot could
change its own code overnight without me babysitting it and without silently
regressing, and the SQLite audit trail plus the live dashboard meant I could
always answer "why did it do that?" after the fact.

The transferable lesson is the one I set out to prove: a system can improve itself
safely if — and only if — every self-authored change is forced through a gate
that a bad change cannot pass by luck, and if the signal driving the decision is
aggregated until it's actually trustworthy. That pattern — closed-loop learning,
reliable feedback, hard gates, transparent audit — is what I take from Alpha4Gate
into the applied-AI systems I want to build next.
