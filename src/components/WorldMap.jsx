import GameTopBar from "./GameTopBar";
import { getWorldProgress } from "../utils/gameData";

const WORLD_ICONS = {
  1: "🐻",
  2: "🔢",
  3: "🌦️",
  4: "🏃",
  5: "👨‍👩‍👧",
  6: "💬",
  7: "🥣",
  8: "🏠",
  9: "🌲",
  10: "❤️",
  11: "✨"
};

export default function WorldMap({
  player,
  stars,
  worlds,
  onBack,
  onWorld
}) {
  return (
    <main className="screen scalable-map-screen">
      <GameTopBar
        title="WORLD MAP"
        streak={player.streak}
        stars={stars}
        onBack={onBack}
      />

      <div className="wood-sign">WORLD MAP</div>

      <section className="dynamic-world-grid">
        {worlds.map((world) => {
          const progress = getWorldProgress(player, world);

          return (
            <button
              key={world.id}
              className="dynamic-world-card"
              onClick={() => onWorld(world.id)}
            >
              <span className="world-number">WORLD {world.id}</span>
              <span className="world-card-icon">
                {WORLD_ICONS[world.id] || "✨"}
              </span>
              <strong>{world.name}</strong>
              <span className="world-word-count">
                {world.words.length} words · {world.lessons.length} lesson
                {world.lessons.length === 1 ? "" : "s"}
              </span>

              <div className="world-progress-track">
                <span style={{ width: `${progress.percent}%` }} />
              </div>

              <small>
                {progress.completed}/{progress.total} mastered
              </small>
            </button>
          );
        })}
      </section>
    </main>
  );
}
