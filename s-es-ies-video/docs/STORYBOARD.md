# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 9:28.72 (568.72 s) · 24 kHz mono PCM. 23 scenes, 111 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:13.43 | Hook: s, es or ies? |
| S02 | 0:13.43 | 0:28.23 | Stay to the end — the teacher |
| S03 | 0:28.23 | 0:53.34 | The most important rule |
| S04 | 0:53.34 | 1:16.67 | Basic rule: verb + s |
| S05 | 1:16.67 | 1:34.00 | play → plays … but not always |
| S06 | 1:34.00 | 2:06.47 | Case 1: verbs ending in ch |
| S07 | 2:06.47 | 2:30.56 | Case 2: verbs ending in sh |
| S08 | 2:30.56 | 2:52.08 | Case 3: verbs ending in x |
| S09 | 2:52.08 | 3:19.76 | Case 4: verbs ending in ss |
| S10 | 3:19.76 | 3:49.43 | Case 5: o → es (go, do) |
| S11 | 3:49.43 | 4:08.93 | But: photo → photos, radio → radios |
| S12 | 4:08.93 | 4:41.55 | Case 6: y — after a consonant |
| S13 | 4:41.55 | 5:01.02 | city → cities |
| S14 | 5:01.02 | 5:28.49 | y after a vowel: keep y, add s |
| S15 | 5:28.49 | 5:44.69 | plays, boy → boys |
| S16 | 5:44.69 | 6:15.46 | Y summary and the three endings |
| S17 | 6:15.46 | 6:55.87 | Note 1: he / she / it |
| S18 | 6:55.87 | 7:21.38 | I / you / we / they: no s |
| S19 | 7:21.38 | 7:47.06 | Note 2: why es? (easier to say) |
| S20 | 7:47.06 | 8:13.54 | Note 3: have → has |
| S21 | 8:13.54 | 8:38.08 | Summary 1: es endings and o |
| S22 | 8:38.08 | 9:03.82 | Summary 2: y and all other verbs |
| S23 | 9:03.82 | 9:28.72 | Remember he/she/it and have → has. Practise! |

## S01 · Hook: s, es or ies?

**0:00.00 → 0:13.43** (13.4 s)

**Narration**

- `0:00.00–0:01.32` ‏كم مرة احترت؟ ⚠️ Opening word inferred: «احترت» (−8.6) ≈ «احترتوا» (−8.5) ≈ «احترتي» (−13.0).
- `0:01.83–0:03.06` ‏إمتى منضيف S؟
- `0:03.47–0:05.04` ‏وإمتى منضيف ES؟
- `0:05.48–0:10.02` ‏وإمتى منحذف Y ومنضيف بداله IES؟ والأهم:
- `0:10.49–0:12.99` ‏كيف منعرف أي قاعدة نستخدم بدون ما نلخبط؟

| | |
|---|---|
| Educational concept | The viewer is often confused: when do we add s, when es, when do we drop y and add ies — and how do we choose without mixing them up? |
| Visual situation | The confused boy with question marks; the three endings appear one per question: “+ s ?”, “+ es ?”, “y → ies ?”; a tangled scribble for “نلخبط”. |
| Characters & objects | Boy (confused → thinking). |
| Drawing sequence | Boy → ? → + s ? → + es ? → y → ies ? → tangle. |
| Hand movement | Writes each ending exactly when it is asked. |
| Character animation | Boy scratches head (think) on “كم مرة احترت”, shrugs on “بدون ما نلخبط”. |
| English text | + s ? · + es ? · y → ies ? |
| Arabic text | كيف منعرف أي قاعدة؟ |
| Camera | Static, slight push-in. |
| Transition | Pan right to the teacher. |
| Synchronization | + s at 1.9 s, + es at 3.5 s, y → ies at 5.5–9 s, question 10.5–13 s. |

## S02 · Stay to the end — the teacher

**0:13.43 → 0:28.23** (14.8 s)

**Narration**

- `0:13.87–0:22.15` ‏خليكم معي لآخر الفيديو، لأني رح أبسّطلكم القواعد بأمثلة سهلة وواضحة، وتصيروا تميّزوا بينها بكل سهولة.
- `0:22.88–0:26.23` ‏معكم المعلمة مرام القيق من مركز آرام التعليمي. ⚠️ Names inferred by scoring: «مرام القيق» / «مركز آرام التعليمي» (−11.9 best of 6 candidates; spelling of the names not verifiable from audio).
- `0:26.67–0:27.90` ‏يلا نبلّش!

