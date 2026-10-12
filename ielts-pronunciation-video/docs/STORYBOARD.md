# Storyboard (audio-aligned)

Audio: `assets/audio/narration.wav` · 0:24.99 (24.987188 s) · 24 kHz mono PCM. 7 scenes, 25 narration segments.

Coverage check: scenes are contiguous from 0:00.00 to the end of the audio and every narration segment belongs to a scene.

Timestamps come from the recording itself (silence detection + Whisper-small, reviewed by hand; see `js/transcript.js`). Scene builders in `js/scenes.js` place every stroke on this clock.

| # | Start | End | Title |
|---|---|---|---|
| S01 | 0:00.00 | 0:02.30 | The challenge |
| S02 | 0:02.30 | 0:05.20 | ENTREPRENEUR |
| S03 | 0:05.20 | 0:09.35 | COLLEAGUE |
| S04 | 0:09.35 | 0:13.60 | SCHEDULE |
| S05 | 0:13.60 | 0:16.60 | DEVELOP |
| S06 | 0:16.60 | 0:20.05 | CLIENT |
| S07 | 0:20.05 | 0:24.99 | VEHICLE + finish |

## S01 · The challenge

**0:00.00 → 0:02.30** (2.3 s)

**Narration**

- `0:00.11–0:01.93` ‏أتحداك تنطق هذي الكلمات صح

| | |
|---|---|
| Educational concept | Hook: “I challenge you to pronounce these words correctly.” |
| Visual situation | Arabic challenge heading written at the top; the learner is drawn, ready. |
| Characters & objects | Boy (the viewer/learner). |
| Drawing sequence | Heading → boy. |
| Hand movement | Reveals the heading right-to-left, then draws the boy. |
| Character animation | Boy raises his brows (game on). |
| English text | — |
| Arabic text | أتحداك تنطق هذي الكلمات صح |
| Camera | Static. |
| Transition | The first word card is written under the heading. |
| Synchronization | Heading 0.12–1.2 s while “أتحداك…” is spoken. |

## S02 · ENTREPRENEUR

**0:02.30 → 0:05.20** (2.9 s)

**Narration**

- `0:02.41–0:03.15` ‏إنتر برنجر؟ — *Entrepreneur — the common mistake* ⚠️ Exact wrong form inferred (“انتر برنجر” scored best, “انتر برنر” close).
- `0:03.35–0:03.60` ‏لا
- `0:04.12–0:05.08` *Entrepreneur*
- `0:05.16–0:06.21` ‏وهذي الكلمة

| | |
|---|---|
| Educational concept | Entrepreneur: stress on the last syllable, French “entre” = “أون”. |
| Visual situation | Word card; wrong “إنتر برنجر” in red struck through; correct “أونْتْرَبْرَنير” in green; NEUR underlined (stress). |
| Characters & objects | Boy (the challenged learner) at the bottom, reacting. |
| Drawing sequence | Word → wrong → strike + ✗ → flame → ✓ → correct → underline NEUR → score dot 1. |
| Hand movement | Writes the word, reveals the mistake, strikes it, ticks and reveals the correct pronunciation, marks the tricky letters, then wipes the card. |
| Character animation | Boy tries (talking), frowns at “لا”, grins at the correct form. |
| English text | ENTREPRENEUR |
| Arabic text | إنتر برنجر · أونْتْرَبْرَنير |
| Camera | Static; the page never moves so the header and score stay in place. |
| Transition | Hand wipes the card. |
| Synchronization | Word as it is mispronounced (2.41); ✗ on “لا” (3.35); correct revealed 4.12–5.08. |
| Review note | Wrong form transliteration inferred from the audio. |

## S03 · COLLEAGUE

**0:05.20 → 0:09.35** (4.1 s)

**Narration**

- `0:05.16–0:06.21` ‏وهذي الكلمة
- `0:06.84–0:07.77` ‏مو كولاج
- `0:07.98–0:08.31` ‏هي
- `0:08.59–0:09.21` *Colleague*
- `0:09.29–0:10.32` ‏وهذي الكلمة

| | |
|---|---|
| Educational concept | Colleague is “كوليغ”, not “كولاج”; the final UE is silent. |
| Visual situation | Word card; “كولاج” red struck; “كُولِيغ” green; UE slashed. |
| Characters & objects | Boy (the challenged learner) at the bottom, reacting. |
| Drawing sequence | Wipe → word → wrong → strike + ✗ → ✓ → correct → slash UE → dot 2. |
| Hand movement | Writes the word, reveals the mistake, strikes it, ticks and reveals the correct pronunciation, marks the tricky letters, then wipes the card. |
| Character animation | Boy shrugs at “مو كولاج”, grins at “colleague”. |
| English text | COLLEAGUE |
| Arabic text | كولاج · كُولِيغ |
| Camera | Static; the page never moves so the header and score stay in place. |
| Transition | Hand wipes the card. |
| Synchronization | “كولاج” 6.9–7.6 while “مو كولاج” is spoken; correct at 8.59–9.21. |

## S04 · SCHEDULE

**0:09.35 → 0:13.60** (4.3 s)

**Narration**

- `0:11.05–0:11.66` ‏سكتشول؟ — *Schedule — the common mistake*
- `0:11.98–0:12.16` ‏لا
- `0:12.82–0:13.53` *Schedule*

