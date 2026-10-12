# Engine & art API (template/js)

Read this before writing `js/scenes.js`. A complete worked example (20 scenes, 7 minutes, both aspect ratios) is in `references/example-past-simple/scenes.js`; copy patterns from it freely.

## Contents
1. Time model and the shared-progress rule
2. Scene scaffolding (`scene()`, camera, `pk`)
3. `A` — drawing primitives
4. Scene helpers in scenes.js (`say`, `find`, `ring`, `strike`, `under`, `pair`, `boxes`)
5. `Art` — characters, poses, props
6. Colours, fonts, sizes, safe zones
7. Gotchas

---

## 1. Time model

Every visible thing is a pure function of audio time `t` (seconds). A stroke is `{path, t0, dur}`; at time `t` its progress is `p = clamp((t − t0)/dur)`. The engine reveals `p` of the path and puts the pen tip at `getPointAtLength(p·len)` of the **same** path. The hand follows the stroke whose time window contains `t`. Between strokes it glides to the next stroke if the gap is ≤ 1.4 s; otherwise it leaves the frame and comes back.

Consequences:
- **Never overlap two pen strokes in time** if you want the hand on both. The hand follows the most recently started stroke; any other stroke draws "by itself". Fades (fills) and animations may overlap freely.
- Every `t` you write must come from the transcript (sentence or phrase start/end). Writing usually starts 0–0.4 s before the word is spoken and ends within ~0.3 s after it.
- Nothing accumulates between frames, so seek, rewind and export are exact. Keep it that way: no `Math.random()` (use `PenFont.rng(seed)`), no `Date`, no state that depends on the previous frame.

## 2. Scene scaffolding (top of scenes.js, already in the template)

```js
scene('S05', { move: 'right' | 'down' | 'diag', panDur: 1.0, panAt: t?, scene: { showFrom, keepUntil } }, (A, d) => { ... })
```
- Each scene owns a page of paper at `origin`. `move` places the new page right of, below, or diagonally from the previous one, and pans the camera there over `panDur` starting at `panAt ?? d.start`. `diag` zooms out to 0.42× mid-way (good for "new chapter"). With no `move`, the new scene shares the previous page, which is what you want for erase transitions.
- `d` is the STORYBOARD entry (`d.start`, `d.end`).
- Visibility: a scene shows from `start` (or `showFrom`) until the next scene's start + 4 s (or `keepUntil`). Set `prevScene.keepUntil` when the camera lingers on an old page (see S01/S02 and S08/S09 in the example).
- Camera inside a scene: `camTo(t0, t1, local(x, y, zoom))` moves to scene-local point (x, y); `camTo(t0, t1, home())` returns. Keys are eased. Always move from the current state; never add keys earlier than ones already added.
- `pk(vertical, horizontal)` picks a value per format. `v` is true for 9:16. **Author both compositions**; never crop one into the other.
- Cross-scene references go in `shared` (e.g. `shared.formula = boxes(...)`).

## 3. `A` — primitives (all return `{ end }`; times in seconds, coordinates scene-local)

| call | what it draws |
|---|---|
| `A.path(d, {t, dur?/speed?, w, color, parent})` | one pen stroke |
| `A.draw([{d, w, color, parent, transform}], {t, dur?, speed?, gap})` | several strokes in order; with `dur` they share time by length |
| `A.text(str, {x, y, size, t, dur?, anchor:'middle'|'start'|'end', color, colorAt(i,ch)})` | English written stroke-by-stroke in the single-stroke pen font. (x, y) = top of cap height. Glyphs: A–Z, 0–9, `. , ? ! ' - / ( ) : + = _` and space. **Uppercase only.** |
| `A.para(str, {x, y, size, maxW, t, dur, colorAt})` | wrapped, centred multi-line text; returns `{lines, end}` |
| `A.ar(str, {x, y, size, t, dur, color, anchor})` | Arabic (or any RTL/complex script) shaped by the browser in Cairo, revealed right→left while the hand travels the baseline. (x, y) = baseline. |
| `A.arrow(x1,y1,x2,y2,{t,dur,bend,head,color,w})` | hand-drawn curved arrow |
| `A.loop(cx,cy,rx,ry,{t,dur,color,w})` | hand-drawn circle around something |
| `A.underline(x1,x2,y,{t,dur,color})`, `A.check(x,y,s,{t})`, `A.cross(x,y,w,h,{t})` | emphasis marks (check is green, cross is red) |
| `A.erase(group, x, y, w, h, t, dur)` | the hand wipes a zig-zag over the region and erases `group` under it. Only ink inside `group` is erased, so put things you will wipe in their own `A.group({})` via `parent`. |
| `A.fade(el, t, dur)` | opacity fade (fills; not for line art) |
| `A.anim(t => ...)` | per-frame function of t (e.g. a ball flying); must be pure |
| `A.group(attrs, parent?)` | `<g>` in the scene |