| | |
|---|---|
| Educational concept | Promise of simple, clear examples; the teacher introduces herself. |
| Visual situation | The girl (teacher) waves; a book opens with a light bulb (simple, clear examples); her name and centre written in Arabic. |
| Characters & objects | Girl (teacher, waves), boy (smiles). |
| Drawing sequence | Book → bulb → girl → name → centre. |
| Hand movement | Draws the book on “بأمثلة سهلة”, writes the name on “معكم المعلمة”. |
| Character animation | Girl waves on “معكم”, cheers on “يلا نبلّش”. |
| English text | — |
| Arabic text | أمثلة سهلة وواضحة · المعلمة مرام القيق · مركز آرام التعليمي |
| Camera | Static. |
| Transition | Pan down. |
| Synchronization | Name 22.9–26.2 s; cheer 26.7 s. |
| Review note | Teacher and centre names inferred by scoring — please confirm the spelling. No logo was attached, so none is drawn. |

## S03 · The most important rule

**0:28.23 → 0:53.34** (25.1 s)

**Narration**

- `0:28.57–0:37.45` ‏خلينا نبلّش بأهم قاعدة من قواعد اللغة الإنجليزية، واللي كتير طلاب بيتلخبطوا فيها، وهي: إمتى منضيف S
- `0:37.88–0:39.40` ‏أو إمتى منضيف ES
- `0:39.82–0:43.26` ‏وإمتى منحذف حرف Y ومنضيف بداله IES.
- `0:43.99–0:46.07` ‏إذا فهمنا هالقواعد بطريقة بسيطة،
- `0:46.47–0:53.03` ‏رح نقدر نكتب ونستخدم الأفعال بشكل صحيح وبدون ما نلخبط بينها. يلا نبلّش.

| | |
|---|---|
| Educational concept | Three possible endings: s, es, ies. Once understood, we write and use verbs correctly. |
| Visual situation | Title “s · es · ies”; three cards drawn one per mention; then the boy writes in a notebook and a green ✓. |
| Characters & objects | Boy (writes, smiles). |
| Drawing sequence | Title → card s → card es → card y→ies → notebook → ✓. |
| Hand movement | Draws each card as it is named (35.5, 38.0, 40.5 s). |
| Character animation | Boy holds the book and smiles on “بشكل صحيح”. |
| English text | s · es · y → ies |
| Arabic text | أهم قاعدة · بشكل صحيح |
| Camera | Static. |
| Transition | Pan right. |
| Synchronization | Cards 35.6 / 38.0 / 40.3 s; ✓ on “بشكل صحيح” ≈ 50 s. |

## S04 · Basic rule: verb + s

**0:53.34 → 1:16.67** (23.3 s)

**Narration**

- `0:53.65–0:55.83` ‏أولاً: القاعدة الأساسية.
- `0:56.57–1:00.19` ‏أول إشي لازم نعرف إنه في قاعدة أساسية وبسيطة جداً:
- `1:00.60–1:04.04` ‏مع معظم الأفعال العادية منضيف حرف S بس.
- `1:04.81–1:07.58` ‏مثلاً الفعل «يعمل» أو «يشتغل»: work. ⚠️ The narration names only “work” here (scored −5.0 vs −76 for a version ending in “works”).
- `1:08.47–1:11.42` ‏مثلاً الفعل run اللي معناه «يركض»،
- `1:11.85–1:16.33` ‏لما نستخدمه مع he بنضيف إله S فبصير runs.

| | |
|---|---|
| Educational concept | With most ordinary verbs we just add s: work; run → runs with he. |
| Visual situation | Heading “أولاً: القاعدة الأساسية”; formula box “verb + s”; “work” with “يعمل / يشتغل”; the boy runs and “run → runs” with a green s; “he” label. |
| Characters & objects | Boy (runs). |
| Drawing sequence | Heading → verb + s → work → run → he → runs. |
| Hand movement | Writes “run” on “run”, the green s on “runs”. |
| Character animation | Boy runs (alternating legs) during “run … يركض”. |
| English text | verb + s · work · run → runs · he |
| Arabic text | القاعدة الأساسية · يعمل / يشتغل · يركض |
| Camera | Static. |
| Transition | Wipe-erase in place. |
| Synchronization | work 64.8–67.6 s; run 68.5 s; runs 75.0 s. |

## S05 · play → plays … but not always

**1:16.67 → 1:34.00** (17.3 s)

**Narration**

- `1:17.01–1:23.99` ‏والفعل play اللي معناه «يلعب» بنضيف إله S فبصير plays. لكن انتبهوا:
- `1:24.38–1:30.88` ‏مش كل الأفعال بنضيف إلها S وبس؛ في حالات معينة لازم نضيف ES بدل S.
- `1:31.64–1:33.72` ‏طيب، إمتى منضيف ES؟

| | |
|---|---|
| Educational concept | play → plays; but not every verb takes only s — sometimes es instead of s. So when do we add es? |
| Visual situation | The boy kicks a ball; “play → plays”; then “s” crossed red and “es” written green beside it; big “es ?” question. |
| Characters & objects | Boy (kicks, then thinks). |
| Drawing sequence | Ball → play → plays → s ✗ → es → es ?. |
| Hand movement | Writes plays on “plays”, crosses s on “مش كل الأفعال”. |
| Character animation | Kick on “يلعب”, think on “إمتى منضيف ES”. |
| English text | play → plays · s · es · es ? |
| Arabic text | يلعب · مش كل الأفعال |
| Camera | Close-up on “es ?” at the end. |
| Transition | Pan down. |
| Synchronization | plays 81–83 s; ✗ 84.4 s; es ? 92 s. |

