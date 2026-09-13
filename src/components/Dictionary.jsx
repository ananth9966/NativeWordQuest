import { useMemo, useState } from "react";
import GameTopBar from "./GameTopBar";

export default function Dictionary({
  words,
  player,
  stars,
  onBack,
  onNavigate,
  onReset,
  activeScreen
}) {
  const [query, setQuery] = useState("");

  const sorted = useMemo(
    () => [...words].sort((a, b) => a.ojibwe.localeCompare(b.ojibwe)),
    [words]
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();

    if (!needle) return sorted;

    return sorted.filter(
      (word) =>
        word.ojibwe.toLowerCase().includes(needle) ||
        word.english.toLowerCase().includes(needle) ||
        word.categoryLabel.toLowerCase().includes(needle)
    );
  }, [sorted, query]);

  return (
    <main className="screen collection-screen">
      <GameTopBar
        title="DICTIONARY"
        streak={player.streak}
        stars={stars}
        onBack={onBack}
        onNavigate={onNavigate}
        onReset={onReset}
        activeScreen={activeScreen}
      />

      <section className="collection-title">
        <h1>Ojibwe Dictionary</h1>
        <p>{words.length} words · full reference, nothing locked</p>

        <input
          className="collection-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search Ojibwe, English, or category"
          aria-label="Search dictionary"
        />
      </section>

      <section className="collection-grid">
        {filtered.map((word) => (
          <article className="word-collection-card" key={word.id}>
            <span className="collection-world-chip">W{word.worldId}</span>

            <h2>{word.ojibwe.toUpperCase()}</h2>
            <p>{word.english}</p>
            <small>{word.categoryLabel}</small>
          </article>
        ))}

        {!filtered.length && (
          <p className="dictionary-empty">No words match &quot;{query}&quot;.</p>
        )}
      </section>
    </main>
  );
}
