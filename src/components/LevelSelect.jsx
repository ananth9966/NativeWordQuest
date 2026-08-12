import GameTopBar from "./GameTopBar";
import Stars from "./Stars";

export default function LevelSelect({
  player,
  stars,
  totalLevels,
  onBack,
  onPlay
}) {
  const currentLevel = Number(player.currentLevel || 1);

  return (
    <main className="screen level-screen">
      <GameTopBar
        title="AWESIINYAG"
        streak={player.streak}
        stars={stars}
        onBack={onBack}
      />

      <section className="world-title">
        <h1>WORLD 2 – AWESIINYAG</h1>
        <p>Animals</p>
      </section>

      <section className="level-grid">
        {Array.from({ length: totalLevels }).map((_, index) => {
          const level = index + 1;
          const locked = level > currentLevel;
          const completedStars = Number(player.completed?.[level] || 0);

          return (
            <button
              key={level}
              className={`level-card ${locked ? "level-card-locked" : ""} ${
                level === currentLevel ? "level-card-current" : ""
              }`}
              disabled={locked}
              onClick={() => onPlay(level)}
            >
              <strong>{level}</strong>

              {locked ? (
                <span className="level-lock">🔒</span>
              ) : (
                <Stars count={completedStars} />
              )}
            </button>
          );
        })}
      </section>

      <section className="challenge-card">
        <div className="challenge-animal" aria-hidden="true">
          🦫
        </div>

        <div className="challenge-copy">
          <h2>WORLD CHALLENGE</h2>
          <p>
            Complete each word through recognition and recall to earn all three
            stars.
          </p>
        </div>

        <button className="play-button" onClick={() => onPlay(currentLevel)}>
          PLAY
        </button>
      </section>
    </main>
  );
}
