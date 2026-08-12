import Stars from "./Stars";

function formatTime(seconds = 0) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");

  const remainder = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}:${remainder}`;
}

export default function LevelComplete({
  word,
  result,
  totalLevels,
  onReplay,
  onNext,
  onMap
}) {
  const isLastLevel =
    Number(word.level) >= totalLevels;

  return (
    <main className="screen complete-screen">
      <div
        className="celebration-particles"
        aria-hidden="true"
      >
        {Array.from({
          length: 24
        }).map((_, index) => (
          <i
            key={index}
            style={{
              "--i": index
            }}
          />
        ))}
      </div>

      <section className="complete-content">
        <h1>LEVEL COMPLETE!</h1>

        <Stars
          count={result.stars}
          large
        />

        <h2>
          {word.ojibwe.toUpperCase()}
        </h2>

        <h3>{word.english}</h3>

        <section className="score-details">
          <div>
            <small>Recall Guesses</small>
            <strong>
              {result.guesses}
            </strong>
          </div>

          <div>
            <small>
              Recognition Attempts
            </small>
            <strong>
              {result.recognitionAttempts ||
                1}
            </strong>
          </div>

          <div>
            <small>Score</small>
            <strong>
              {result.score}
            </strong>
          </div>

          <div>
            <small>Recall Time</small>
            <strong>
              {formatTime(
                result.elapsed
              )}
            </strong>
          </div>
        </section>

        <p className="mastery-message">
          {result.stars === 3
            ? "Independent recall demonstrated."
            : result.stars === 2
              ? "Developing recall — keep practicing."
              : "Recognition reinforced — replay to improve recall."}
        </p>

        <section className="complete-actions">
          <button
            className="action-replay"
            onClick={onReplay}
          >
            Replay
          </button>

          <button
            className="action-next"
            onClick={
              isLastLevel
                ? onMap
                : onNext
            }
          >
            {isLastLevel
              ? "Finish World"
              : "Next Level"}
          </button>

          <button
            className="action-map"
            onClick={onMap}
          >
            World Map
          </button>
        </section>
      </section>
    </main>
  );
}
