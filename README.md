# Odaminodaa — Ojibwe Word Journey

A self-contained React/Vite prototype of a level-based Ojibwe vocabulary game.

The demo includes:

- Home / Continue Journey screen
- World Map
- Locked/unlocked level progression
- Five sample Ojibwe words loaded from a TSV file
- Multiple-choice recognition activity
- Wordle-style recall challenge
- 1–3 star scoring
- Level completion screen
- Word Collection
- Daily Challenge button
- Browser-local progress saving
- Responsive desktop/mobile layout
- GitHub Pages deployment workflow

## Sample TSV words

The project ships with five demo words in:

`public/data/words.tsv`

| Ojibwe | English |
|---|---|
| makwa | Bear |
| amik | Beaver |
| waabooz | Rabbit |
| migizi | Eagle |
| mooz | Moose |

Replace or expand the TSV later without rewriting the game interface.

## Run locally

Install Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local address shown by Vite, usually:

```text
http://localhost:5173
```

## Build

```bash
npm run build
```

The production site is created in `dist/`.

## Upload to GitHub

Create a new GitHub repository, then from this project folder:

```bash
git init
git add .
git commit -m "Initial Odaminodaa prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

## Publish with GitHub Pages

A workflow is already included at:

`.github/workflows/deploy-pages.yml`

After pushing:

1. Open your GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, choose **GitHub Actions** as the source.
4. Open the **Actions** tab and wait for the `Deploy to GitHub Pages` workflow to finish.
5. Your site will be available at:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/
```

Future pushes to `main` will redeploy automatically.

## Add more words

Edit:

`public/data/words.tsv`

Keep the tab-separated headers:

```text
id    ojibwe    english    category    world    level    type    hint
```

Each new row can become a new game level.

## Important language note

The five words in this repository are demonstration content. For a production/community language-learning resource, language content, pronunciation, spelling, dialect choices, and cultural presentation should be reviewed by the appropriate Ojibwe language experts and community authorities.

## Project structure

```text
ojibwe-word-journey/
├── .github/
│   └── workflows/
│       └── deploy-pages.yml
├── public/
│   └── data/
│       └── words.tsv
├── src/
│   ├── components/
│   │   ├── GameTopBar.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── LevelComplete.jsx
│   │   ├── LevelSelect.jsx
│   │   ├── MultipleChoice.jsx
│   │   ├── Stars.jsx
│   │   ├── WordCollection.jsx
│   │   ├── WordleChallenge.jsx
│   │   └── WorldMap.jsx
│   ├── styles/
│   │   └── game.css
│   ├── utils/
│   │   └── loadTSV.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## Demo gameplay

1. Start at **Home**.
2. Select **Continue Journey** or **World Map**.
3. Open the currently unlocked level.
4. Answer the multiple-choice Ojibwe meaning question.
5. Complete the Word Challenge by typing the Ojibwe word.
6. Earn stars based on the number of guesses.
7. The next level unlocks automatically.
8. Progress remains saved in local storage.

The menu button on the Home screen resets the demo progress.
