import Stars from "./Stars";
import SceneBackground from "./SceneBackground";
import AssetImage from "./AssetImage";
import { NWQ_ASSETS } from "../assets/assets";

function formatTime(seconds = 0) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export default function LevelComplete({
  word,
  result,
  onReplay,
  onNext,
  onMap
}) {
  return (
    <main className="screen complete-screen">
      <SceneBackground src={NWQ_ASSETS.backgrounds.complete.starryCampfire} fit="cover">
        <AssetImage
          src={NWQ_ASSETS.rewards.featherPairA}
          decorative
          className="complete-feather complete-feather-left"
        />
        <AssetImage
          src={NWQ_ASSETS.rewards.featherPairB}
          decorative
          className="complete-feather complete-feather-right"
        />

        <div className="celebration-particles" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, index) => (
            <i key={index} style={{ "--i": index }} />
          ))}
        </div>

        <section className="complete-content">
          <div className="banner-plank complete-banner">
            <span>LEVEL COMPLETE!</span>
          </div>

          <Stars count={result.stars} large />

          <h2>{word.ojibwe.toUpperCase()}</h2>
          <h3>{word.english}</h3>

          <p className="completion-category">
            {word.worldName} · {word.categoryLabel}
          </p>

          <section className="score-details">
            <div>
              <small>Recall Guesses</small>
              <strong>{result.guesses}</strong>
            </div>

            <div>
              <small>Recognition Attempts</small>
              <strong>{result.recognitionAttempts || 1}</strong>
            </div>

            <div>
              <small>Score</small>
              <strong>{result.score}</strong>
            </div>

            <div>
              <small>Recall Time</small>
              <strong>{formatTime(result.elapsed)}</strong>
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
            <button className="btn-plank action-replay" onClick={onReplay}>Replay</button>
            <button className="btn-green action-next" onClick={onNext}>Continue Quest</button>
            <button className="btn-plank action-map" onClick={onMap}>World Map</button>
          </section>
        </section>
      </SceneBackground>
    </main>
  );
}
