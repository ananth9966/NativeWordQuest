import { useMemo, useState } from "react";
import GameTopBar from "./GameTopBar";
import SceneBackground from "./SceneBackground";
import { NWQ_ASSETS } from "../assets/assets";

const NUMBER_WORD_TO_DIGIT = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  ten: "10",
  eleven: "11",
  twelve: "12",
  twenty: "20",
  thirty: "30",
  forty: "40",
  fifty: "50",
  hundred: "100",
  thousand: "1,000"
};

function numberLabel(word) {
  return NUMBER_WORD_TO_DIGIT[word.english.trim().toLowerCase()] || word.english;
}

function shuffle(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function buildQuestion(numberWords) {
  const shuffledWords = shuffle(numberWords);
  const answer = shuffledWords[0];
  const distractors = shuffledWords.slice(1, 4);

  return {
    answer,
    choices: shuffle([answer, ...distractors])
  };
}

export default function MathMode({
  words,
  player,
  stars,
  onBack,
  onNavigate,
  onReset,
  activeScreen
}) {
  const numberWords = useMemo(
    () => words.filter((word) => word.category === "number"),
    [words]
  );

  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState({ correct: 0, attempted: 0 });

  const question = useMemo(
    () => (numberWords.length >= 4 ? buildQuestion(numberWords) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [numberWords, round]
  );

  return (
    <main className="screen quiz-screen">
      <SceneBackground src={NWQ_ASSETS.backgrounds.quiz.forestClearing} fit="cover">
        <GameTopBar
          title="MATH MODE"
          streak={player.streak}
          stars={stars}
          onBack={onBack}
          onNavigate={onNavigate}
          onReset={onReset}
          activeScreen={activeScreen}
        />

        {!question && (
          <section className="quiz-content">
            <h1>Not enough number words loaded yet to practice Math Mode.</h1>
          </section>
        )}

        {question && (
          <section className="quiz-content">
            <div className="learning-step-label">NUMBER WORD PRACTICE</div>

            <h1>Which Ojibwe word means this number?</h1>

            <div className="word-parchment">
              <strong>{numberLabel(question.answer)}</strong>
            </div>

            <p className="word-hint">
              Score: {score.correct}/{score.attempted}
            </p>

            <div className="answer-grid">
              {question.choices.map((choice, index) => {
                let state = "";

                if (selected === index) {
                  state = choice.id === question.answer.id ? "answer-correct" : "answer-wrong";
                } else if (selected !== null && choice.id === question.answer.id) {
                  state = "answer-correct";
                }

                return (
                  <button
                    key={choice.id}
                    className={`answer-button ${state}`}
                    onClick={() => {
                      if (selected !== null) return;

                      setSelected(index);
                      setScore((value) => ({
                        correct: value.correct + (choice.id === question.answer.id ? 1 : 0),
                        attempted: value.attempted + 1
                      }));
                    }}
                  >
                    <span>{String.fromCharCode(65 + index)}.</span>
                    <strong>{choice.ojibwe.toUpperCase()}</strong>
                    {state === "answer-correct" && <b>✓</b>}
                  </button>
                );
              })}
            </div>

            {selected !== null && (
              <section className="correct-panel">
                <div>
                  <strong>
                    {question.choices[selected].id === question.answer.id
                      ? "Correct!"
                      : "Not quite."}
                  </strong>
                  <span>
                    {question.answer.ojibwe.toUpperCase()} = {numberLabel(question.answer)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setSelected(null);
                    setRound((value) => value + 1);
                  }}
                >
                  Next Question <span>➜</span>
                </button>
              </section>
            )}
          </section>
        )}
      </SceneBackground>
    </main>
  );
}
