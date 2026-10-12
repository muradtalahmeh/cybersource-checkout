# Storyboard — ref-fitness

Duration 60.443s · 15 scenes · 30 fps

- Times in seconds, measured from the source audio (sentence spans) and the source's burned-in captions (word times, ±0.25 s).
- Every on-screen word exists in the audio. Numbered badges (1/2/3) count the 'تحديات' the speaker lists; they add no words.
- The source carries burned-in single-word captions at 72–75 % of its height; they remain visible inside the presenter frame. New text sits outside that zone.
- Source jump cuts at 26.71 s, 40.71 s and 52.42 s are used as scene boundaries so no new cut is introduced.
- No SFX assets are available in this environment; every sfx field is a cue for later, not an applied sound. The original audio stream is copied unchanged.

| # | Start | End | Mode | Spoken words | Presenter | On-screen text (t0–t1, slot, font, color, anim) | Asset | In / Out | SFX cue | Review |
|---|---|---|---|---|---|---|---|---|---|---|
| SC01 | 0.00 | 4.70 | A | مشوار الرشاقة والعناية بالجسم مشوار طويل وملان تحديات | full | «مشوار طويل» 2.3–3.3 · kinetic · kinetic 132/800 · #FFFFFF · fade-up<br>«ملان تحديات» 3.3–4.7 · kinetic · kinetic 132/800 · #10B981 · punch | none | fade from #10252A, 0.35 s / none (continuous presenter) | soft pop at 3.3 (cue only, no asset) | Source's own black title box is visible 0–2.5 s inside the frame; accepted. |
| SC02 | 4.70 | 7.40 | A | بس ما عمري حكيت لك إنه سهل (+ 'إنك تلاقي حالك' begins at 6.6) | full | «إنه سهل» 6.15–7.4 · kinetic · kinetic 132/800 · #FFFFFF · fade-up + strike-through (burgundy line draws 6.6→6.95) | none | none / text fades 0.18 s | none | Strike-through conveys the spoken negation 'ما عمري حكيت لك'; no extra words added. |
| SC03 | 7.40 | 11.90 | D | إنك تلاقي حالك ميتة تعب وتقاومي حالك عشان تلعبي تمارين بالبيت، صعب | full | «1» 7.4–11.9 · badge · badge 40/800 · #1A1A1A on #F59E0B · pop<br>«ميتة تعب» 7.7–9.5 · kinetic · kinetic 132/800 · #FFFFFF · punch<br>«تمارين بالبيت» 9.7–10.9 · kinetic · kinetic 120/800 · #10B981 · slide-right<br>«صعب» 10.9–11.9 · kinetic · kinetic 150/800 · #06B6D4 · punch + glow + echo | none | badge pop 0.25 s / badge swaps to 2 | tactile click at 7.4; soft pop at 10.9 (cues) | Word timing here is from ASR timestamps (captions hidden by hand 6.75–11.25 s): ±0.3 s. |
| SC04 | 11.90 | 14.00 | D | وإنك تقاومي قعدة السهرة وتنامي بدري | full | «2» 11.9–14 · badge · badge 40/800 · #1A1A1A on #F59E0B · pop<br>«قعدة السهرة» 12.2–13 · kinetic · kinetic 132/800 · #FFFFFF · punch<br>«تنامي بدري» 13–14 · kinetic · kinetic 132/800 · #10B981 · slide-right | none | none / none | tactile click at 11.9 (cue) |  |
| SC05 | 14.00 | 15.00 | D | برضه صعب | full | «2» 14–15 · badge · badge 40/800 · #1A1A1A on #F59E0B · <br>«صعب» 14.4–15 · kinetic · kinetic 150/800 · #06B6D4 · punch + glow + echo | none | none / presenter morphs to PiP over 15.0–15.5 | soft pop at 14.4 (cue) |  |
| SC06 | 15.00 | 21.00 | B+C | وإنك تختاري الأكل الصحي وتسيبي الأكل الغير صحي نهاية الأسبوع. برضه صعب | pip | «3» 15–21 · badge · badge 40/800 · #1A1A1A on #F59E0B · pop<br>«الأكل الصحي» 15.75–21 · tileA-title · cardTitle 84/800 · #1A1A1A · fade-up<br>«الأكل الغير صحي» 17.5–21 · tileB-title · cardTitle 72/800 · #800020 · fade-up<br>«نهاية الأسبوع» 18.75–21 · tileB-sub · cardText 52/700 · #1A1A1A · fade<br>«صعب» 20.25–21 · stamp · kinetic 150/800 · #800020 · stamp (scale 1.6→1, 0.2 s) | svg-generated: assets/svg/apple.svg (tile A, teal) + assets/svg/burger.svg (tile B, burgundy) | card slides up + fades 0.42 s; presenter morphs full→PiP 0.5 s / card fades/slides down 0.4 s; presenter morphs PiP→full | paper slide at 15.0; soft pop 20.25 (cues) | The icons are simple geometric SVGs, not photos. The card has one idea (healthy vs. unhealthy). |
| SC07 | 21.00 | 23.98 | A | بس تعالي أقول لك اللي أصعب من هذا بكثير | full | «أصعب بكثير» 22.3–23.98 · kinetic · kinetic 140/800 · #10B981 · punch + glow + tracking-in | none | presenter morph PiP→full 21.0–21.5 / hard cut at 23.98 (text out) | subtle whoosh at 21.0 (cue) |  |
| SC08 | 23.98 | 26.73 | D | إنه ينقطع نفسك من أقل طلعة درج | full | «ينقطع نفسك» 24.4–25.6 · kinetic · kinetic 132/800 · #FFFFFF · punch<br>«طلعة درج» 25.9–26.73 · kinetic · kinetic 132/800 · #06B6D4 · slide-right | svg-generated: assets/svg/stairs.svg, 160 px, cyan stroke, appears 25.9 | none / hard cut on the source's own jump cut at 26.71 | none |  |
| SC09 | 26.73 | 31.00 | A | إنك تختفي من الصور وتتجنبيها لأنك ما بتحبي الصور | full | «تختفي من الصور» 27–28.7 · kinetic · kinetic 120/800 · #FFFFFF · slide-right<br>«ما بتحبي الصور» 29.7–31 · kinetic · kinetic 120/800 · #06B6D4 · fade-up | none | hard cut (source jump cut) / presenter morphs to PiP 31.0–31.5 | none | 'وتتجنبيها' timing from ASR (caption hidden). |
| SC10 | 31.00 | 40.73 | B+C | وإنه تنحرمي لعب أولادك بالحديقة لأنك مش قادرة تلحقي وراهم. وإنه يجي الصيف وتضلك تشيلي هم اللبس وتدوري على أشياء تخبي جسمك | pip | «أصعب بكثير» 31–40.73 · card-title · cardTitle 84/800 · #800020 · fade-up<br>«لعب أولادك بالحديقة» 31.75–40.73 · item · cardText 56/700 · #1A1A1A · slide-in from right + check mark<br>«الصيف واللبس» 36.25–40.73 · item · cardText 56/700 · #1A1A1A · slide-in from right<br>«تخبي جسمك» 39.75–40.73 · item · cardText 56/700 · #1A1A1A · slide-in from right | svg-generated: assets/svg/park.svg, sun-shirt.svg, hide.svg — 96 px item icons, teal stroke | card slides up 0.42 s; presenter full→PiP / card slides left and is replaced by SC11 card (0.4 s) on the source jump cut 40.71 | paper slide 31.0; tactile click per item (cues) | Card title 'أصعب بكثير' is the speaker's exact phrase (22.25 s). Items are compressed to words he says. |
| SC11 | 40.73 | 46.75 | B+C | التعب الأولاني مؤقت وبصير أسهل مع الوقت. بس الثاني بضل ملاحقك سنين | pip | «التعب الأولاني» 40.75–46.75 · colA-title · cardTitle 72/800 · #1A1A1A · fade-up<br>«مؤقت» 42–46.75 · colA-value · kinetic 120/800 · #2DD4BF · punch<br>«أسهل مع الوقت» 43.25–46.75 · colA-note · cardText 48/700 · #1A1A1A · fade<br>«الثاني» 45–46.75 · colB-title · cardTitle 72/800 · #1A1A1A · fade-up<br>«ملاحقك سنين» 45.6–46.75 · colB-value · kinetic 110/800 · #800020 · punch | svg-generated: assets/svg/clock.svg (col A) + calendar-years.svg (col B) | card replaces previous card (slide 0.4 s) on source jump cut / card slides down; presenter PiP→full 46.75–47.25 | paper slide 40.73 (cue) | 'ملاحقك' spelling approved by user. |
| SC12 | 46.75 | 50.08 | A | اختاري صح، وانت بتختاري أي صعب | full | «اختاري صح» 46.8–48.6 · kinetic · kinetic 140/800 · #10B981 · punch + underline draw<br>«أي صعب» 49.2–50.08 · kinetic · kinetic 140/800 · #06B6D4 · punch | none | presenter morph PiP→full / none | soft chime at 46.8 (cue) |  |
| SC13 | 50.08 | 52.42 | A | بدك إياه عشان تعيشي معه | full | «تعيشي معه» 51.2–52.42 · kinetic · kinetic 120/800 · #FFFFFF · fade-up | none | none / hard cut on source jump cut 52.42 | none | ASR weak here; wording from the burned-in captions (approved). |
| SC14 | 52.42 | 59.99 | E | بكلمة «يوتيوب» رح يوصلك فيديو مجاني بيشرح لك كيف تلعب رياضة من بيتك حتى لو انت مشغولة 24 ساعة | full | «يوتيوب» 53.2–59.99 · cta-badge · badge 56/800 · #1A1A1A on #F59E0B · pop + gentle float<br>«فيديو مجاني» 54.2–56.4 · kinetic-low · kinetic 120/800 · #10B981 · punch + glow<br>«من بيتك» 56.5–58.4 · kinetic-low · kinetic 120/800 · #FFFFFF · slide-right<br>«24 ساعة» 58.45–59.99 · kinetic-low · kinetic 140/800 · #06B6D4 · punch + glow | svg-generated: assets/svg/comment.svg bubble behind the يوتيوب badge (no platform logo) | hard cut (source jump cut) / badge stays to the end | gentle riser 52.42; soft chime 58.45 (cues) | No platform logo is used; the bubble icon + the spoken word only. No claims beyond the audio. |
| SC15 | 59.99 | 60.44 | A | (no speech — breath/laugh; thumbs-up + wink) | full | — | none | none / fade to #10252A over the final 0.3 s | none | No CTA added beyond what the audio says. |

