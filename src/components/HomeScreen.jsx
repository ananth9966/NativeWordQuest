import GameTopBar from "./GameTopBar";

export default function HomeScreen({
  player,
  stars,
  nextPlayable,
  onContinue,
  onWorldMap,
  onDaily,
  onCollection,
  onReset
}) {
  const nextWorld = nextPlayable?.world?.shortName || "Word Journey";

  return (
    <main className="screen home-screen">
      <GameTopBar title="" streak={player.streak} stars={stars} onMenu={onReset} />

      <section className="hero-title">
        <div className="flying-eagle" aria-hidden="true">🦅</div>

        <h1>
          <span>OJIBWE</span>
          <strong>WORD JOURNEY</strong>
        </h1>

        <p>Odaminodaa! Let's Play!</p>
      </section>

      <button className="wood-button continue-button" onClick={onContinue}>
        <span className="wood-knot" />
        <span>
          <strong>CONTINUE JOURNEY</strong>
          <small>{nextPlayable ? `${nextWorld} · Next word` : "Journey complete"}</small>
        </span>
        <b className="continue-arrow">➜</b>
      </button>

      <section className="home-menu" aria-label="Main game menu">
        <button className="game-card card-blue" onClick={onWorldMap}>
          <span className="game-card-icon">🗺️</span>
          <strong>WORLD MAP</strong>
        </button>

        <button className="game-card card-red" onClick={onDaily}>
          <span className="game-card-icon">🎯</span>
          <strong>DAILY CHALLENGE</strong>
          <small>NOONGOM</small>
        </button>

        <button className="game-card card-green" onClick={onCollection}>
          <span className="game-card-icon">📖</span>
          <strong>WORD COLLECTION</strong>
        </button>
      </section>

      <div className="canoe-decoration" aria-hidden="true">🛶</div>

      <p className="demo-note">
        TSV-driven prototype · Progress is saved in this browser
      </p>
    </main>
  );
}
