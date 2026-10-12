# Domain: language lessons (grammar, vocabulary, pronunciation)

Use this file when the narration teaches a language — typically an Arabic-speaking teacher explaining English grammar, vocabulary or pronunciation. It adds to the general workflow in `SKILL.md`; it does not replace any of it. The worked example for this domain is `references/example-past-simple/` (7 minutes, 20 scenes, both aspect ratios).

Signals that a recording belongs here: the narration explains a rule of a language, contrasts correct and incorrect forms, gives example sentences in the target language, translates them, or asks the viewer to say or translate something.

## Transcript checks (apply during Phase 2, before finalising `js/transcript.js`)

- **Deliberately wrong examples** ("I didn't watched TV", "I goed"). Whisper's language model tends to autocorrect them. Use `score_candidates.py` to compare candidates, use the narration's context ("هذا خطأ"), and flag the inference for the user.

## Storyboard design rules (apply during Phase 3)

Design rules that make it teach:
- **Show the meaning, then the rule.** Characters do the example (kicks the ball for "I played football", a crossed-out TV for "I didn't watch TV", yawning for "I was tired") and the sentence is written as it is spoken.
- Reuse the same characters throughout (boy = "I/you/he", girl = "she", grandma, …) so it is one story.
- Grammar is shown visually: formula boxes, a green ending (PLAY→PLAY**ED**), red strike-through plus ✗ for wrong forms the narration calls wrong, green ✓ for the correction, arrows connecting a rule to the example.
- Write only text that is in the narration. Short labels (NOW, PAST) are fine when they genuinely help. Never invent examples, and never put a grammatically wrong form on screen unless the narration presents it as wrong.
- Vary transitions: pan right, pan down, diagonal zoom-out, wipe-erase in place, close-up zoom on a word.
- Pauses are for finishing drawings, reactions (cheer, frown), and letting the viewer think (quiz: the hand leaves the frame).

## Build checks (apply during Phase 4)

- Check the English: extract every on-screen English string and confirm spelling and correctness. The only wrong forms allowed are the narration's marked mistakes.