| | |
|---|---|
| Educational concept | Schedule: SCH = “سك” (American), not “سكتش”. |
| Visual situation | Word card; “سكتشول” red struck; “سْكِجُول” green; SCH circled. |
| Characters & objects | Boy (the challenged learner) at the bottom, reacting. |
| Drawing sequence | Wipe → word → wrong → strike + ✗ → ✓ → correct → ring SCH → dot 3. |
| Hand movement | Writes the word, reveals the mistake, strikes it, ticks and reveals the correct pronunciation, marks the tricky letters, then wipes the card. |
| Character animation | Boy tries, frowns, grins. |
| English text | SCHEDULE |
| Arabic text | سكتشول · سْكِجُول |
| Camera | Static; the page never moves so the header and score stay in place. |
| Transition | Fast wipe (the next word follows immediately). |
| Synchronization | Wrong 11.05–11.66; ✗ on “لا” 11.98; correct 12.82–13.53. |
| Review note | British “شِدْيُول” is also correct; the narration teaches the American form only. |

## S05 · DEVELOP

**0:13.60 → 0:16.60** (3.0 s)

**Narration**

- `0:13.60–0:14.30` ‏وهذي ⚠️ Boundary inside a continuous span, estimated from the energy envelope.
- `0:14.30–0:14.98` ‏دفلوب؟ — *Develop — the common mistake* ⚠️ Exact wrong form inferred (“دفلوب” ≈ “ديفلوب”).
- `0:15.36–0:15.60` ‏لا
- `0:16.07–0:16.51` *Develop*

| | |
|---|---|
| Educational concept | Develop: stress on VEL, ending “لَب” not “لوب”. |
| Visual situation | Word card; “دفلوب” red struck; “دِڤِيلَب” green; VEL underlined. |
| Characters & objects | Boy (the challenged learner) at the bottom, reacting. |
| Drawing sequence | Wipe → word → wrong → strike + ✗ → ✓ → correct → underline VEL → dot 4. |
| Hand movement | Writes the word, reveals the mistake, strikes it, ticks and reveals the correct pronunciation, marks the tricky letters, then wipes the card. |
| Character animation | Boy tries, frowns, grins. |
| English text | DEVELOP |
| Arabic text | دفلوب · دِڤِيلَب |
| Camera | Static; the page never moves so the header and score stay in place. |
| Transition | Hand wipes the card. |
| Synchronization | Wrong ≈14.3–14.98; ✗ on “لا” 15.36; correct 16.07–16.51. |
| Review note | Wrong form transliteration inferred from the audio. |

## S06 · CLIENT

**0:16.60 → 0:20.05** (3.4 s)

**Narration**

- `0:16.63–0:17.47` ‏وهذي
- `0:17.86–0:18.36` ‏كلينت؟ — *Client — the common mistake* ⚠️ “كلينت” scored only slightly above “كلاينت”.
- `0:18.60–0:18.88` ‏لا
- `0:19.32–0:19.79` *Client*

| | |
|---|---|
| Educational concept | Client: the I is “اي” — “كلايِنت”, not “كلينت”. |
| Visual situation | Word card; “كلينت” red struck; “كْلايِنْت” green; I circled. |
| Characters & objects | Boy (the challenged learner) at the bottom, reacting. |
| Drawing sequence | Wipe → word → wrong → strike + ✗ → ✓ → correct → ring I → dot 5. |
| Hand movement | Writes the word, reveals the mistake, strikes it, ticks and reveals the correct pronunciation, marks the tricky letters, then wipes the card. |
| Character animation | Boy tries, frowns, grins. |
| English text | CLIENT |
| Arabic text | كلينت · كْلايِنْت |
| Camera | Static; the page never moves so the header and score stay in place. |
| Transition | Hand wipes the card. |
| Synchronization | Wrong 17.86–18.36; ✗ on “لا” 18.6; correct 19.32–19.79. |
| Review note | Wrong form transliteration inferred from the audio. |

## S07 · VEHICLE + finish

**0:20.05 → 0:24.99** (4.9 s)

**Narration**

- `0:20.09–0:20.95` ‏وهذي
- `0:21.17–0:21.86` ‏ڤيهيكل؟ — *Vehicle — the common mistake (H pronounced)*
- `0:22.23–0:22.46` ‏لا
- `0:22.81–0:23.57` *Vehicle*
- `0:24.01–0:24.72` *Vehicle*

| | |
|---|---|
| Educational concept | Vehicle: the H is silent — “ڤِيِكِل”, not “ڤيهيكل”. |
| Visual situation | Word card; “ڤيهيكل” red struck; H slashed in red; “ڤِيِكِل” green; on the repeat VE underlined, last score dot, stars, boy celebrates 6/6. |
| Characters & objects | Boy (the challenged learner) at the bottom, reacting. |
| Drawing sequence | Wipe → word → wrong → strike + ✗ → slash H → ✓ → correct → underline → dot 6 → stars. |
| Hand movement | Writes the word, reveals the mistake, strikes it, ticks and reveals the correct pronunciation, marks the tricky letters, then wipes the card. |
| Character animation | Boy tries, frowns, then cheers on the final repeat. |
| English text | VEHICLE |
| Arabic text | ڤيهيكل · ڤِيِكِل |
| Camera | Static; the page never moves so the header and score stay in place. |
| Transition | End. |
| Synchronization | Wrong 21.17–21.86; ✗ + H slash on “لا” 22.23; correct 22.81–23.57; celebration on the repeat 24.01–24.72. |

