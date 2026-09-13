import { useState } from "react";
import SceneBackground from "./SceneBackground";
import AssetImage from "./AssetImage";
import { NWQ_ASSETS } from "../assets/assets";

export default function TitleScreen({ onPlay }) {
  const [language, setLanguage] = useState("ojibwe");

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
          </section>

          <div className="language-select">
            <label htmlFor="language">Choose a Language:</label>
            <select
              id="language"
              name="Language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
            >
              <option value="ojibwe">Ojibwe</option>
              <option value="michif">Michif</option>
              <option value="chacotaw">Chacotaw</option>
            </select>
          </div>

          <button
            className="btn-gold title-play-button"
            onClick={() => onPlay(language)}
          >
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
