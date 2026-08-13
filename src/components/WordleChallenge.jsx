import { useEffect, useMemo, useState } from "react";
import GameTopBar from "./GameTopBar";

const KEY_ROWS = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

function evaluateGuess(guess, answer) {
  const result = Array(answer.length).fill("absent");
  const remaining = answer.split("");

  for (let index = 0; index < answer.length; index += 1) {
    if (guess[index] === answer[index]) {
      result[index] = "exact";
      remaining[index] = null;
    }
  }

  for (let index = 0; index < answer.length; index += 1) {
    if (result[index] === "exact") continue;

    const foundIndex = remaining.findIndex((letter) => letter === guess[index]);

    if (foundIndex >= 0) {
      result[index] = "present";
      remaining[foundIndex] = null;
    }
  }

  return result;
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function WordleChallenge({
  word,
  player,
  stars,
  onBack,
  onComplete
}) {
  const answer = word.ojibwe.toUpperCase();
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState(
    "Use the category hint and your memory."
  );
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  const solved = guesses.some((guess) => guess === answer);
  const failed = guesses.length >= 6 && !solved;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsed((Date.now() - startedAt) / 1000);
    }, 500);

    return () => window.clearInterval(timer);
  }, [startedAt]);

  const keyStates = useMemo(() => {
    const states = {};

    guesses.forEach((guess) => {
      const evaluation = evaluateGuess(guess, answer);

      guess.split("").forEach((letter, index) => {
        const next = evaluation[index];
        const previous = states[letter];
        const priority = { absent: 1, present: 2, exact: 3 };

        if (!previous || priority[next] > priority[previous]) {
          states[letter] = next;
        }
      });
    });

    return states;
  }, [guesses, answer]);

  function addLetter(letter) {
    if (solved || failed) return;

    if (current.length < answer.length) {
      setCurrent((value) => value + letter);
      setMessage("");
    }
  }

  function removeLetter() {
    if (solved || failed) return;
    setCurrent((value) => value.slice(0, -1));
  }

  function submitGuess() {
    if (solved || failed) return;

    if (current.length !== answer.length) {
      setMessage(`Enter ${answer.length} letters.`);
      return;
    }

    const nextGuesses = [...guesses, current];
    setGuesses(nextGuesses);

    if (current === answer) {
      const guessCount = nextGuesses.length;
      const earnedStars = guessCount <= 2 ? 3 : guessCount <= 4 ? 2 : 1;
      const score = earnedStars * 100;

      setMessage("Correct! Now confirm the meaning.");

      window.setTimeout(() => {
        onComplete({
          guesses: guessCount,
          stars: earnedStars,
          score,
          elapsed
        });
      }, 850);

      return;
    }

    if (nextGuesses.length >= 6) {
      setMessage(
        "Recall attempt complete. Continue to recognition practice."
      );

      window.setTimeout(() => {
        onComplete({
          guesses: 6,
          stars: 1,
          score: 100,
          elapsed
        });
      }, 1100);
    } else {
      setMessage("Not quite. Try again.");
    }

    setCurrent("");
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (/^[a-zA-Z]$/.test(event.key)) {
        addLetter(event.key.toUpperCase());
      } else if (event.key === "Backspace") {
        removeLetter();
      } else if (event.key === "Enter") {
        submitGuess();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const displayRows = Array.from({ length: 6 }).map((_, rowIndex) => {
    const isCurrentRow = rowIndex === guesses.length && !solved && !failed;
    const guess = guesses[rowIndex] || (isCurrentRow ? current : "");
    const submitted = Boolean(guesses[rowIndex]);
    const evaluation = submitted ? evaluateGuess(guess, answer) : [];

    return { guess, submitted, evaluation };
  });

  return (
    <main className="screen wordle-screen">
      <GameTopBar
        title={`${word.worldShortName} · Step 1 of 2`}
        streak={player.streak}
        stars={stars}
        onBack={onBack}
      />

      <section className="wordle-content">
        <div className="learning-step-label">INDEPENDENT RECALL</div>

        <h1>Guess the Ojibwe word</h1>

        <div className="recall-hint">
          Hint: {word.categoryLabel}
        </div>

        <p className="wordle-hint">
          The English meaning is hidden until the recall attempt is over.
        </p>

        <div
          className="wordle-grid"
          style={{ "--answer-length": Math.max(answer.length, 4) }}
        >
          {displayRows.map((row, rowIndex) => (
            <div className="wordle-row" key={rowIndex}>
              {Array.from({ length: answer.length }).map((_, column) => {
                const letter = row.guess[column] || "";
                const state = row.submitted ? row.evaluation[column] : "";

                return (
                  <div className={`wordle-tile ${state}`} key={column}>
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="wordle-message">{message}</div>

        <div className="keyboard">
          {KEY_ROWS.map((row) => (
            <div className="keyboard-row" key={row}>
              {[...row].map((letter) => (
                <button
                  key={letter}
                  className={keyStates[letter] || ""}
                  onClick={() => addLetter(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}

          <div className="keyboard-actions">
            <button className="wide-key" onClick={submitGuess}>ENTER</button>
            <button className="wide-key" onClick={removeLetter}>⌫</button>
          </div>
        </div>

        <div className="timer">Time {formatTime(elapsed)}</div>
      </section>
    </main>
  );
}