Pen speed guidance: big headings 0.8–1.9 s, spoken sentences ≈ spoken duration + 0.3 s, icons 0.4–1.0 s, characters 1.2–1.8 s.

## 4. Helpers defined in scenes.js

- `say(A, str, {x, y, size, maxW, t, dur, marks: {WORD: color, '@7': color}, parent})` is `para` plus colour marks per word (or per char index `@i`). Use it for every sentence.
- `find(res, 'WORD', nth?)` returns `{x, y, w, h, cx, cy}` of a word in a `say` result, for rings, underlines and arrows.
- `ring(A, box, t, {color, pad, padY, dur})` circles a word; `strike(A, res, t)` draws a red line through a wrong sentence; `under(A, box, t, color, dur, parent)` underlines.
- `pair(A, 'GO', 'WENT', {x, y, size, t, da, tb, db, ending, colorB, stack})` draws "A → B". `ending` colours the last n letters of B green (PLAY→PLAY**ED**); `stack: v` puts B under A on narrow frames.
- `boxes(A, [{ar|en, color, t, dur}], {x, y, w, h, t, ar, en, gap, bdur, plus})` draws formula boxes "[subject] + [verb] + [rest]", with labels written at their spoken times.

## 5. `Art`

`Art.character(A, {kind:'boy'|'girl'|'grandma', x, y, scale, flip, t, dur, pose, keys:[{t, ...pose, dur?}], parent, shirt, pants})`
- (x, y) = point between the feet. Height ≈ 400·scale px (scale 0.7–0.95 on 9:16, 0.52–0.62 on 16:9).
- Drawn in a natural order: head → ears → hair → eyes → brows → nose → mouth → neck → torso → legs → arms → hands/shoes. Fills fade in afterwards. It blinks on its own (deterministically) once drawn.
- `keys`: the pose is *reached* at `t` (the transition starts `dur ?? min(0.6, gap)` earlier). Keys before the character is fully drawn are ignored. A pose is any subset of `{aL, aR, lL, lR: [shoulderDeg, elbowDeg], head, dy, lean, x, mouth, eyes, brows}`.
- `mouth`: smile, grin, open, o, frown, flat, yawn, talk. `eyes`: open, happy, tired.
- Presets in `Art.P`: rest, wave, waveL, think, point, pointUp, shrug, cheer, no, tired, ask, hold, holdL, kick. `Art.reach(side, x, y)` gives arm angles that put a hand at a body-local point (use it to hold props).
- Walking: a sequence of keys with alternating `lL`/`lR` and growing `x` (see S07 in the example).
- Returns `{end, head:{x,y}, top}`. Use `head` to aim bubble tails.

Props, all `{x, y, s, t, dur, parent}`: `bubble({x,y,w,h,tx,ty})` (speech bubble; keep the tail short, ~100 px toward the speaker), `thought({x,y,w,h,tx,ty})`, `tv({on})`, `popcorn`, `ball` (returns `g` for animation), `calendar` (`.cell(i)` gives a cell position), `school`, `phone({rot})`, `clock({spin:[t0,t1]})` (hands run backwards, meaning "the past"), `box({w,h,color,fill})`, `bulb`, `star`, `food`, `suitcase`, `park`, `book`, `zzz`.

New props: build them the same way, as outline strokes via `A.draw([...])` plus `fillShape()` fills timed after the outline. Keep 5–12 strokes and stroke width 5–6.

## 6. Style constants

- Palette `Art.C`: ink `#1d1d1b`, cream paper, beige `#e3cfa8`, beigeDark, green `#2e6a4a` (emphasis / correct), red `#b23a2b` (wrong / negation), skin, hair. Use extra colours only when they carry meaning.
- Text sizes (9:16): titles 110–150, key words 80–120, sentences 56–66 (`maxW` ≤ 960), labels 34–50; Arabic 44–92.
- **Safe zone (9:16)**: keep important text in x 70–1010, y 230–1560. The bottom ~360 px and the right edge sit under Reels/TikTok UI, but characters' feet can live there. The preview's "Reels safe zone" checkbox overlays it.
- Measure before placing: `PenFont.measure(str, size)` gives the width in px. Long sentences on 9:16 need `maxW`, and check marks or crosses placed after a line need room on the right.

## 7. Gotchas (all hit in practice)

- A word lookup with `find` only works on `say`/`para` results (they carry `.str` per line).
- Things you later `A.erase` must be inside the erased group, *including* underlines and rings drawn later (pass `parent`).
- Don't erase something the moment it finishes drawing; give the viewer ≥ 0.8 s.
- Camera push-ins on 9:16 crop the sides quickly. Check with frames before keeping a zoom > 1.05.
- Speech-bubble tails that reach far down cross everything below. Point them just past the bubble toward the speaker.
- `A.ar` measures text after fonts load (the player awaits `document.fonts`). Don't call `getBBox` yourself during build.
- `pkill -f "tools/render.mjs"` from a shell whose own command line contains that string kills the shell too. Use `pgrep`, then `kill PID`.