## S06 · Case 1: verbs ending in ch

**1:34.00 → 2:06.47** (32.5 s)

**Narration**

- `1:34.27–1:37.79` ‏خلينا نتعرّف على الحالات وحدة وحدة. الحالة الأولى:
- `1:38.34–1:41.21` ‏الأفعال اللي بتنتهي بـ CH.
- `1:41.91–1:44.30` ‏إذا انتهى الفعل بالحرفين CH
- `1:44.70–1:46.96` ‏فغالباً بنضيف إله ES.
- `1:47.62–1:54.40` ‏مثلاً الفعل watch اللي معناه «يشاهد» بنضيف إله ES فبصير watches.
- `1:55.07–1:59.33` ‏والفعل teach اللي معناه «يعلّم» بصير teaches. ⚠️ “teaches” (−3.4) vs “teachers” (−2.8) is a near tie; “teaches” fits the rule being taught.
- `2:00.14–2:06.07` ‏يعني إذا انتهى الفعل بـ CH، اتذكروا إنه بنضيف ES مش S لحالها.

| | |
|---|---|
| Educational concept | Verbs ending in ch take es: watch → watches, teach → teaches. |
| Visual situation | Label “1”; big “ch → + es”; the boy watching TV with “watch → watches”; the girl at a board for “teach → teaches”; ch ringed. |
| Characters & objects | Boy (watches TV), girl (teaches, points). |
| Drawing sequence | 1 → ch → + es → TV → watch → watches → board → teach → teaches → ring. |
| Hand movement | Writes “ch” on “CH”, the green es exactly on “watches”/“teaches”. |
| Character animation | Girl points on “يعلّم”. |
| English text | ch · + es · watch → watches · teach → teaches |
| Arabic text | الحالة الأولى · يشاهد · يعلّم |
| Camera | Static. |
| Transition | Pan right. |
| Synchronization | watches 112–114 s; teaches 118.7 s; recap 120–126 s. |
| Review note | “teaches” vs “teachers” is a near tie in scoring (see transcript flag). |

## S07 · Case 2: verbs ending in sh

**2:06.47 → 2:30.56** (24.1 s)

**Narration**

- `2:06.87–2:10.82` ‏الحالة الثانية: الأفعال اللي بتنتهي بـ SH.
- `2:11.46–2:12.71` ‏نفس الفكرة تقريباً:
- `2:13.21–2:17.36` ‏إذا انتهى الفعل بالحرفين SH بنضيف إله ES.
- `2:17.94–2:22.74` ‏مثلاً الفعل brush اللي معناه «يفرّش» بصير brushes.
- `2:23.39–2:27.32` ‏والفعل wish اللي معناه «يتمنّى» بصير wishes.
- `2:27.81–2:30.25` ‏إذن عنا لحد هلأ قاعدتين:

| | |
|---|---|
| Educational concept | Same idea: sh → es: brush → brushes, wish → wishes. |
| Visual situation | Label “2”; “sh → + es”; a toothbrush for “brush → brushes”; a star for “wish → wishes”; a “2 rules” tally. |
| Characters & objects | Boy (brushes his teeth, then wishes on a star). |
| Drawing sequence | 2 → sh → + es → toothbrush → brush → brushes → star → wish → wishes. |
| Hand movement | Writes brushes on “brushes”, wishes on “wishes”. |
| Character animation | Boy holds the toothbrush, looks up at the star. |
| English text | sh · + es · brush → brushes · wish → wishes |
| Arabic text | الحالة الثانية · يفرّش · يتمنّى |
| Camera | Static. |
| Transition | Pan down. |
| Synchronization | brushes 141–142.7 s; wishes 146–147.3 s. |

## S08 · Case 3: verbs ending in x

**2:30.56 → 2:52.08** (21.5 s)

**Narration**

- `2:30.88–2:38.99` ‏الأفعال اللي بتنتهي بـ CH والأفعال اللي بتنتهي بـ SH بنضيف إلها ES. الحالة الثالثة:
- `2:39.52–2:41.81` ‏الأفعال اللي بتنتهي بـ X.
- `2:42.19–2:45.88` ‏إذا انتهى الفعل بحرف X كمان منضيف إله ES.
- `2:46.66–2:51.77` ‏مثلاً الفعل fix اللي معناه «يصلّح» بصير fixes.

