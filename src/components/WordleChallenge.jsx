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
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function WordleChallenge({
  word,
  level,
  player,
  stars,
  onBack,
  onComplete
}) {
  const answer = word.ojibwe.toUpperCase();
  const [guesses, setGuesses] = useState([]);
  const [current, setCurrent] = useState("");
  const [message, setMessage] = useState("Type the Ojibwe word you just practiced.");
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  const solved = guesses.some((guess) => guess === answer);

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
    if (solved || guesses.length >= 6) return;

    if (current.length < answer.length) {
      setCurrent((value) => value + letter);
      setMessage("");
    }
  }

  function removeLetter() {
    if (solved) return;
    setCurrent((value) => value.slice(0, -1));
  }

  function submitGuess() {
    if (solved) return;

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

      setMessage("Correct! Level complete.");

      window.setTimeout(() => {
        onComplete({
          guesses: guessCount,
          stars: earnedStars,
          score,
          elapsed
        });
      }, 900);

      return;
    }

    if (nextGuesses.length >= 6) {
      setMessage(`The answer was ${answer}. Try the level again.`);
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

  const totalRows = 6;
  const displayRows = Array.from({ length: totalRows }).map((_, rowIndex) => {
    const isCurrentRow = rowIndex === guesses.length && !solved;
    const guess = guesses[rowIndex] || (isCurrentRow ? current : "");
    const submitted = Boolean(guesses[rowIndex]);
    const evaluation = submitted ? evaluateGuess(guess, answer) : [];

    return { guess, submitted, evaluation };
  });

  return (
    <main className="screen wordle-screen">
      <GameTopBar
        title={`Level ${level} · Word Challenge`}
        streak={player.streak}
        stars={stars}
        onBack={onBack}
      />

      <section className="wordle-content">
        <h1>
          Meaning: <strong>{word.english}</strong>
        </h1>

        <p className="wordle-hint">{word.hint}</p>

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
            <button className="wide-key" onClick={submitGuess}>
              ENTER
            </button>
            <button className="wide-key" onClick={removeLetter}>
              ⌫
            </button>
          </div>
        </div>

        <div className="timer">Time {formatTime(elapsed)}</div>
      </section>
    </main>
  );
}