## Per-scene details

### SC01 (0–4.7) — Hook: establish the journey framing and the word 'تحديات' that structures the next 15 s.
- Framing: Full presenter frame 964x1440 at (58,96); source scaled 1.339x, top 5.2 % cropped (ceiling only), bottom ~10 % cropped (table edge). Face stays at frame y≈110–420.
- Audio overlap: original speech continuous
- Safe area: text at y 1560–1890, margin 54; clear of face and of burned-in caption (frame y≈1144–1195).

### SC02 (4.7–7.4) — Negation beat: 'never said it was easy' shown as the phrase being struck through.
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC03 (7.4–11.9) — Challenge 1 (home workouts while exhausted). Badge 1 + two keyword bursts + 'صعب' stamp.
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC04 (11.9–14) — Challenge 2 (sleep early instead of late nights).
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC05 (14–15) — Repeat motif: the 'صعب' stamp returns identically (rhythm).
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC06 (15–21) — Challenge 3 as an editorial comparison card: healthy food vs. unhealthy weekend food; presenter in PiP; 'صعب' stamp lands on the card.
- Framing: PiP 336x448 at (690,1380), source cropped to head/shoulders (crop scale 1.9, top 4 %).
- Audio overlap: speech continuous under card
- Safe area: card x 54–1026, y 150–1330; PiP bottom-right; nothing over the face in PiP.

