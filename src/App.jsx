import { useEffect, useMemo, useState } from "react";
import HomeScreen from "./components/HomeScreen";
import WorldMap from "./components/WorldMap";
import LevelSelect from "./components/LevelSelect";
import MultipleChoice from "./components/MultipleChoice";
import WordleChallenge from "./components/WordleChallenge";
import LevelComplete from "./components/LevelComplete";
import WordCollection from "./components/WordCollection";
import { loadTSV } from "./utils/loadTSV";
import {
  buildWorlds,
  getNextPlayableWord,
  prepareWords,
  starsForWord
} from "./utils/gameData";

const STORAGE_KEY = "odaminodaa-player-v3";
const DEFAULT_PLAYER = { streak: 5, completed: {} };

function loadPlayer() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...DEFAULT_PLAYER, ...JSON.parse(saved) } : DEFAULT_PLAYER;
  } catch {
    return DEFAULT_PLAYER;
  }
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [words, setWords] = useState([]);
  const [player, setPlayer] = useState(loadPlayer);
  const [selectedWorldId, setSelectedWorldId] = useState(null);
  const [selectedWordId, setSelectedWordId] = useState(null);
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
      .then((rawRows) => setWords(prepareWords(rawRows)))
      .catch((error) => setLoadingError(error.message));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
  }, [player]);

  const worlds = useMemo(() => buildWorlds(words), [words]);

  const totalStars = useMemo(
    () =>
      Object.values(player.completed || {}).reduce(
        (sum, record) => sum + Number(record?.stars || 0),
        0
      ),
    [player.completed]
  );

  const nextPlayable = useMemo(
    () => getNextPlayableWord(player, worlds),
    [player, worlds]
  );

  const selectedWorld =
    worlds.find((world) => world.id === Number(selectedWorldId)) ||
    nextPlayable?.world ||
    worlds[0];

  const selectedWord =
    words.find((word) => word.id === selectedWordId) ||
    nextPlayable?.word ||
    words[0];

  function openWorld(worldId) {
    setSelectedWorldId(Number(worldId));
    setScreen("levels");
  }

  function startWord(wordId, worldId) {
    setSelectedWordId(wordId);
    setSelectedWorldId(Number(worldId));
    setPendingWordleResult(null);
    setScreen("wordle");
  }

  function continueJourney() {
    if (!nextPlayable) return;

    setSelectedWorldId(nextPlayable.world.id);
    setSelectedWordId(nextPlayable.word.id);
    setPendingWordleResult(null);
    setScreen("wordle");
  }

  function finishWordle(result) {
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
    const previousStars = starsForWord(player, selectedWord.id);
    const bestStars = Math.max(previousStars, Number(recall.stars || 1));

    const combinedResult = {
      ...recall,
      recognitionAttempts: attempts,
      score: Number(recall.score || 0) + recognitionBonus
    };

    setPlayer((previous) => ({
      ...previous,
      completed: {
        ...previous.completed,
        [selectedWord.id]: {
          stars: bestStars,
          lastRecallGuesses: recall.guesses,
          lastRecognitionAttempts: attempts,
          lastScore: combinedResult.score,
          completedAt: new Date().toISOString()
        }
      }
    }));

    setLastResult(combinedResult);
    setScreen("complete");
  }

  function replayCurrentWord() {
    setPendingWordleResult(null);
    setScreen("wordle");
  }

  function startDaily() {
    if (!words.length) return;

    const dayNumber = Math.floor(Date.now() / 86400000);
    const word = words[dayNumber % words.length];

    setSelectedWorldId(word.worldId);
    setSelectedWordId(word.id);
    setPendingWordleResult(null);
    setScreen("wordle");
  }

  function resetProgress() {
    setPlayer({ ...DEFAULT_PLAYER });
    setSelectedWordId(null);
    setSelectedWorldId(null);
    setPendingWordleResult(null);
    localStorage.removeItem(STORAGE_KEY);
    setScreen("home");
  }

  if (loadingError) {
    return (
      <main className="loading-screen">
        <h1>Odaminodaa</h1>
        <p>{loadingError}</p>
        <p>Make sure <code>public/data/words.tsv</code> exists and uses tabs.</p>
      </main>
    );
  }

  if (!words.length || !worlds.length) {
    return (
      <main className="loading-screen">
        <div className="loading-star">★</div>
        <h1>Loading Odaminodaa…</h1>
      </main>
    );
  }

  return (
    <div className="game-shell">
      {screen === "home" && (
        <HomeScreen
          player={player}
          stars={totalStars}
          nextPlayable={nextPlayable}
          onContinue={continueJourney}
          onWorldMap={() => setScreen("world-map")}
          onDaily={startDaily}
          onCollection={() => setScreen("collection")}
          onReset={resetProgress}
        />
      )}

      {screen === "world-map" && (
        <WorldMap
          player={player}
          stars={totalStars}
          worlds={worlds}
          onBack={() => setScreen("home")}
          onWorld={openWorld}
        />
      )}

      {screen === "levels" && selectedWorld && (
        <LevelSelect
          player={player}
          stars={totalStars}
          world={selectedWorld}
          onBack={() => setScreen("world-map")}
          onPlay={(wordId) => startWord(wordId, selectedWorld.id)}
        />
      )}

      {screen === "collection" && (
        <WordCollection
          words={words}
          worlds={worlds}
          player={player}
          stars={totalStars}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "wordle" && selectedWord && (
        <WordleChallenge
          word={selectedWord}
          player={player}
          stars={totalStars}
          onBack={() => {
            setSelectedWorldId(selectedWord.worldId);
            setScreen("levels");
          }}
          onComplete={finishWordle}
        />
      )}

      {screen === "quiz" && selectedWord && (
        <MultipleChoice
          word={selectedWord}
          words={words}
          player={player}
          stars={totalStars}
          onBack={() => setScreen("wordle")}
          onComplete={finishRecognition}
        />
      )}

      {screen === "complete" && selectedWord && (
        <LevelComplete
          word={selectedWord}
          result={lastResult}
          onReplay={replayCurrentWord}
          onNext={() => {
            setPendingWordleResult(null);
            setSelectedWorldId(selectedWord.worldId);
            setScreen("levels");
          }}
          onMap={() => setScreen("world-map")}
        />
      )}
    </div>
  );
}
