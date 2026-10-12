# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:57.00 (57 s) · 24 kHz mono PCM. 4 scenes, 32 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:16.62 | Negation in the past: didn't = did not → the rule |
| S02 | 0:16.62 | 0:28.00 | Example: I didn't watch TV yesterday |
| S03 | 0:28.00 | 0:46.30 | Wrong vs right: didn't watched ✗ / didn't watch ✓ · didn't went ✗ / didn't go ✓ |
| S04 | 0:46.30 | 0:57.00 | Why? DID carries the past → the verb stays in its base form |

## S01 · Negation in the past: didn't = did not → the rule

**0:00.00 → 0:16.62** (16.6 s)

**Narration**

- `0:00.00–0:01.88` ‏هلّأ خلّينا ننتقل للنفي. ⚠️ "للنفي" inferred from context (topic = negation); ASR heard "لنا فيه", acoustically almost identical
- `0:02.55–0:06.07` ‏إذا بدّك تحكي إنّك ما عملت إشي بالماضي، منستخدم كلمة
- `0:06.28–0:06.86` *didn't*
- `0:07.26–0:08.02` ‏وهي اختصار
- `0:08.18–0:08.93` *did not*
- `0:09.59–0:10.75` ‏والقاعدة هون بسيطة:
- `0:11.30–0:11.94` ‏الفاعل، ⚠️ sentence-level pass heard "الفاعل", phrase-level pass "الفعل"; forced scoring prefers "الفاعل", which is also what the rule needs (subject comes first)
- `0:12.25–0:13.11` ‏بعده — *didn't*
- `0:13.37–0:15.05` ‏وبعده الفعل بصيغته الأصلية.
- `0:15.93–0:16.44` ‏مثلاً:

| | |
|---|---|
| Educational concept | To say you did NOT do something in the past, use DIDN'T (short for DID NOT). Rule: subject + didn't + verb in its base form. |
| Visual situation | Cream page. Top: Arabic heading "النفي" with a small clock whose hands run backwards (= the past). The boy stands at the left shaking his head "no". Big DIDN'T is written in the middle (N'T in red = negation), then "= DID NOT" beneath it with a curved arrow. Bottom: three formula boxes [الفاعل] + [DIDN'T] + [الفعل بصيغته الأصلية], filled one by one as each part is named. |
| Characters & objects | Boy (= "I", reused in every scene). Props: clock (spin backwards), three formula boxes (beige / red / green outline). |
| Drawing sequence | 1) Arabic heading النفي (0.2–1.8) · 2) boy, head → body → arms (2.6–4.4) · 3) clock with backward spin (4.5–5.9) · 4) DIDN'T, N'T in red (6.2–7.0) · 5) arrow + "= DID NOT" (8.1–9.1) · 6) label القاعدة (9.6–10.7) · 7) box 1 + الفاعل (11.3–12.0) · 8) plus, box 2 + DIDN'T (12.2–13.2) · 9) plus, box 3 + الفعل بصيغته الأصلية in green (13.4–15.1) |
| Hand movement | Writes the heading right→left, draws the boy, circles the clock face, writes DIDN'T as it is spoken, then travels down to the formula row box by box. Leaves the frame on "مثلاً" (15.9) as the pan begins. |
| Character animation | Boy: rest → "no" (head shake) at 3.5 on "ما عملت إشي"; point toward DIDN'T at 6.5. Clock hands spin backwards 4.6–5.9. "think" pose on "القاعدة هون بسيطة" (9.6), small smile as the third box closes (15.0). |
| English text | DIDN'T · = DID NOT |
| Arabic text | النفي · القاعدة · الفاعل · الفعل بصيغته الأصلية |
| Camera | Static full page; gentle push-in (≤1.05 on 9:16) on the formula row from 11.2 to 15.0, back home by 16.0. |
| Transition | Opening scene: the page is blank at 0.0 and the hand enters with the first word. |
| Synchronization | "ننتقل للنفي" 0.00–1.88 → heading · "ما عملت إشي بالماضي" 2.55–6.07 → boy shakes head + clock · "didn't" 6.28 → DIDN'T · "did not" 8.18–8.93 → "= DID NOT" · "القاعدة" 9.59 → label · "الفاعل" 11.30 → box 1 · "بعده didn't" 12.25 → box 2 · "الفعل بصيغته الأصلية" 13.37–15.05 → box 3 · "مثلاً" 15.93 → hand out. |
| Review note | "للنفي" (0.0 s) and "الفاعل" (11.3 s) are inferred from context; see transcript flags. |

