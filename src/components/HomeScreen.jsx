import GameTopBar from "./GameTopBar";
import SceneBackground from "./SceneBackground";
import AssetImage from "./AssetImage";
import { NWQ_ASSETS } from "../assets/assets";

export default function HomeScreen({
  player,
  stars,
  nextPlayable,
  hasSavedProgress,
  onContinue,
  onWorldMap,
  onDaily,
  onCollection,
  onReset
}) {
  const nextWorld = nextPlayable?.world?.shortName || "Word Quest";
  const nextLevel = nextPlayable?.word?.level || 1;

  const questTitle = hasSavedProgress
    ? "CONTINUE QUEST"
    : "BEGIN YOUR QUEST";

  return (
    <main className="screen home-screen">
      <SceneBackground
        src={NWQ_ASSETS.backgrounds.home.day}
        fit="cover"
      >
        <GameTopBar
          title=""
          streak={player.streak}
          stars={stars}
          onMenu={onReset}
        />

        <section className="hero-title">
          <AssetImage
            src={NWQ_ASSETS.decorations.eagle}
            decorative
            className="flying-eagle-img"
          />

          <h1>
            <span>NATIVE</span>
            <strong>WORD QUEST</strong>
          </h1>

          <p>Odaminodaa!</p>
          <p>Let's Play!</p>
        </section>

        <button
          className="btn-gold continue-button"
          onClick={onContinue}
        >
          <strong>{questTitle}</strong>

          <b className="continue-arrow">➜</b>
        </button>

        {nextPlayable && (
          <div className="quest-progress">
            <span>World : {nextWorld}</span>

            <span className="quest-progress-divider">•</span>

            <strong>Level : {nextLevel}</strong>
          </div>
        )}

        {!nextPlayable && hasSavedProgress && (
          <div className="quest-progress">
            <strong>Quest Complete!</strong>
          </div>
        )}

        <section
          className="home-menu"
          aria-label="Main game menu"
        >
          <button
            className="game-card"
            onClick={onWorldMap}
          >
            <AssetImage
              src={NWQ_ASSETS.gameplay.map}
              decorative
              className="game-card-icon-img"
            />

            <strong>WORLD MAP</strong>
          </button>

          <button
            className="game-card"
            onClick={onDaily}
          >
            <AssetImage
              src={NWQ_ASSETS.gameplay.target}
              decorative
              className="game-card-icon-img"
            />

            <strong>DAILY CHALLENGE</strong>
            <small>NOONGOM</small>
          </button>

          <button
            className="game-card"
            onClick={onCollection}
          >
            <AssetImage
              src={NWQ_ASSETS.gameplay.book}
              decorative
              className="game-card-icon-img"
            />

            <strong>WORD COLLECTION</strong>
          </button>
        </section>

        <p className="demo-note">
          Development prototype
        </p>
      </SceneBackground>
    </main>
  );
}