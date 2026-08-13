import { useMemo, useState } from "react";
import GameTopBar from "./GameTopBar";

function uniqueByEnglish(words) {
  const seen = new Set();

  return words.filter((candidate) => {
    const key = candidate.english.trim().toLowerCase();

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function rotate(items, amount) {
  if (!items.length) return [];
  const offset = amount % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

function buildChoices(word, words) {
  const sameCategory = uniqueByEnglish(
    words.filter(
      (candidate) =>
        candidate.id !== word.id &&
        candidate.category === word.category
    )
  );

  const sameWorld = uniqueByEnglish(
    words.filter(
      (candidate) =>
        candidate.id !== word.id &&
        candidate.worldId === word.worldId &&
        candidate.category !== word.category
    )
  );

  const anywhere = uniqueByEnglish(
    words.filter((candidate) => candidate.id !== word.id)
  );

  const seed = word.id
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const distractors = [];

  for (const pool of [
    rotate(sameCategory, seed),
    rotate(sameWorld, seed + 3),
    rotate(anywhere, seed + 7)
  ]) {
    for (const candidate of pool) {
      if (distractors.length >= 3) break;

      if (
        !distractors.some(
          (item) =>
            item.english.toLowerCase() === candidate.english.toLowerCase()
        )
      ) {
        distractors.push(candidate);
      }
    }
  }

  const choices = [
    { english: word.english, correct: true },
    ...distractors.slice(0, 3).map((item) => ({
      english: item.english,
      correct: false
    }))
  ];

  return rotate(choices, seed % Math.max(choices.length, 1));
}

export default function MultipleChoice({
  word,
  words,
  player,
  stars,
  onBack,
  onComplete
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const choices = useMemo(() => buildChoices(word, words), [word, words]);

  const correct =
    selectedIndex !== null && Boolean(choices[selectedIndex]?.correct);

  function choose(index) {
    if (correct) return;

    setSelectedIndex(index);
    setAttempts((value) => value + 1);
  }

  return (
    <main className="screen quiz-screen">
      <GameTopBar
        title={`${word.worldShortName} · Step 2 of 2`}
        streak={player.streak}
        stars={stars}
        onBack={onBack}
      />

      <section className="quiz-content">
        <div className="learning-step-label">RECOGNITION & REINFORCEMENT</div>

        <h1>What does this Ojibwe word mean?</h1>

        <div className="word-parchment">
          <strong>{word.ojibwe.toUpperCase()}</strong>
        </div>

        <p className="word-hint">Category: {word.categoryLabel}</p>

        <div className="answer-grid">
          {choices.map((choice, index) => {
            let state = "";

            if (selectedIndex === index) {
              state = choice.correct ? "answer-correct" : "answer-wrong";
            } else if (correct && choice.correct) {
              state = "answer-correct";
            }

            return (
              <button
                key={`${choice.english}-${index}`}
                className={`answer-button ${state}`}
                onClick={() => choose(index)}
              >
                <span>{String.fromCharCode(65 + index)}.</span>
                <strong>{choice.english}</strong>
                {state === "answer-correct" && <b>✓</b>}
              </button>
            );
          })}
        </div>

        {selectedIndex !== null && !correct && (
          <div className="feedback feedback-wrong">Try again.</div>
        )}

        {correct && (
          <section className="correct-panel">
            <div>
              <strong>Meaning confirmed!</strong>
              <span>{word.ojibwe.toUpperCase()} = {word.english}</span>
              <small>
                {attempts === 1
                  ? "Correct on the first recognition attempt."
                  : `Correct after ${attempts} recognition attempts.`}
              </small>
            </div>

            <button onClick={() => onComplete({ attempts })}>
              Complete Level <span>➜</span>
            </button>
          </section>
        )}
      </section>
    </main>
  );
}
