# NativeWordQuest / Odaminodaa — Scalable TSV Version

This React + Vite version is driven directly by your vocabulary TSV.

## Exact TSV format supported

```text
ojibwe word    english word    group/category
makwa          bear            animal
migizi         eagle           animal
bezhig         one             number
```

The fields must be separated with TAB characters.

The game automatically:

- normalizes common category spelling variations,
- creates broad game Worlds,
- creates Lessons of 10 words,
- creates level buttons,
- uses only the category as the Step 1 recall hint,
- hides the English meaning during Step 1,
- chooses multiple-choice distractors from the same category first,
- stores progress by a stable word key rather than a level number.

## Gameplay

Step 1:

```text
Guess the Ojibwe word
Hint: Animal
_ _ _ _ _
```

Step 2:

```text
MAKWA

A. Beaver
B. Bear
C. Moose
D. Fox
```

Stars are based on independent recall:

- 1–2 guesses: 3 stars
- 3–4 guesses: 2 stars
- 5–6 guesses: 1 star

## Automatic Worlds

1. Animals & Insects
2. Numbers & Amounts
3. Weather, Seasons & Time
4. Actions
5. People, Family & Body
6. Conversation
7. Food & Drink
8. Home, Clothing & Travel
9. Land & Nature
10. Feelings & Descriptions
11. More Words

Only worlds that actually contain TSV words are shown.

## Category cleanup examples

The code automatically converts:

- `animals` → `animal`
- `bodypart` → `body part`
- `verd` → `verb`
- `emotion` → `feeling`
- `household oject` → `household`
- `oject` → `household`
- `time of day` → `part of day`
- `bug/bug related` → `insect`
- `outside` → `nature`
- `type of tree` → `nature`
- `vechicle` → `vehicle`

Rows beginning with `FINALIZED...`, blank Ojibwe entries, and blank English entries are ignored.

## Replace the sample with your full TSV

Replace only:

```text
public/data/words.tsv
```

Keep the same headers. You do not need to edit React code when you add more words.

## Optional permanent ID

For the research/database version, a permanent ID is recommended:

```text
id    ojibwe word    english word    group/category
0001  makwa          bear            animal
```

The prototype also works without an ID column.

## GitHub Pages

For your GitHub repository `NativeWordQuest`, keep:

```js
base: "/NativeWordQuest/"
```

in `vite.config.js`.

Commit changes to `main` and your GitHub Pages Action can redeploy automatically.


## Curved forest trail

Lesson levels are displayed as alternating locked/unlocked footsteps on a curved forest path.