| | |
|---|---|
| Educational concept | Recap ch + sh → es; third case x → es: fix → fixes. |
| Visual situation | Mini recap “ch · sh → es”; label “3”; “x → + es”; a wrench and a broken toy car fixed; “fix → fixes”. |
| Characters & objects | Boy (fixes with a wrench). |
| Drawing sequence | ch · sh → es → 3 → x → + es → wrench → fix → fixes. |
| Hand movement | Writes fixes on “fixes”. |
| Character animation | Boy turns the wrench. |
| English text | ch · sh → es · x · + es · fix → fixes |
| Arabic text | الحالة الثالثة · يصلّح |
| Camera | Static. |
| Transition | Wipe-erase in place. |
| Synchronization | fixes 170.5–171.8 s. |

## S09 · Case 4: verbs ending in ss

**2:52.08 → 3:19.76** (27.7 s)

**Narration**

- `2:52.39–2:58.61` ‏وهون لاحظوا إنّا ما اكتفينا بإضافة S، بل أضفنا ES. الحالة الرابعة:
- `2:58.94–3:01.20` ‏الأفعال اللي بتنتهي بـ SS.
- `3:01.54–3:05.80` ‏إذا انتهى الفعل بالحرفين SS بنضيف إله ES.
- `3:06.66–3:11.69` ‏مثلاً الفعل miss اللي معناه «يفتقد» بصير misses.
- `3:12.13–3:15.99` ‏وإذا حكينا عن شخص بيفتقد شغلة أو بيشتاق لحدا،
- `3:16.33–3:19.32` ‏ممكن نستخدم الفعل misses حسب سياق الجملة.

| | |
|---|---|
| Educational concept | Not just s but es; fourth case ss → es: miss → misses (to miss someone or something). |
| Visual situation | “s ✗ / es ✓” mini mark; label “4”; “ss → + es”; the girl thinking of the boy with a heart: “miss → misses”. |
| Characters & objects | Girl (misses the boy, thought bubble with the boy and a heart). |
| Drawing sequence | s/es → 4 → ss → + es → girl → thought bubble → heart → miss → misses. |
| Hand movement | Writes misses on “misses” (190.5 s and 197 s). |
| Character animation | Girl sad then smiles. |
| English text | ss · + es · miss → misses |
| Arabic text | الحالة الرابعة · يفتقد · يشتاق |
| Camera | Static. |
| Transition | Pan right. |
| Synchronization | misses 190.6–191.7 s; heart on “بيشتاق” 194 s. |

## S10 · Case 5: o → es (go, do)

**3:19.76 → 3:49.43** (29.7 s)

**Narration**

- `3:20.20–3:21.54` ‏إذن لحد هلأ،
- `3:21.92–3:29.84` ‏الحالات اللي بنضيف فيها ES هي: CH، SH، X، SS. الحالة الخامسة:
- `3:30.27–3:32.18` ‏الأفعال اللي بتنتهي بـ O.
- `3:32.71–3:36.73` ‏بعض الأفعال اللي بتنتهي بحرف O بنضيف إلها ES.
- `3:37.56–3:49.16` ‏مثلاً الفعل go اللي معناه «يذهب» بصير goes، والفعل do اللي معناه «يفعل» بصير does. لكن هون في ملاحظة مهمة جداً:

| | |
|---|---|
| Educational concept | Recap of the es endings ch, sh, x, ss; fifth case: some verbs ending in o take es: go → goes, do → does. |
| Visual situation | Four endings in a row with one bracket “→ es”; label “5”; the boy walking to school for “go → goes”; homework for “do → does”. |
| Characters & objects | Boy (walks to school). |
| Drawing sequence | ch sh x ss → es → 5 → o → school → go → goes → do → does. |
| Hand movement | Writes each ending as it is listed (204–208 s). |
| Character animation | Boy walks toward the school on “يذهب”. |
| English text | ch · sh · x · ss · es · o · go → goes · do → does |
| Arabic text | الحالة الخامسة · يذهب · يفعل |
| Camera | Static. |
| Transition | Zoom into the note, then wipe. |
| Synchronization | goes 220–221.5 s; does 226–227 s; “ملاحظة مهمة” 227.5 s. |

## S11 · But: photo → photos, radio → radios

**3:49.43 → 4:08.93** (19.5 s)

**Narration**

- `3:49.69–3:55.70` ‏مش كل كلمة بتنتهي بحرف O لازم نضيف إلها ES؛ في كلمات منضيف إلها S بس.
- `3:56.17–3:59.04` ‏مثلاً كلمة photo بتصير photos، ⚠️ “photos” confirmed (−2.2 vs “photoes” −12.5).
- `3:59.48–4:02.03` ‏وكلمة radio بتصير radios.
- `4:02.47–4:04.56` ‏يعني لازم ننتبه للكلمة نفسها،
- `4:04.94–4:08.61` ‏وما نعمّم قاعدة ES على كل الكلمات اللي بتنتهي بـ O.

