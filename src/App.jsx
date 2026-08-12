import { useEffect, useMemo, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import WorldMap from "./components/WorldMap";
import LevelSelect from "./components/LevelSelect";
import MultipleChoice from "./components/MultipleChoice";
import WordleChallenge from "./components/WordleChallenge";
import LevelComplete from "./components/LevelComplete";
import WordCollection from "./components/WordCollection";
import { loadTSV } from "./utils/loadTSV";

const DEFAULT_PLAYER = {
  streak: 5,
  completed: {},
  currentLevel: 1
};

function loadPlayer() {
  try {
    const saved = localStorage.getItem("odaminodaa-player");
    return saved ? { ...DEFAULT_PLAYER, ...JSON.parse(saved) } : DEFAULT_PLAYER;
  } catch {
    return DEFAULT_PLAYER;
  }
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [words, setWords] = useState([]);
  const [player, setPlayer] = useState(loadPlayer);
  const [selectedLevel, setSelectedLevel] = useState(1);

  // Stores the result from Step 1 (Word Guess).
  // The level is not awarded until Step 2 is also completed.
  const [pendingWordleResult, setPendingWordleResult] = useState(null);

  const [lastResult, setLastResult] = useState({
    guesses: 0,
    stars: 0,
    score: 0,
    elapsed: 0,
    recognitionAttempts: 0
  });

  const [loadingError, setLoadingError] = useState("");

  useEffect(() => {
    const path = `${import.meta.env.BASE_URL}data/words.tsv`;

    loadTSV(path)
      .then((rows) => {
        setWords(rows);
        setSelectedLevel((current) => {
          const max = Math.max(1, rows.length);
          return Math.min(current, max);
        });
      })
      .catch((error) => setLoadingError(error.message));
  }, []);

  useEffect(() => {
    localStorage.setItem("odaminodaa-player", JSON.stringify(player));
  }, [player]);

  const totalStars = useMemo(
    () =>
      Object.values(player.completed || {}).reduce(
        (sum, value) => sum + Number(value || 0),
        0
      ),
    [player.completed]
  );

  const currentLevel = Math.max(
    1,
    Math.min(Number(player.currentLevel || 1), Math.max(words.length, 1))
  );

  const selectedWord =
    words.find((word) => Number(word.level) === Number(selectedLevel)) ||
    words[0];

  function startLevel(level) {
    const numericLevel = Number(level);

    if (numericLevel > currentLevel) {
      return;
    }

    setSelectedLevel(numericLevel);
    setPendingWordleResult(null);

    // IMPORTANT CHANGE:
    // Step 1 is independent recall BEFORE the learner sees the answer pair.
    setScreen("wordle");
  }

  function finishWordle(result) {
    // Do NOT unlock the level yet.
    // Save the recall performance, then move to recognition/reinforcement.
    setPendingWordleResult(result);
    setScreen("quiz");
  }

  function finishRecognition({ attempts }) {
    const recall = pendingWordleResult || {
      guesses: 6,
      stars: 1,
      score: 100,
      elapsed: 0
    };

    const recognitionBonus = attempts === 1 ? 50 : 25;
    const combinedResult = {
      ...recall,
      recognitionAttempts: attempts,
      score: Number(recall.score || 0) + recognitionBonus
    };

    const newStars = Number(recall.stars || 1);
    const previousStars = Number(player.completed?.[selectedLevel] || 0);
    const bestStars = Math.max(previousStars, newStars);

    const nextLevel = Math.min(
      words.length,
      Math.max(currentLevel, selectedLevel + 1)
    );

    setPlayer((previous) => ({
      ...previous,
      currentLevel: nextLevel,
      completed: {
        ...previous.completed,
        [selectedLevel]: bestStars
      }
    }));

    setLastResult(combinedResult);
    setScreen("complete");
  }

  function replay() {
    setPendingWordleResult(null);
    setScreen("wordle");
  }

  function nextLevel() {
    const next = Math.min(words.length, selectedLevel + 1);
    setSelectedLevel(next);
    setPendingWordleResult(null);
    setScreen("levels");
  }

  function startDaily() {
    if (!words.length) return;

    const dayNumber = Math.floor(Date.now() / 86400000);
    const dailyIndex = dayNumber % words.length;
    const word = words[dailyIndex];

    setSelectedLevel(Number(word.level));
    setPendingWordleResult(null);
    setScreen("wordle");
  }

  function resetProgress() {
    const reset = { ...DEFAULT_PLAYER };
    setPlayer(reset);
    setSelectedLevel(1);
    setPendingWordleResult(null);
    localStorage.removeItem("odaminodaa-player");
    setScreen("home");
  }

  if (loadingError) {
    return (
      <main className="loading-screen">
        <h1>Odaminodaa</h1>
        <p>{loadingError}</p>
        <p>
          Make sure <code>public/data/words.tsv</code> exists.
        </p>
      </main>
    );
  }

  if (!words.length) {
    return (
      <main className="loading-screen">
        <div className="loading-star">★</div>
        <h1>Loading Odaminodaa…</h1>
      </main>
    );
  }

  const common = {
    player,
    stars: totalStars,
    totalLevels: words.length
  };

  return (
    <div className="game-shell">
      {screen === "home" && (
        <HomeScreen
          {...common}
          onContinue={() => setScreen("world-map")}
          onWorldMap={() => setScreen("world-map")}
          onDaily={startDaily}
          onCollection={() => setScreen("collection")}
          onReset={resetProgress}
        />
      )}

      {screen === "world-map" && (
        <WorldMap
          {...common}
          onBack={() => setScreen("home")}
          onLevels={() => setScreen("levels")}
          onLevel={startLevel}
        />
      )}

      {screen === "levels" && (
        <LevelSelect
          {...common}
          onBack={() => setScreen("world-map")}
          onPlay={startLevel}
        />
      )}

      {screen === "collection" && (
        <WordCollection
          words={words}
          {...common}
          onBack={() => setScreen("home")}
        />
      )}

      {/* STEP 1: Independent recall */}
      {screen === "wordle" && selectedWord && (
        <WordleChallenge
          word={selectedWord}
          level={selectedLevel}
          {...common}
          onBack={() => setScreen("levels")}
          onComplete={finishWordle}
        />
      )}

      {/* STEP 2: Recognition / reinforcement */}
      {screen === "quiz" && selectedWord && (
        <MultipleChoice
          word={selectedWord}
          words={words}
          level={selectedLevel}
          {...common}
          onBack={() => setScreen("wordle")}
          onComplete={finishRecognition}
        />
      )}

      {screen === "complete" && selectedWord && (
        <LevelComplete
          word={selectedWord}
          result={lastResult}
          {...common}
          onReplay={replay}
          onNext={nextLevel}
          onMap={() => setScreen("world-map")}
        />
      )}
    </div>
  );
}