### SC07 (21–23.98) — Pivot to the real cost: presenter back full-frame, one strong keyword.
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC08 (23.98–26.73) — First consequence with a small illustration (stairs).
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC09 (26.73–31) — Second consequence (photos). Presenter is expressive here; keep him full.
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC10 (31–40.73) — Editorial list card 'الأصعب': three consequences appear as they are spoken; presenter in PiP.
- Framing: PiP as SC06
- Audio overlap: continuous
- Safe area: card y 150–1330, PiP bottom-right

### SC11 (40.73–46.75) — Comparison card: first fatigue (temporary) vs. second (chases you for years).
- Framing: PiP as SC06
- Audio overlap: continuous
- Safe area: ok

### SC12 (46.75–50.08) — The decision line; presenter full, two keyword bursts.
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC13 (50.08–52.42) — Quiet beat before the CTA.
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: ok

### SC14 (52.42–59.99) — CTA that exists in the audio: comment keyword → free video. Presenter full; CTA elements in the kinetic zone.
- Framing: same as SC01
- Audio overlap: continuous
- Safe area: CTA elements y 1560–1890

### SC15 (59.99–60.443) — Outro on the presenter's gesture; fade to dark on the last frames.
- Framing: same as SC01
- Audio overlap: audio tail kept (no speech)
- Safe area: ok

## Check results

- ✅ coverage contiguous, all text windows inside scenes, all on-screen words present in the transcript, all assets exist