| | |
|---|---|
| Educational concept | Not every word ending in o takes es; some words take only s: photo → photos, radio → radios. Look at the word itself. |
| Visual situation | A camera photo and a radio; “photo → photos”, “radio → radios” with green s; “o + es” with a small “not always” red mark. |
| Characters & objects | Girl (raises a finger: careful). |
| Drawing sequence | Photo frame → photo → photos → radio → radio → radios → o ≠ always es. |
| Hand movement | Writes photos on “photos”, radios on “radios”. |
| Character animation | Girl “careful” finger. |
| English text | photo → photos · radio → radios |
| Arabic text | مش كل كلمة · ننتبه للكلمة نفسها |
| Camera | Static. |
| Transition | Pan down. |
| Synchronization | photos 238.5 s; radios 241 s. |
| Review note | photo/radio (and later city/boy) are nouns used as spelling examples; the narration calls them “كلمة”, not “فعل”. |

## S12 · Case 6: y — after a consonant

**4:08.93 → 4:41.55** (32.6 s)

**Narration**

- `4:09.25–4:12.24` ‏الحالة السادسة: الأفعال اللي بتنتهي بـ Y.
- `4:12.75–4:15.67` ‏هاي من أهم الحالات، ولازم نركّز فيها شوي،
- `4:16.02–4:19.03` ‏لأنه عنا حالتين مختلفتين. الحالة الأولى:
- `4:19.37–4:27.88` ‏إذا انتهى الفعل بحرف Y وقبله حرف ساكن، بنحذف حرف Y وبنضيف IES. خلينا ناخد أمثلة:
- `4:28.39–4:35.99` ‏الفعل study اللي بيعني «يدرس»: منلاحظ إنه بينتهي بحرف Y، وقبله حرف D، وهذا حرف ساكن،
- `4:36.42–4:41.25` ‏عشان هيك بنحذف Y وبنضيف IES فبيصير studies.

| | |
|---|---|
| Educational concept | Verbs ending in y have two cases. First: consonant before y → drop y, add ies: study → studies. |
| Visual situation | Label “6”; a fork: “consonant + y” / “vowel + y”; first branch highlighted; “study” with d ringed, y crossed, “ies” added: “studies”; the boy studying with a book. |
| Characters & objects | Boy (studies a book). |
| Drawing sequence | 6 → y → fork → consonant + y → study → d ring → y ✗ → studies. |
| Hand movement | Crosses y on “بنحذف Y”, writes ies on “studies”. |
| Character animation | Boy reads. |
| English text | y · consonant + y → ies · study → studies · d |
| Arabic text | الحالة السادسة · حرف ساكن · يدرس |
| Camera | Close-up on “study” 273–280 s. |
| Transition | Pan right. |
| Synchronization | study 268.5 s; d ring 273 s; studies 280 s. |

## S13 · city → cities

**4:41.55 → 5:01.02** (19.5 s)

**Narration**

- `4:41.85–4:45.22` ‏ومثال تاني: كلمة city اللي معناها «مدينة»:
- `4:45.74–4:48.83` ‏قبل حرف Y في حرف T، وهو حرف ساكن،
- `4:49.27–4:53.99` ‏عشان هيك بنحذف Y وبنضيف IES فبتصير cities.
- `4:54.47–5:00.79` ‏إذن إذا انتهى الفعل بـ Y وقبله حرف ساكن، بنحذف Y وبنضيف IES.

| | |
|---|---|
| Educational concept | Second example: city — t before y is a consonant, so cities. Recap of the first case. |
| Visual situation | Skyline of buildings; “city” with t ringed, y crossed; “cities”; rule line “consonant + y → ies”. |
| Characters & objects | None (buildings). |
| Drawing sequence | Buildings → city → t ring → y ✗ → cities → rule. |
| Hand movement | Writes cities on “cities”. |
| Character animation | Building windows fill. |
| English text | city → cities · t · consonant + y → ies |
| Arabic text | مدينة · حرف ساكن |
| Camera | Static. |
| Transition | Pan down. |
| Synchronization | city 283 s; cities 293 s; recap 294.5–300.8 s. |

## S14 · y after a vowel: keep y, add s

**5:01.02 → 5:28.49** (27.5 s)

**Narration**

- `5:01.25–5:02.78` ‏لكن انتبهوا للحالة التانية:
- `5:03.42–5:07.20` ‏إذا انتهى الفعل بحرف Y وقبله حرف متحرك
- `5:07.61–5:10.84` ‏بنضيف S بس، وما بنحذف حرف Y.
- `5:11.20–5:19.45` ‏والحروف المتحركة هي A، E، I، O، U. مثلاً الفعل play
- `5:19.91–5:21.17` ‏اللي معناه «يلعب»:
- `5:21.54–5:23.44` ‏قبل حرف Y في حرف A،
- `5:23.86–5:25.27` ‏وهو حرف متحرك،
- `5:25.63–5:28.31` ‏عشان هيك بنخلّي Y زي ما هي

