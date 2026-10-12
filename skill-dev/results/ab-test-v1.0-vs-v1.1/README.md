# A/B experiment — skill v1.0 vs v1.1 (storyboard phase)

**Question:** does splitting the general workflow from the language-lesson guidance (v1.1, commit ba6bbd7) change how well the model produces a correct, audio-aligned teaching storyboard compared with v1.0 (commit a611ae6, the installed skill)?

**Outcome (2026-10-12):** not decided. No sign that the moved language-lesson rules were applied worse — they were applied in every run of both versions. But one v1.1 run made the only major error of the experiment (it dropped a spoken English example), in a rule that is identical in both versions. Two runs per version cannot tell whether that is chance. **Decision by the user: keep using v1.0 in production; keep v1.1 for later development.**

## Setup
- Skills: `kit-m` = v1.0, `kit-q` = v1.1, both copied without `references/example-past-simple/` (it contains this very lesson; reading it would make both versions look equally good). Only difference between the copies: `SKILL.md` + `references/domains/`. File hashes: `MANIFEST.sha256`.
- Inputs (`inputs.txt`): clip A = narration 320.4–377.4 s (cut by mistake — an ffmpeg double seek — but identical for all runs of round A); clip B = 160.2–217.2 s (the intended clip, position verified by cross-correlation).
- 8 independent runs (`ASSIGNMENT.txt`): 2 per version per clip, same model, identical prompt except skill path / work folder / clip, neutral folder names, random assignment. Phases 1–3 only (inspect → transcribe → storyboard).
- Isolation audited from the agents' tool-call logs: no access to `/home/user`, to the example, or to other runs.
- Evaluation: automated version-blind checks (`eval/eval_auto.py`, results `eval/r*.auto.json`) against reviewed reference transcripts (`eval/reference_A.json`, `eval/reference_B.json`), plus a blind grader agent on anonymised copies (version-revealing comment lines removed; mapping in `eval/blind_key.json`; rules sheet `eval/blind_rules.md`).

## Results
| clip | run | version | blind | total /40 | notes |
|---|---|---|---|---|---|
| A | r2 | v1.0 | P | 36 | rank 1 |
| A | r3 | v1.0 | Q | 35 | rank 2; completed a cut-off word on screen (minor) |
| A | r1 | v1.1 | R | 33 | rank 3; extra "kids" cast, contrast with other verbs not shown (minor) |
| A | r4 | v1.1 | S | 29 | rank 4; **missed "Did you play football?" (45.54–46.64 s) and told the user the narration has no did-question** |
| B | r6 | v1.1 | W | 38 | rank 1= |
| B | r7 | v1.1 | X | 37 | rank 1= |
| B | r5 | v1.0 | Z | 34 | rank 3; wrote inferred word "انتبه!" on screen (minor) |
| B | r8 | v1.0 | Y | 32 | rank 4; text before it is spoken, undrawn character (minor) |

Means: clip A — v1.0 35.5, v1.1 31.0; clip B — v1.0 33.0, v1.1 37.5 (direction reverses between clips).

Automated: every run covers the whole clip; English examples recovered 10/10 (v1.0) vs 9/10 (v1.1) on clip A and 10/10 vs 10/10 on clip B; on clip B all 4 runs flagged the inferred wrong form "I didn't watched TV" and marked both wrong forms on screen (red strike + ✗). Both v1.1 runs per clip read `references/domains/education-language.md` and stated the domain.

## Limitations
- n = 2 per version per clip; the grader's ranking confidence was low–moderate except for the last place in round A.
- Phases 4–5 (scene code, rendering) not exercised behaviourally (the Phase 1 regression showed code/output identical).
- The worked example was removed from both copies; its effect is not measured.
- The grader is a model, not a teacher.

## Leads for later development
- The r4 error comes from not re-decoding every mixed-language span in English. A general rule such as "when the narration mixes languages, re-decode every sentence span with `--lang en` and check the examples against the structure of the explanation (affirmative / negative / question)" would have prevented it; the best runs did exactly that. Needs its own test.
- Before adopting v1.1: either more replicates on clip A, or add the rule above and re-run this experiment (harness and inputs are reproducible from this folder and `skill-dev/regression/`).
