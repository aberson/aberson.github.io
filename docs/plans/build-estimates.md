# Remaining-work estimates

Forward remaining effort in hours, including implementation and its checks/review. Operator attention is separate. Elapsed waits, service quotas and hardware availability are not labor. These are model forecasts, not measured history. Held rows remain disabled.

Rows validate as ForecastEstimate. Portable worksheet only: production ForecastConfig is currently restricted to dev-observatory and 100 estimates; no saved forecast was modified.

Plan: [master_plan.md](master_plan.md). SHA-256: `02e57b7e3b07b1f5f59daba09d4afc744fade6fcc59de6e319b4e2b666664b31`.

Rebind after editing the plan; source fingerprints deliberately become stale. The JSON preserves dependencies and evidence locations.

| Step | Worker hours | Attention hours | Confidence | Availability | Basis |
|---|---:|---:|---:|---|---|
| M2 — Account-security checklist | 0.1–0.5 | 0.25–1.0 | 0.6 | enabled forecast | Operator settings and private history review; remediation scope, if found, is separately planned. |
| M3 — Optional domain and analytics selection / acceptance | 0.1–0.5 | 0.5–2.0 | 0.3 | HELD: Optional scope not selected. | Optional registrar/DNS/security/analytics selection and acceptance; external propagation waits excluded. |
| M3A — Optional domain / analytics site configuration | 1.0–4.0 | 0.25–0.75 | 0.4 | HELD: Optional scope not selected. | Optional site URL/CNAME, chosen analytics and build/preview/deployment verification; no backend expansion. |
| M4 — Human visual acceptance of the refresh | 0.1–0.5 | 0.5–1.5 | 0.65 | enabled forecast | Attended dual-theme/mobile visual and narrative acceptance across all five groups and linked pages. |