| | |
|---|---|
| Educational concept | Second case: vowel before y → add only s, y stays. Vowels are a, e, i, o, u. Example play: a before y. |
| Visual situation | Vowels “a e i o u” written one by one in green; “play” with a ringed; y kept (green ✓). |
| Characters & objects | Girl (counts vowels on her fingers). |
| Drawing sequence | vowel + y → + s → a e i o u → play → a ring → y ✓. |
| Hand movement | Writes each vowel exactly as it is spoken (313–316 s). |
| Character animation | Girl points to each vowel. |
| English text | vowel + y → + s · a e i o u · play · a |
| Arabic text | حرف متحرك · يلعب |
| Camera | Static. |
| Transition | Same page (continues). |
| Synchronization | Vowels 313–316.5 s; play 318.5 s; a ring 322.5 s. |

## S15 · plays, boy → boys

**5:28.49 → 5:44.69** (16.2 s)

**Narration**

- `5:28.66–5:33.80` ‏وبنضيف S بس فبصير plays. وكلمة boy
- `5:34.14–5:37.57` ‏اللي معناها «ولد»: قبل حرف Y فيها حرف O،
- `5:38.09–5:42.47` ‏وهو كمان حرف متحرك، عشان هيك بنضيف S بس ⚠️ “plays” (−16.7) vs “please” (−13.6): the TTS voice pronounces it close to “please”; context says plays.
- `5:42.81–5:44.26` ‏فبتصير boys.

| | |
|---|---|
| Educational concept | So play → plays, and boy (o before y, a vowel) → boys. |
| Visual situation | “play → plays”; the boy waves and “boy → boys” with o ringed; a second boy appears (boys). |
| Characters & objects | Boy ×2 (boys). |
| Drawing sequence | plays → boy → o ring → boys → second boy. |
| Hand movement | Writes plays at 331 s, boys at 343.5 s. |
| Character animation | Both boys wave. |
| English text | play → plays · boy → boys · o |
| Arabic text | ولد · حرف متحرك |
| Camera | Static. |
| Transition | Pan right. |
| Synchronization | plays 331 s; boy 333.3 s; boys 343.6 s. |
| Review note | “plays” is pronounced close to “please” by the voice; written as plays. |

## S16 · Y summary and the three endings

**5:44.69 → 6:15.46** (30.8 s)

**Narration**

- `5:45.12–5:47.21` ‏خلينا نلخّص قاعدة Y بسرعة:
- `5:47.76–5:52.55` ‏إذا كان قبل Y حرف ساكن، بنحذف Y وبنضيف IES.
- `5:53.17–6:00.32` ‏أما إذا كان قبل Y حرف متحرك، فبنخلّي Y زي ما هي وبنضيف S بس. ممتاز!
- `6:00.71–6:07.36` ‏هيك إحنا تعرّفنا على أهم الحالات اللي بنستخدم فيها S وES وIES.
- `6:07.96–6:15.16` ‏لكن ضل عنا كم ملاحظة مهمة لازم تعرفوها. الملاحظات المهمة: الملاحظة الأولى:

| | |
|---|---|
| Educational concept | Quick summary of y; then all three endings s, es, ies; then important notes begin. |
| Visual situation | Two-branch diagram: consonant + y → ies (study → studies), vowel + y → s (play → plays); “ممتاز” with a star; then “s · es · ies” and a note pad “ملاحظات”. |
| Characters & objects | Boy (thumbs up / cheer on “ممتاز”). |
| Drawing sequence | y → two branches → ies / s → star → s es ies → notepad. |
| Hand movement | Writes ies on 350 s, s on 358 s. |
| Character animation | Cheer on “ممتاز”. |
| English text | consonant + y → ies · vowel + y → s · s · es · ies |
| Arabic text | ممتاز · ملاحظات مهمة |
| Camera | Diagonal zoom-out between the two halves. |
| Transition | Pan down. |
| Synchronization | ies 351 s; s 359 s; ممتاز 360 s; notes 372 s. |

## S17 · Note 1: he / she / it

**6:15.46 → 6:55.87** (40.4 s)

**Narration**

- `6:15.76–6:27.21` ‏نفس قواعد إضافة S وES وIES بنستخدمها مع الأفعال في زمن المضارع البسيط لما يكون الفاعل he أو she أو
- `6:27.61–6:27.88` ‏it.
- `6:28.46–6:37.64` ‏يعني لما نحكي عن شخص واحد أو عن حيوان أو إشي مفرد، لازم ننتبه لشكل الفعل. مثلاً: He plays
- `6:37.97–6:39.23` ‏يعني «هو بيلعب».
- `6:39.80–6:42.61` ‏She watches يعني «هي بتشاهد».
- `6:43.25–6:49.31` ‏It works يعني «هو بيشتغل»، حسب المقصود من الجملة. لكن انتبه:
- `6:49.75–6:55.61` ‏إضافة S للفعل في المضارع البسيط مش معناها إننا بنضيف S مع كل اسم جمع.

