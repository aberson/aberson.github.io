---
title: switchboard
blurb: "A zero-dependency Python core that routes the cheap judgment calls inside AI-agent pipelines — style lenses, overnight graders, judge fan-outs — to a warm local model, deferring to Claude on any of seven documented failure conditions so a broken config can never crash a skill. An audit of 38 agent skills found exactly seven local-safe judge slices, under one rule: the local model never sits on a merge or correctness gate."
tech: ["Python", "stdlib-only", "llama.cpp / llama-swap", "mypy --strict"]
order: 4
featured: false
# Demoted to a Utility-table row (Step 8): its card/description now flow from
# portfolio.json. Kept in the collection (body preserved) but rendered nowhere.
hidden: true
---
