import SceneBackground from "./SceneBackground";
import AssetImage from "./AssetImage";
import { NWQ_ASSETS } from "../assets/assets";

export default function TitleScreen({ onPlay }) {
  return (
    <main className="screen title-screen">
      <SceneBackground src={NWQ_ASSETS.backgrounds.home.goldenHour} fit="cover">
        <AssetImage
          src={NWQ_ASSETS.decorations.eagle}
          decorative
          className="flying-eagle-img"
        />

        <div className="title-screen-content">
          <section className="hero-title">
            <h1>
              <span>NATIVE</span>
              <strong>WORD QUEST</strong>
            </h1>
            <p>Odaminodaa!</p>
              <p>Let's Play!</p>
          </section>

          <button className="btn-gold title-play-button" onClick={onPlay}>
            <strong>START</strong>
          </button>
        </div>

        <p className="demo-note">
          TSV-driven prototype · Progress is saved in this browser
        </p>
      </SceneBackground>
    </main>
  );
}
