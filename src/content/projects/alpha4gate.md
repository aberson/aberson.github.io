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

Alpha4Gate is my answer to all three, built solo since March 2026.

## Approach

I split self-improvement into **two independent learning loops**, deliberately,
because they fail in different ways and I didn't want a single mechanism to be
load-bearing for both correctness and strength.

### Loop 1 — the Claude-advised repair loop

The first loop treats the bot's own telemetry as a bug report. After a batch of
games, an advisor built on the Claude CLI reads the structured game logs,
diagnoses a concrete failure mode, and proposes a code change to address it. The
key decision here is what happens _next_: nothing the advisor writes is
auto-committed until it has **passed the test suite and quality checks, then a
batch of validation games** (ten by default) in which the win rate must not drop
by more than a set threshold, followed by a 20-game Elo check against the prior
version. Tests catch the change that is merely broken; the validation games catch
the change that compiles, passes unit tests, and still makes the bot play clearly
worse. A fix has to survive both to be auto-committed.

The reason this matters is that unit tests and live play measure different
things. A change can be perfectly correct in isolation and still be a regression
in the only unit that counts — actual games won. Requiring both gates is the
difference between "the code runs" and "the bot is better," and I refused to
conflate them.

### Loop 2 — the self-play arena

The second loop, evolve, answers a different question: does a new version of
the bot beat the one it replaces? Claude proposes about ten changes as text; each
candidate plays the current version **head-to-head in a self-play arena** (a
short fitness match, five games by default), the winners are re-written onto a
new numbered copy of the bot, and that copy must then win a strict majority of a
regression match against its parent — or the loop reverts its own promotion with
`git revert`. Versions also carry ratings on an **Elo ladder** I built for my own
versions. A short majority match is a noisy instrument, though: I later found
that it rolls back a change that does nothing about half the time, which is why
I've since built a different decision rule (still off by default and not yet
tested in a soak).

Underneath both loops, the bot plays through a coded rules engine by default. An
optional PPO policy — a small PyTorch network trained with Stable Baselines 3,
about 48,000 parameters — can pick among the rules engine's six strategic states in neural
or hybrid games; the checkpoint currently marked best was trained to imitate the
rules engine. Long runs can go to headless StarCraft II on Linux (the eight-hour
v4-to-v7 run used WSL), and the repo ships a Dockerfile for the same substrate.
Training data persists in SQLite, and every evolve promotion and rollback lands as a
git commit, which together become the audit trail I can query after the fact.

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

The system works as a closed loop. In its **first four months and about 640
commits**, it grew through **eleven shipped phases** into a platform that trains,
diagnoses, repairs, and promotes itself, backed by a Python test suite (3,310
passing tests as of 10 October 2026) that the repair loop must clear before any
self-authored change is allowed to land. The lineage of versions grew from
**v0 to v13** (v13 on 7 May 2026); eleven of the thirteen versions after v0
came through the full evolve loop, each tested against its immediate
parent rather than hand-picked by me. I have no recorded games of v13 against v0, so I
don't claim the latest version is the strongest; against the built-in AI, v13
beat the VeryHard (level 7) opponent in 4 of 10 games on 14 October 2026.

What I'm proudest of isn't any single win rate — it's that the loop ran on its
own and could undo itself. Overnight on 1 May 2026 the evolve loop promoted
three versions and reverted two attempts that lost to their parent, and the git
history, the training database and the live
dashboard meant I could always answer "why did it do that?" after the fact. The
gates also taught me their limits: a five-game majority check is close to a coin
flip for a change that does nothing.

I've written up two parts of the project in more detail:
[What My StarCraft II Bot Taught Me About Contract Drift](https://medium.com/@aberobison/what-my-starcraft-ii-bot-taught-me-about-contract-drift-9e3b368152cf),
a postmortem on the day the evaluator logged a win as a crash, and
[A StarCraft II bot, now with more Jev](https://medium.com/@aberobison/my-starcraft-ii-bot-now-with-more-jev-5581c1ff03d2),
on a second player in the same repo whose local decision graph issues every
command while a hosted model makes a few strategic calls in real time.

The transferable lesson is that self-authored changes need tests, repeated
validation, and a record of how promotion decisions were made. These checks reduce
the risk of accepting a regression, but noisy match outcomes still require care.
That pattern of closed-loop learning, measured feedback, and transparent review is
what I take from Alpha4Gate into the applied-AI systems I want to build next.
