import { useState } from "react";
import GameTopBar from "../GameTopBar";
import SceneBackground from "../SceneBackground";
import { NWQ_ASSETS } from "../../assets/assets";

export default function FlashCards({
  words,
  player,
  stars,
  onBack,
  onNavigate,
  onReset,
  activeScreen
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const total = words.length;
  const word = words[index];

  function goTo(nextIndex) {
    setIndex(((nextIndex % total) + total) % total);
    setFlipped(false);
  }

  if (!word) return null;

  return (
    <main className="screen flashcards-screen">
      <SceneBackground src={NWQ_ASSETS.backgrounds.wordle.moonlitLake} fit="cover">
        <GameTopBar
          title="FLASH CARDS"
          streak={player.streak}
          stars={stars}
          onBack={onBack}
          onNavigate={onNavigate}
          onReset={onReset}
          activeScreen={activeScreen}
        />

        <section className="flashcards-content">
          <p className="flashcards-progress">
            Card {index + 1} of {total} · {word.worldShortName}
          </p>

          <button
            type="button"
            className={`flashcard ${flipped ? "flashcard-flipped" : ""}`}
            onClick={() => setFlipped((value) => !value)}
            aria-label="Flip card"
          >
            <div className="flashcard-inner">
              <div className="flashcard-face flashcard-front">
                <strong>{word.ojibwe.toUpperCase()}</strong>
                <small>Tap to reveal meaning</small>
              </div>

              <div className="flashcard-face flashcard-back">
                <strong>{word.english}</strong>
                <small>{word.categoryLabel}</small>
              </div>
            </div>
          </button>

          <section className="flashcards-controls">
            <button className="btn-plank" onClick={() => goTo(index - 1)}>
              ◀ Prev
            </button>

            <button className="btn-gold" onClick={() => setFlipped((value) => !value)}>
              Flip
            </button>

            <button className="btn-plank" onClick={() => goTo(index + 1)}>
              Next ▶
            </button>
          </section>
        </section>
      </SceneBackground>
    </main>
  );
}
