import GameTopBar from "./GameTopBar";
import SceneBackground from "./SceneBackground";
import AssetImage from "./AssetImage";
import Stars from "./Stars";
import { NWQ_ASSETS } from "../assets/assets";
import { getWorldProgress, starsForWord } from "../utils/gameData";

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

const STEP_SPACING = 210;
const START_Y = 120;
const X_PATTERN = [300, 700, 520, 180, 780, 460];

function trailPoint(index) {
  return {
    x: X_PATTERN[index % X_PATTERN.length],
    y: START_Y + index * STEP_SPACING
  };
}

function buildTrailPath(points) {
  if (!points.length) return "";

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const middleY = (previous.y + current.y) / 2;

    path += ` C ${previous.x} ${middleY}, ${current.x} ${middleY}, ${current.x} ${current.y}`;
  }

  return path;
}

function worldStarRating(player, world) {
  if (!world.words.length) return 0;

  const earned = world.words.reduce(
    (sum, word) => sum + starsForWord(player, word.id),
    0
  );

  return Math.round((earned / (world.words.length * 3)) * 3);
}

export default function WorldMap({
  player,
  stars,
  worlds,
  onBack,
  onWorld
}) {
  const points = worlds.map((_, index) => trailPoint(index));
  const path = buildTrailPath(points);
  const trailHeight = START_Y * 2 + Math.max(0, worlds.length - 1) * STEP_SPACING;

  return (
    <main className="screen scalable-map-screen world-path-screen">
      <SceneBackground src={NWQ_ASSETS.backgrounds.worldMap.tipiWaterfallDay} fit="cover">
        <GameTopBar
          title="WORLD MAP"
          streak={player.streak}
          stars={stars}
          onBack={onBack}
        />

        <div className="banner-plank world-map-banner">
          <span>WORLD MAP</span>
        </div>

        <div className="world-path-canvas" style={{ height: `${trailHeight}px` }}>
          <svg
            className="world-path-svg"
            viewBox={`0 0 1000 ${trailHeight}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="world-path-earth" d={path} />
            <path className="world-path-highlight" d={path} />
          </svg>

          {worlds.map((world, index) => {
            const progress = getWorldProgress(player, world);
            const point = points[index];
            const rating = worldStarRating(player, world);
            const complete = progress.total > 0 && progress.completed === progress.total;

            return (
              <button
                key={world.id}
                className={`world-node ${complete ? "world-node-complete" : ""}`}
                style={{
                  left: `${point.x / 10}%`,
                  top: `${point.y}px`
                }}
                onClick={() => onWorld(world.id)}
              >
                <span className={`world-node-token paw-token ${complete ? "paw-token-gold" : "paw-token-green"}`}>
                  <span className="world-node-icon">{WORLD_ICONS[world.id] || "✨"}</span>
                  <strong className="world-node-number">{world.id}</strong>
                </span>

                <span className="world-node-meta">
                  <strong>{world.shortName}</strong>
                  <Stars count={rating} />
                  <small>{progress.completed}/{progress.total}</small>
                </span>
              </button>
            );
          })}
        </div>
      </SceneBackground>
    </main>
  );
}