## S02 · Example: I didn't watch TV yesterday

**0:16.62 → 0:28.00** (11.4 s)

**Narration**

- `0:16.82–0:19.49` *I didn't watch TV yesterday.*
- `0:20.29–0:22.83` ‏يعني ما حضرت تلفزيون مبارح.
- `0:23.66–0:25.06` ‏انتبه منيح: بعد ⚠️ "انتبه منيح" (pay close attention) inferred; ASR heard "انت بهم نيح" / "انت بهم نير"
- `0:25.23–0:25.94` *didn't*
- `0:26.20–0:27.49` ‏الفعل برجع لأصله.

| | |
|---|---|
| Educational concept | Show the meaning first: the boy did not watch TV yesterday. Then the key point: after didn't, the verb goes back to its base form (WATCH, not a past form). |
| Visual situation | New page to the right. A calendar with "yesterday" cell ringed, a TV that is switched off with a red ✗ over the screen, the boy beside it with arms crossed / shaking head. Sentence written across the top as spoken: I DIDN'T WATCH TV YESTERDAY. (DIDN'T red, WATCH green). Arabic meaning beneath: ما حضرت تلفزيون مبارح. Then DIDN'T is ringed, an arrow runs from DIDN'T to WATCH, and the Arabic note "الفعل برجع لأصله" is written by the arrow. |
| Characters & objects | Boy (same). Props: tv({on:false}) with red cross, calendar (one cell ringed for "yesterday"). |
| Drawing sequence | 1) sentence I DIDN'T WATCH TV YESTERDAY. (16.7–19.8) · 2) TV outline + red ✗ (19.8–20.3, finished during the pause) · 3) calendar + ring on yesterday cell (20.3–21.6) · 4) Arabic ما حضرت تلفزيون مبارح (21.6–22.9) · 5) "!" next to the boy + ring around DIDN'T (23.6–25.2) · 6) underline DIDN'T (25.2–25.9) · 7) arrow DIDN'T→WATCH + green ring on WATCH + Arabic الفعل برجع لأصله (26.2–27.5) |
| Hand movement | Writes the English sentence word by word with the voice, sketches TV and calendar in the pause, writes the Arabic line right→left, then circles / underlines / draws the arrow exactly on "انتبه منيح… بعد didn't… برجع لأصله". |
| Character animation | Boy is redrawn on this page in a relaxed pose next to the TV (head → body, 19.9–21.2, right after the TV outline); "no" head shake on "ما حضرت" (21.0); pointUp on "انتبه منيح" (23.7); smile when WATCH is ringed green (26.8). |
| English text | I DIDN'T WATCH TV YESTERDAY. |
| Arabic text | ما حضرت تلفزيون مبارح · انتبه! · الفعل برجع لأصله |
| Camera | Pan right from S01 (1.0 s). Short close-up zoom on DIDN'T → WATCH from 25.1 to 27.3 (zoom 1.15 on 16:9, ≤1.05 on 9:16), back to home at 27.6. |
| Transition | Pan right (move: right) starting 16.0 on "مثلاً", landing at 17.0 just as "I didn't" is written. |
| Synchronization | "I didn't" 16.82–17.86 · "watch TV yesterday" 18.02–19.49 → sentence · pause 19.49–20.29 → TV ✗ · "ما حضرت تلفزيون مبارح" 20.29–22.83 → calendar + Arabic line · "انتبه منيح" 23.66–24.54 → "!" + ring · "بعد didn't" 24.71–25.94 → underline · "الفعل برجع لأصله" 26.20–27.49 → arrow + green ring on WATCH. |
| Review note | "انتبه منيح" (23.7 s) is inferred from context. |

## S03 · Wrong vs right: didn't watched ✗ / didn't watch ✓ · didn't went ✗ / didn't go ✓

**0:28.00 → 0:46.30** (18.3 s)

**Narration**

- `0:28.23–0:29.25` ‏يعني ما نحكي
- `0:29.50–0:31.73` *I didn't watched TV* ⚠️ INFERRED wrong form. Whisper writes "I didn't watch TV" here, but the narration calls this sentence wrong ("لأنه هذا خطأ") and then gives "I didn't watch TV" as the correct one. Forced scoring: watch beats watched by only 2.7 here vs 8.1 on the correct repeat (34.66 s) and 7.2 on 16.82 s, consistent with an audible -ed that the model autocorrects. Please confirm by listening.
- `0:32.41–0:33.18` ‏لأنّه هذا خطأ.
- `0:33.72–0:34.52` ‏الصحيح:
- `0:34.66–0:36.65` *I didn't watch TV.*
- `0:37.43–0:39.32` ‏ونفس الإشي مع الأفعال غير المنتظمة.
- `0:39.88–0:40.38` ‏منحكي:
- `0:40.60–0:42.63` *She didn't go to school.*
- `0:43.27–0:43.64` ‏مش
- `0:43.85–0:45.87` *she didn't went to school.*

