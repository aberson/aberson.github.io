---
title: measure-twice
blurb: "A local benchmarking toolkit that turns 'which model should do which job' from assertion into measurement: it sweeps benchmark suites across local models and Claude tiers through calibrated, fail-loud scoring. Every scorer ships a frozen good/garbage anchor pair — a permanent gate asserts score(good) > score(garbage) forever — and raw responses are stored verbatim, so re-scoring never burns another model call."
tech: ["Python", "uv", "mypy --strict", "Claude CLI"]
repo: "https://github.com/aberson/measure-twice"
order: 5
featured: false
# Demoted to a Utility-table row (Step 8): its card/description now flow from
# portfolio.json. Kept in the collection (body preserved) but rendered nowhere.
hidden: true
---
