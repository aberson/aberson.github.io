---
title: toybox
blurb: "A local-first home AI: passive listening (VAD + Whisper) → intent detection → a branching activity engine → parent-approval UI → a kids' PWA with generated sprites and on-device TTS. Runs fully offline."
tech: ["Python/FastAPI", "React/TypeScript"]
repo: "https://github.com/aberson/toybox"
order: 2
featured: true
---

## Problem

I wanted a home AI my young kids could actually play with — one that listens,
understands, and responds with real activities — without shipping a single word
of what a child says to someone else's cloud. That constraint, **local-first and
private by default**, is what makes the project hard. It's easy to build a
charming voice assistant when you can lean on hosted speech, hosted language
models, and hosted image generation. It's a very different engineering problem to
run the _whole_ pipeline — listening, understanding, deciding, drawing, and
speaking — on hardware sitting in my own house.

Several problems stack up once you take that constraint seriously.

**The full speech-to-experience pipeline has to run offline.** That means
on-device voice activity detection and speech-to-text, on-device intent
detection, on-device image generation for the visuals a child sees, and on-device
text-to-speech for the voice they hear. Every one of those is a model with its own
latency, memory, and failure characteristics, and they have to compose into
something that feels responsive to a four-year-old.

**The output has to be safe and parent-controlled.** A system that improvises
activities for children cannot be a black box that acts on its own. A parent has
to be able to see and approve what it proposes before a child ever sees it.

**It has to degrade gracefully, not catastrophically.** Local models are heavy;
the first run has to fetch and cache them, but once cached the system has to keep
working fully locally even with no network at all. "Works only when the internet
is up" would defeat the entire premise.

And underneath all of it, this had to be a real, operable application — not a
demo. It's used daily by my own family, so "mostly works" isn't a passing grade.

## Approach

I built toybox as an end-to-end pipeline where each stage does one job and hands
off cleanly to the next, so that any single model can be swapped or can fail
without taking the whole system down.

### Listening and understanding, on device

The front of the pipeline is **passive listening**: silero-vad detects when
someone is actually speaking, so the system isn't transcribing silence, and
faster-whisper turns that speech into text locally. From there, **intent
detection** runs against an NLP registry of known intents first — the fast, fully
local, predictable path — and only escalates to a Claude call for the genuinely
ambiguous cases. That ordering is a deliberate cost-and-privacy decision: the
common case is handled on-device and instantly, and the cloud is a fallback for
the long tail, not the default.

### The activity engine

The heart of toybox is a **branching activity-template engine with over 1,300
templates**. Each template is persona-tagged and slot-filled with the real
context of the household — actual toys, rooms, and child profiles — so an activity
isn't generic filler but something grounded in what's physically in the room. I
chose a structured template engine over free-form generation on purpose: with
children, I want the space of possible outputs to be one I've authored and can
reason about, not whatever a model decides to say. The branching gives variety;
the templates keep it bounded and safe.

### Parent approval, then the kids' kiosk

Nothing reaches a child unreviewed. Proposed activities surface in a **parent-
approval UI** — a React/TypeScript surface where an adult vets what the system
wants to do. Approved activities flow to a **child-facing iPad PWA kiosk**, built
as an installable progressive web app so it runs full-screen and locked-down like
a native app. The kiosk is where the generative layer earns its keep: sprites are
generated with **Stable Diffusion 1.5 accelerated by an LCM-LoRA** (the LoRA is
what makes local image generation fast enough to feel interactive rather than a
loading screen), and the voice is **Coqui XTTS-v2** text-to-speech. Both run
locally.

### Degrading to fully local

The whole system is designed to **cache its models on first use and then run
fully offline**. Once the speech, image, and TTS models are on disk, pulling the
network cable changes nothing about the child's experience. That property is the
one I care about most, because it's the promise the project is built on.

### Holding it together at scale

The backend is Python 3.12 on FastAPI with a SQLite-WAL store — WAL mode because
several stages read and write concurrently and I needed writers not to block
readers. The frontends are React 18 + TypeScript on Vite. Models run through
faster-whisper, silero-vad, ONNX, Stable Diffusion, and Coqui XTTS-v2. Because
this is a real system my family depends on, I treated testing as non-negotiable:
the pipeline is covered by a large pytest suite on the Python side and a vitest
suite on the frontend, plus Playwright end-to-end tests that exercise the actual
approval-to-kiosk flow a person walks through.

I'll be exact about scope, since credibility matters more than hype: toybox is a
solo personal project. "Production-grade" here means engineering rigor — real
tests, typed code, an operable deployment — not a commercial product or outside
users. The one real-world claim I'll make, because it's true, is that it is **in
genuine daily use by my own family**.

## Outcome

Toybox is a working, operated system, not a prototype. Over roughly **478
commits** it grew to about **92,000 lines of code — 46K Python and 46K
TypeScript — across 25 shipped phases (A through Y)**, and it is in **real daily
family use**. The test suites reflect that it has to actually keep working:
**around 2,670 pytest tests and 802 vitest tests**, plus Playwright coverage of
the parent-approval-to-kiosk path.

The result is the thing I set out to prove is possible: a home AI that hears a
child, understands them, proposes something grounded and safe, waits for a
parent's yes, and then draws and speaks — entirely on hardware in the house, with
no dependence on anyone's cloud once its models are cached.

What toybox demonstrates, and the reason I lead with it, is that I can ship _and
operate_ applied AI at real scale across several hard modalities at once — speech,
vision, and language — wired into a live, full-stack, real-time application that a
demanding set of users (my kids) rely on every day. Making all of those pieces
compose reliably, privately, and gracefully under failure is the actual skill, and
it's the one I bring to the next system I build.
