Three commitments drive every decision below:
1. **The audio is the master clock and is never altered.** No re-voicing, trimming or rewriting. Every visual time comes from measured timestamps.
2. **Never claim what you have not verified.** If you could not transcribe, don't invent a transcript; if you inferred a word, flag it; if you didn't render, don't say "exported".
3. **Real drawing, not fades.** Lines are revealed along their path and the pen tip sits on the point being drawn, using the same progress value.
Design rules that make it teach:
- **Show the meaning, then the rule.** Characters do the example (kicks the ball for "I played football", a crossed-out TV for "I didn't watch TV", yawning for "I was tired") and the sentence is written as it is spoken.
- Reuse the same characters throughout (boy = "I/you/he", girl = "she", grandma, …) so it is one story.
- Grammar is shown visually: formula boxes, a green ending (PLAY→PLAY**ED**), red strike-through plus ✗ for wrong forms the narration calls wrong, green ✓ for the correction, arrows connecting a rule to the example.
- Write only text that is in the narration. Short labels (NOW, PAST) are fine when they genuinely help. Never invent examples, and never put a grammatically wrong form on screen unless the narration presents it as wrong.
- Vary transitions: pan right, pan down, diagonal zoom-out, wipe-erase in place, close-up zoom on a word.
- Pauses are for finishing drawings, reactions (cheer, frown), and letting the viewer think (quiz: the hand leaves the frame).
1. **English (or other second-language) examples.** When forced to the narration language, Whisper *translates* embedded English sentences into it. Typical signs are an odd Arabic phrase where an example should be, or "مثلاً" followed by nonsense. Re-decode those spans with `--lang en` (write them as a JSON list of `[s,e]`).
2. **Repetition loops / garbage** (`LOOP` in the output): re-decode just that span at phrase level (`--key phrases` subset) or with the other language.
3. **Exact moments** (when "played" is said, when the answer starts): use the `phrases` regions from `spans.json`.
4. **Deliberately wrong examples** ("I didn't watched TV", "I goed"). Whisper's language model tends to autocorrect them. Use `score_candidates.py` to compare candidates, use the narration's context ("هذا خطأ"), and flag the inference for the user.
5. **Review the text yourself**, correcting dialect and ASR errors from context. Write `js/transcript.js` as `{s, e, ar?, en?, flag?}` entries. Timestamps stay measured; only wording is corrected.
6. **Check the content.** Read the explanation as a teacher. If the narration teaches something incorrect, flag it for the user and don't illustrate a contradiction. Never "fix" the audio.
5. Check the English: extract every on-screen English string and confirm spelling and correctness. The only wrong forms allowed are the narration's marked mistakes.
Map the narration into scenes of roughly 10–30 s, cut at idea boundaries that fall on real pauses. Scenes must be contiguous from 0 to the audio's end. Fill every field (concept, visual, characters, drawing order, hand, animation, English text, Arabic text, camera, transition, sync, review). Then run `node tools/storyboard.mjs`: it checks coverage and writes `docs/STORYBOARD.md` with the exact narration per scene. Show the user the scene table.
