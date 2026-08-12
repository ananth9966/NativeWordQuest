import GameTopBar from "./GameTopBar";
import Stars from "./Stars";

export default function WordCollection({
  words,
  player,
  stars,
  onBack
}) {
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
        <p>
          {Object.keys(player.completed || {}).length}/{words.length} mastered
        </p>
      </section>

      <section className="collection-grid">
        {words.map((word) => {
          const starCount = Number(player.completed?.[word.level] || 0);
          const unlocked = Number(word.level) <= Number(player.currentLevel);

          return (
            <article
              className={`word-collection-card ${!unlocked ? "collection-locked" : ""}`}
              key={word.id}
            >
              <div className="collection-icon">
                {word.english === "Bear"
                  ? "🐻"
                  : word.english === "Beaver"
                    ? "🦫"
                    : word.english === "Rabbit"
                      ? "🐇"
                      : word.english === "Eagle"
                        ? "🦅"
                        : "🫎"}
              </div>

              {unlocked ? (
                <>
                  <h2>{word.ojibwe.toUpperCase()}</h2>
                  <p>{word.english}</p>
                  <Stars count={starCount} />
                </>
              ) : (
                <>
                  <h2>?????</h2>
                  <p>Complete Level {word.level - 1}</p>
                  <span className="collection-lock">🔒</span>
                </>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}
