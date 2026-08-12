import GameTopBar from "./GameTopBar";
import Stars from "./Stars";

const POSITIONS = [
  { x: 22, y: 22 },
  { x: 39, y: 35 },
  { x: 57, y: 29 },
  { x: 72, y: 49 },
  { x: 85, y: 64 }
];

export default function WorldMap({
  player,
  stars,
  totalLevels,
  onBack,
  onLevels,
  onLevel
}) {
  const currentLevel = Number(player.currentLevel || 1);

  return (
    <main className="screen map-screen">
      <GameTopBar
        title="WORLD MAP"
        streak={player.streak}
        stars={stars}
        onBack={onBack}
      />

      <div className="wood-sign">WORLD MAP</div>

      <aside className="world-sidebar">
        <button className="world-tab completed-world">
          <span>WORLD 1</span>
          <small>BOOZHOO!</small>
        </button>

        <button className="world-tab active-world" onClick={onLevels}>
          <span>WORLD 2</span>
          <small>AWESIINYAG</small>
        </button>

        <button className="world-tab locked-world">
          <span>🔒 WORLD 3</span>
          <small>AKI</small>
        </button>

        <button className="world-tab locked-world">
          <span>🔒 WORLD 4</span>
          <small>FAMILY & PEOPLE</small>
        </button>

        <button className="world-tab locked-world">
          <span>🔒 WORLD 5</span>
          <small>ACTIONS</small>
        </button>
      </aside>

      <section className="journey-map" aria-label="Level path">
        <svg className="journey-line" viewBox="0 0 1000 650" preserveAspectRatio="none">
          <path d="M150 140 C280 180 270 310 430 285 S560 185 650 325 S790 425 890 510" />
        </svg>

        {Array.from({ length: totalLevels }).map((_, index) => {
          const level = index + 1;
          const pos = POSITIONS[index] || {
            x: 20 + index * 15,
            y: 25 + index * 8
          };
          const locked = level > currentLevel;
          const completedStars = Number(player.completed?.[level] || 0);

          return (
            <button
              key={level}
              className={`map-level ${locked ? "locked-map-level" : ""} ${
                level === currentLevel ? "current-map-level" : ""
              }`}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              disabled={locked}
              onClick={() => onLevel(level)}
            >
              <span>{locked ? "🔒" : level}</span>
              {!locked && completedStars > 0 && (
                <span className="map-level-stars">
                  <Stars count={completedStars} />
                </span>
              )}
            </button>
          );
        })}

        <section className="map-progress-panel">
          <span className="progress-star">★</span>
          <div>
            <strong>
              {stars}/{totalLevels * 3}
            </strong>
            <small>Stars Collected</small>
          </div>
        </section>

        <button className="challenge-stone" onClick={onLevels}>
          CHALLENGE
        </button>
      </section>
    </main>
  );
}
