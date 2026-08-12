import { useMemo, useState } from "react";
import GameTopBar from "./GameTopBar";

function deterministicChoices(word, words) {
  const others = words
    .filter((candidate) => candidate.id !== word.id)
    .map((candidate) => candidate.english);

  const rotateBy = Number(word.id || 1) % Math.max(others.length, 1);
  const rotated = [...others.slice(rotateBy), ...others.slice(0, rotateBy)].slice(0, 3);

  const choices = [word.english, ...rotated];

  return choices.sort((a, b) => {
    const scoreA = (a.charCodeAt(0) + Number(word.id || 0)) % 11;
    const scoreB = (b.charCodeAt(0) + Number(word.id || 0)) % 11;
    return scoreA - scoreB;
  });
}

export default function MultipleChoice({
  word,
  words,
  level,
  player,
  stars,
  onBack,
  onContinue
}) {
  const [selected, setSelected] = useState("");
  const [attempts, setAttempts] = useState(0);

  const choices = useMemo(() => deterministicChoices(word, words), [word, words]);
  const correct = selected === word.english;

  function choose(choice) {
    if (correct) return;
    setSelected(choice);
    setAttempts((value) => value + 1);
  }

  function speakWord() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word.ojibwe);
      utterance.rate = 0.75;
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <main className="screen quiz-screen">
      <GameTopBar
        title={`Level ${level} · 1/2`}
        streak={player.streak}
        stars={stars}
        onBack={onBack}
      />

      <div className="quiz-hearts">❤️ ❤️ ❤️</div>

      <section className="quiz-content">
        <h1>What does this Ojibwe word mean?</h1>

        <div className="word-parchment">
          <strong>{word.ojibwe.toUpperCase()}</strong>
          <button
            className="sound-button"
            onClick={speakWord}
            aria-label={`Hear ${word.ojibwe}`}
            title="Uses browser text-to-speech for this demo"
          >
            🔊
          </button>
        </div>

        <p className="word-hint">{word.hint}</p>

        <div className="answer-grid">
          {choices.map((choice, index) => {
            let state = "";

            if (selected === choice) {
              state = choice === word.english ? "answer-correct" : "answer-wrong";
            } else if (correct && choice === word.english) {
              state = "answer-correct";
            }

            return (
              <button
                key={choice}
                className={`answer-button ${state}`}
                onClick={() => choose(choice)}
              >
                <span>{String.fromCharCode(65 + index)}.</span>
                <strong>{choice}</strong>
                {state === "answer-correct" && <b>✓</b>}
              </button>
            );
          })}
        </div>

        {selected && !correct && (
          <div className="feedback feedback-wrong">
            Try again. Use the hint and choose another meaning.
          </div>
        )}

        {correct && (
          <section className="correct-panel">
            <div>
              <strong>Great answer!</strong>
              <span>★ +10</span>
              <small>{attempts === 1 ? "Perfect recognition!" : "You found it!"}</small>
            </div>

            <button onClick={onContinue}>
              Word Challenge <span>➜</span>
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
