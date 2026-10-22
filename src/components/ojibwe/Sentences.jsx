import GameTopBar from "../GameTopBar";

export default function Sentences({
  player,
  stars,
  onBack,
  onNavigate,
  onReset,
  activeScreen
}) {
  return (
    <main className="screen sentences-screen">
      <GameTopBar
        title="SENTENCES"
        streak={player.streak}
        stars={stars}
        onBack={onBack}
        onNavigate={onNavigate}
        onReset={onReset}
        activeScreen={activeScreen}
      />
    </main>
  );
}
