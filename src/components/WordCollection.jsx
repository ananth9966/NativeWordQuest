import { useMemo, useState } from "react";
import GameTopBar from "./GameTopBar";
import AssetImage from "./AssetImage";
import Stars from "./Stars";
import { NWQ_ASSETS } from "../assets/assets";
import { isWordComplete, starsForWord } from "../utils/gameData";

export default function WordCollection({
  words,
  worlds,
  player,
  stars,
  onBack
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return words;

    return words.filter(
      (word) =>
        word.ojibwe.toLowerCase().includes(needle) ||
        word.english.toLowerCase().includes(needle) ||
        word.categoryLabel.toLowerCase().includes(needle)
    );
  }, [words, query]);

  const mastered = words.filter((word) =>
    isWordComplete(player, word.id)
  ).length;

  return (
    <main className="screen collection-screen">
      <GameTopBar
        title="WORD COLLECTION"
        streak={player.streak}
        stars={stars}
        onBack={onBack}
      />

      <section className="collection-title">
        <h1>My Word Collection</h1>
        <p>{mastered}/{words.length} mastered · {worlds.length} worlds</p>

        <input
          className="collection-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Ojibwe, English, or category"
          aria-label="Search word collection"
        />
      </section>

      <section className="collection-grid scalable-collection-grid">
        {filtered.map((word) => {
          const starCount = starsForWord(player, word.id);
          const masteredWord = starCount > 0;

          return (
            <article
              className={`word-collection-card ${
                !masteredWord ? "collection-locked" : ""
              }`}
              key={word.id}
            >
              <span className="collection-world-chip">W{word.worldId}</span>

              {masteredWord ? (
                <>
                  <h2>{word.ojibwe.toUpperCase()}</h2>
                  <p>{word.english}</p>
                  <small>{word.categoryLabel}</small>
                  <div><Stars count={starCount} /></div>
                </>
              ) : (
                <>
                  <h2>?????</h2>
                  <p>{word.categoryLabel}</p>
                  <AssetImage src={NWQ_ASSETS.status.lockClosed} decorative className="collection-lock-img" />
                </>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
