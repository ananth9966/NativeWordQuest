import SceneBackground from "./SceneBackground";
import { NWQ_ASSETS } from "../assets/assets";

const LANGUAGE_LABELS = {
  michif: "Michif",
  chacotaw: "Chacotaw"
};

export default function ComingSoonScreen({ language, onBack }) {
  const label = LANGUAGE_LABELS[language] || "This language";

  return (
    <main className="screen title-screen">
      <SceneBackground src={NWQ_ASSETS.backgrounds.home.goldenHour} fit="cover">
        <div className="title-screen-content">
          <section className="hero-title">
            <h1>
              <span>{label.toUpperCase()}</span>
              <strong>WORD QUEST</strong>
            </h1>
          </section>

          <div className="coming-soon-panel">
            <strong>Coming soon!</strong>
            <small>{label} Word Quest is still being added to the game.</small>
          </div>

          <button className="btn-gold title-play-button" onClick={onBack}>
            <strong>BACK</strong>
          </button>
        </div>
      </SceneBackground>
    </main>
  );
}