| | |
|---|---|
| Educational concept | Contrast the mistake with the correct form, first for a regular verb (watch) then for an irregular verb (go/went): after didn't never use the past form. |
| Visual situation | New page below. Top half: I DIDN'T WATCHED TV with -ED in red, struck through in red with a big red ✗ and the Arabic "هذا خطأ"; beneath it "الصحيح:" and I DIDN'T WATCH TV. with WATCH green and a green ✓. Middle: Arabic label "الأفعال غير المنتظمة". Lower half: the girl at home next to a small school drawing that has a red ✗ on its path; SHE DIDN'T GO TO SCHOOL. written with GO green and ✓; then "مش" and SHE DIDN'T WENT TO SCHOOL. with WENT red, struck through and ✗. The boy appears only as a small head-shake in the corner for "ما نحكي". |
| Characters & objects | Boy (small, corner, "no"), girl (= "she", first appearance). Props: school, red strike lines, ✗ and ✓ marks. |
| Drawing sequence | 1) boy small at corner, "no" (28.2–29.3) · 2) I DIDN'T WATCHED TV, -ED red (29.4–31.8) · 3) red strike + ✗ + Arabic هذا خطأ (32.4–33.3) · 4) Arabic الصحيح: (33.7–34.5) · 5) I DIDN'T WATCH TV. green WATCH + ✓ (34.6–36.8) · 6) Arabic label الأفعال غير المنتظمة (37.4–39.3) · 7) girl head → body (39.3–40.6) · 8) SHE DIDN'T GO TO SCHOOL., GO green + ✓, school + ✗ on its path drawn in the 42.6–43.3 gap · 9) Arabic مش (43.3–43.6) · 10) SHE DIDN'T WENT TO SCHOOL., WENT red (43.8–45.9) · 11) red strike + ✗ (45.9–46.3), left on screen until the camera leaves at 46.8 |
| Hand movement | Writes each sentence while it is spoken; the strike-through and ✗ land on "هذا خطأ" (32.41) and right after "to school" (45.87); ✓ marks on the correct sentences. The hand never draws the two sentences of a pair simultaneously. |
| Character animation | Boy: "no" on "ما نحكي" (28.5), nod/smile on "الصحيح" (33.9). Girl: drawn on "منحكي" (39.9), shakes head "no" at 41.0 (she didn't go), frown at 44.5 when the wrong sentence is written, then smile when it is struck out. |
| English text | I DIDN'T WATCHED TV (struck out, ✗ — marked wrong by the narration) · I DIDN'T WATCH TV. · SHE DIDN'T GO TO SCHOOL. · SHE DIDN'T WENT TO SCHOOL. (struck out, ✗ — marked wrong by the narration) |
| Arabic text | هذا خطأ · الصحيح · الأفعال غير المنتظمة · مش |
| Camera | Pan down to the new page (1.0 s). At 37.2 a slow camera move down the page (camTo) from the watch pair to the go/went area, so the 9:16 frame keeps text inside the safe zone; 16:9 lays the two pairs side by side (left: watch, right: go) and stays static. |
| Transition | Pan down (move: down) starting 27.6, landing 28.6 as "يعني ما نحكي" ends. |
| Synchronization | "يعني ما نحكي" 28.23–29.25 → boy "no" · "I didn't watched TV" 29.50–31.73 → wrong sentence · "لأنه هذا خطأ" 32.41–33.18 → strike + ✗ · "الصحيح" 33.72–34.52 → label · "I didn't watch TV" 34.66–36.65 → correct + ✓ · "ونفس الإشي مع الأفعال غير المنتظمة" 37.43–39.32 → label · "منحكي" 39.88–40.38 → girl · "She didn't go to school" 40.60–42.63 → sentence + ✓ · "مش" 43.27–43.64 · "she didn't went to school" 43.85–45.87 → wrong sentence, strike + ✗ in the pause after it. |
| Review note | IMPORTANT: the wrong form "I didn't watched TV" (29.5 s) is INFERRED. ASR wrote "watch" (autocorrection is typical); the narration's own context (says it is wrong, then gives "watch" as correct) and the forced-scoring gap point to "watched". If the speaker actually said "watch" both times, the audio contradicts itself and this pair should show only the correct sentence (no struck-out text). |

## S04 · Why? DID carries the past → the verb stays in its base form

**0:46.30 → 0:57.00** (10.7 s)

**Narration**

- `0:46.82–0:47.30` ‏ليش؟
- `0:47.46–0:48.24` ‏لأنّه كلمة
- `0:48.36–0:48.95` *did* ⚠️ confirmed "did" (not "didn't") by forced scoring: -2.1 vs -9.2
- `0:49.26–0:50.74` ‏هي اللي بتحمل معنى الماضي،
- `0:51.25–0:54.58` ‏وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية.
- `0:55.47–0:55.87` ‏ممتاز.
- `0:56.52–0:56.80` ‏هلّأ… ⚠️ last word of the clip, apparently the start of a next part cut off by the 57 s end; ASR "هلا" (could be "هلّأ" = now, or "هلا"); scores too close to decide

| | |
|---|---|
| Educational concept | The reason: the word DID already carries the past meaning, so the verb after it must be in its base form. Wrap-up: "ممتاز". |
| Visual situation | New page, reached by a diagonal zoom-out. A big "؟" (ليش؟) next to the boy thinking. Big DID is written, then the boy lifts it like a heavy box with a backwards clock and the Arabic "معنى الماضي" on it (DID carries the past). Below, recap row: DIDN'T + WATCH and DIDN'T + GO with the base verbs in green, under the Arabic "الفعل بصيغته الأصلية". Finally a green star and Arabic "ممتاز" while the boy cheers. |
| Characters & objects | Boy (thinks, then holds DID box, then cheers). Girl small beside the DIDN'T + GO line (reuse, waves). Props: box (holds DID), clock (spin backwards), star. |
| Drawing sequence | 1) (during the zoom-out) big "؟" + boy in think pose (47.4–48.0) · 2) box outline (48.0–48.3) · 3) DID inside the box (48.3–49.0) · 4) clock on the box, spinning backwards, + Arabic معنى الماضي (49.2–50.8) · 5) Arabic الفعل بصيغته الأصلية (51.2–52.4) · 6) DIDN'T + WATCH (52.4–53.5) · 7) DIDN'T + GO (53.5–54.6) · 8) star + Arabic ممتاز (55.4–56.0) |
| Hand movement | Is out of frame during the zoom-out on "ليش؟", draws "؟" as the camera lands, writes DID exactly on "did" (48.36), circles the clock while "معنى الماضي" is spoken, writes the recap row on the rule sentence, draws the star on "ممتاز" and leaves the frame at 56.2 (the clip ends mid-word "هلأ…"), so the last 0.8 s is a clean held frame. |
| Character animation | Boy: think (47.6) → hold / lift the DID box (49.3, slight dy bounce like carrying weight) → cheer + grin on "ممتاز" (55.5). Girl: wave at 55.6. Clock hands spin backwards 49.3–50.8. |
| English text | DID · DIDN'T + WATCH · DIDN'T + GO |
| Arabic text | ليش؟ · معنى الماضي · الفعل بصيغته الأصلية · ممتاز |
| Camera | Diagonal zoom-out transition, then a close-up zoom on DID (48.3–50.8, ≤1.05 on 9:16, 1.2 on 16:9), back home at 51.2 for the recap row; static to the end. |
| Transition | Diagonal zoom-out (move: diag, panDur 1.0, panAt 46.82) exactly on "ليش؟" — the zoom-out itself is the question beat; the struck-out sentence from S03 stays visible ≈0.9 s before the move; lands at 47.8. |
| Synchronization | "ليش؟" 46.82–47.30 → zoom-out · "لأنه كلمة" 47.46–48.24 → "؟" + think + box · "did" 48.36–48.95 → DID · "هي اللي بتحمل معنى الماضي" 49.26–50.74 → boy lifts box + clock + label · "وعشان هيك الفعل اللي بعدها لازم يكون بصيغته الأصلية" 51.25–54.58 → recap row · "ممتاز" 55.47–55.87 → star + cheer · "هلأ…" 56.52–56.80 → hand already out, held frame. |
| Review note | The recording ends on "هلأ…" (56.5 s), which sounds like the start of a following part cut off by the clip end. The video will simply end on the cheering frame; tell us if there is more audio. |