| | |
|---|---|
| Educational concept | These rules are used with verbs in the Present Simple when the subject is he, she or it: He plays. She watches. It works. Not with every plural noun. |
| Visual situation | Heading “Present Simple”; “he / she / it” labels; the boy kicking: “He plays.”; the girl with the TV: “She watches.”; a lit bulb: “It works.” |
| Characters & objects | Boy (plays), girl (watches TV). |
| Drawing sequence | Present Simple → he she it → He plays. → She watches. → bulb → It works. |
| Hand movement | Writes each sentence as it is said. |
| Character animation | Boy kicks, bulb lights up. |
| English text | Present Simple · he · she · it · He plays. · She watches. · It works. |
| Arabic text | المضارع البسيط · شخص واحد / حيوان / إشي مفرد |
| Camera | Static. |
| Transition | Wipe-erase in place. |
| Synchronization | he/she/it 384–388 s; He plays 396 s; She watches 399.8 s; It works 403.3 s. |

## S18 · I / you / we / they: no s

**6:55.87 → 7:21.38** (25.5 s)

**Narration**

- `6:56.12–7:06.95` ‏مع الضمائر I وyou وwe وthey الفعل بيجي عادةً بصيغته الأساسية بدون S، مثلاً: I play، You play،
- `7:07.60–7:09.35` ‏We play، They play. ⚠️ Wording scored best (−8.6 vs −33.6 or lower for alternatives).
- `7:10.13–7:21.13` ‏أما مع he وshe وit فبنحتاج نضيف S أو ES أو نطبّق قاعدة IES حسب نهاية الفعل. الملاحظة التانية:

| | |
|---|---|
| Educational concept | With I, you, we, they the verb stays in its base form: I play, You play, We play, They play. With he, she, it we add s / es / ies. |
| Visual situation | Two-column table: left “I play / You play / We play / They play” (no s), right “he · she · it → + s / es / ies”. |
| Characters & objects | Boy and girl together (we/they). |
| Drawing sequence | Column 1 rows → column 2 → arrow. |
| Hand movement | Writes each pronoun line as it is spoken. |
| Character animation | Characters point at their row. |
| English text | I play · You play · We play · They play · he · she · it · s / es / ies |
| Arabic text | بدون S |
| Camera | Static. |
| Transition | Pan right. |
| Synchronization | I play 424 s, You play 425.5 s, We play 427.6 s, They play 428.5 s. |

## S19 · Note 2: why es? (easier to say)

**7:21.38 → 7:47.06** (25.7 s)

**Narration**

- `7:21.64–7:24.23` ‏ليش أحياناً بنضيف ES بدل S؟
- `7:24.87–7:29.02` ‏إضافة ES بتساعد على تسهيل نطق الكلمة في بعض الحالات،
- `7:29.37–7:39.03` ‏وعشان هيك بنلاحظ إنه في أفعال معينة، مثل اللي بتنتهي بـ CH وSH وSS وX، بنضيف ES.
- `7:39.52–7:46.84` ‏وهاد بساعدنا نميّز بين الأفعال اللي بنضيف إلها S والأفعال اللي بنضيف إلها ES. الملاحظة التالتة:

| | |
|---|---|
| Educational concept | es makes some words easier to pronounce; that is why ch, sh, ss, x take es. |
| Visual situation | A mouth/speech icon with sound waves; “watch·es” split in two syllables; the four endings again with “→ es”. |
| Characters & objects | Girl (speaks, sound waves). |
| Drawing sequence | Why es? → mouth → waves → watch·es → ch sh ss x → es. |
| Hand movement | Writes the endings as they are listed. |
| Character animation | Girl talks. |
| English text | Why es? · watch·es · ch · sh · ss · x · es |
| Arabic text | أسهل في النطق |
| Camera | Static. |
| Transition | Pan down. |
| Synchronization | Endings 455–457.5 s. |

## S20 · Note 3: have → has

**7:47.06 → 8:13.54** (26.5 s)

**Narration**

- `7:47.28–7:51.08` ‏في فعل مهم جداً لازم تحفظه، وهو have.
- `7:51.57–8:02.62` ‏الفعل have إله شكل خاص مع he وshe وit: بدل ما نحكي haves منحكي has. يعني: I have لكن He has،
- `8:03.06–8:04.68` ‏She has، It has.
- `8:05.31–8:13.20` ‏إذن الفعل have إله تصريف خاص مع he وshe وit، ولازم نحفظه زي ما هو. الخلاصة:

| | |
|---|---|
| Educational concept | have is special: with he, she, it it becomes has (not haves). I have — he has, she has, it has. |
| Visual situation | “have” big; “haves” struck red ✗ (the narration calls it wrong); “has” green; “I have” vs “He has / She has / It has”. |
| Characters & objects | Boy (holds a ball: “has”). |
| Drawing sequence | have → haves ✗ → has ✓ → I have → He has → She has → It has. |
| Hand movement | Strikes “haves” on “بدل ما نحكي haves”, writes has on “has”. |
| Character animation | Boy holds the ball. |
| English text | have · haves · has · I have · He has · She has · It has |
| Arabic text | تصريف خاص |
| Camera | Static. |
| Transition | Pan right. |
| Synchronization | haves ✗ 478 s; has 479.5 s; I have / He has 480–482.6 s; She has / It has 483–484.7 s. |

