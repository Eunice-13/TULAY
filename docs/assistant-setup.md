# Shared assistant instructions

Open the extracted tulay/ directory as the project root. Commit both skill folders with the application so teammates receive the same TULAY scope. They are development instructions, not deployed website features.

## File responsibilities

- AGENTS.md: short repository-wide instructions and routing to the detailed project skill.
- .agents/skills/tulay-mvp/SKILL.md: canonical portable TULAY skill for Codex repository discovery.
- .kiro/skills/tulay-mvp/SKILL.md: identical skill copy for Kiro workspace discovery.
- docs/: team decisions, input templates, API contract and implementation checklist.

Codex scans repository .agents/skills directories. Kiro uses workspace .kiro/skills. Reload/reopen the project if a newly added skill does not appear. Verify discovery in each teammate's installed tool rather than assuming that this ZIP proves activation.

An explicit fallback prompt works even when discovery is uncertain:

> Read AGENTS.md and the project tulay-mvp SKILL.md before working. Follow the current mobile-first website scope, and report what is implemented versus a placeholder.

Project instructions do not grant credentials or establish Supabase/video MCP connections. Each teammate configures and authenticates required tools independently. Do not commit tokens, passwords, personal machine paths, or copied personal MCP configuration.

## Maintaining skills

The two skill files are deliberately full copies, not Windows symlinks, so ZIP extraction works without link support. When changing project scope, update the canonical .agents copy and mirror the same edit to .kiro. Compare hashes/content before sharing a new ZIP. Newer explicit team decisions override older skill guidance.

Third-party skills previously installed on Martin's machine are not included in this starter. Install only the relevant skills separately using verified sources; availability/cost/credentials are not inherited from SKILL.md.

References: [Codex skills](https://developers.openai.com/codex/skills), [Kiro skills](https://kiro.dev/docs/skills/).