## S21 · Summary 1: es endings and o

**8:13.54 → 8:38.08** (24.5 s)

**Narration**

- `8:13.88–8:24.34` ‏طيب، قبل ما نختم خلينا نراجع القواعد بسرعة: إذا انتهى الفعل بـ CH أو SH أو X أو SS غالباً منضيف ES.
- `8:24.93–8:37.75` ‏وإذا انتهى بـ O في أفعال منضيف إلها ES، مثل go اللي بتصير goes، وdo اللي بتصير does، وفي كلمات منضيف إلها S بس، مثل photo اللي بتصير photos.

| | |
|---|---|
| Educational concept | Review: ch, sh, x, ss → es; o: go → goes, do → does, but photo → photos. |
| Visual situation | Checklist page: “ch · sh · x · ss → es”; “o”: go → goes, do → does, photo → photos (green s). |
| Characters & objects | Girl (points along the list). |
| Drawing sequence | Summary → endings → es → o → go/goes → do/does → photo/photos. |
| Hand movement | Writes each pair on its word. |
| Character animation | Girl points. |
| English text | ch · sh · x · ss → es · go → goes · do → does · photo → photos |
| Arabic text | الخلاصة |
| Camera | Static. |
| Transition | Pan down. |
| Synchronization | go/goes 509 s; do/does 511.5 s; photo/photos 515–517.7 s. |

## S22 · Summary 2: y and all other verbs

**8:38.08 → 9:03.82** (25.7 s)

**Narration**

- `8:38.41–8:41.89` ‏وإذا انتهى الفعل بـ Y لازم ننتبه للحرف اللي قبله:
- `8:42.39–8:49.44` ‏إذا كان حرف ساكن منحذف Y ومنضيف IES، مثل study اللي بتصير studies. ⚠️ “photos” confirmed (−14.2 vs “photoes” −24.8).
- `8:50.10–8:57.39` ‏أما إذا كان حرف متحرك فمنخلّي Y زي ما هي ومنضيف S بس، مثل play اللي بتصير plays.
- `8:58.11–9:03.54` ‏وكل الأفعال العادية اللي ما بتنطبق عليها هاي الحالات منضيف إلها S بس.

| | |
|---|---|
| Educational concept | y: consonant before → ies (study → studies); vowel before → s (play → plays). All other ordinary verbs → s. |
| Visual situation | Same fork as S16 redrawn smaller with the examples; then “other verbs → + s”. |
| Characters & objects | Boy (nods). |
| Drawing sequence | y → consonant: study → studies → vowel: play → plays → other verbs + s. |
| Hand movement | Writes studies 528 s, plays 536 s. |
| Character animation | Boy thumbs up. |
| English text | consonant + y → ies · study → studies · vowel + y → s · play → plays · + s |
| Arabic text | باقي الأفعال |
| Camera | Static. |
| Transition | Pan right. |
| Synchronization | studies 528 s; plays 536 s; + s 542 s. |

## S23 · Remember he/she/it and have → has. Practise!

**9:03.82 → 9:28.72** (24.9 s)

**Narration**

- `9:04.10–9:10.89` ‏وأخيراً، تذكّروا إنه مع he وshe وit في المضارع البسيط لازم ننتبه لتصريف الفعل،
- `9:11.30–9:13.86` ‏وما ننسى إنه have بصير has.
- `9:14.39–9:19.88` ‏وبهيك بنكون تعلّمنا أهم قواعد إضافة S وES في اللغة الإنجليزية.
- `9:20.47–9:23.95` ‏راجعوا الأمثلة، وجرّبوا تطبّقوا القواعد على كلمات جديدة،
- `9:24.30–9:28.29` ‏لأنه كل ما تدرّبت أكتر رح تصير القواعد أسهل عليكم.

| | |
|---|---|
| Educational concept | Finally: with he, she, it watch the verb form; have → has. Review the examples and practise on new words. |
| Visual situation | “he · she · it” + verb; “have → has”; the boy writing new words in a notebook; both characters cheer; stars. |
| Characters & objects | Boy (writes, cheers), girl (waves). |
| Drawing sequence | he she it → have → has → notebook → stars. |
| Hand movement | Writes has on “has”, draws the notebook on “راجعوا الأمثلة”. |
| Character animation | Cheer and wave at the end. |
| English text | he · she · it · have → has · s · es · ies |
| Arabic text | جرّبوا على كلمات جديدة |
| Camera | Gentle pull-back at the end. |
| Transition | End. |
| Synchronization | has 553 s; practise 560.5 s; cheer 566 s. |

