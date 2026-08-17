import GameTopBar from "./GameTopBar";
import SceneBackground from "./SceneBackground";
import AssetImage from "./AssetImage";
import Stars from "./Stars";
import { NWQ_ASSETS } from "../assets/assets";
import {
  isLessonComplete,
  isLessonUnlocked,
  isWordUnlocked,
  starsForWord
} from "../utils/gameData";

const STEP_SPACING = 150;
const START_Y = 95;

const BANK_TREES = [
  NWQ_ASSETS.decorations.trees.clusterA,
  NWQ_ASSETS.decorations.trees.tall,
  NWQ_ASSETS.decorations.trees.clusterB,
  NWQ_ASSETS.decorations.trees.smallCluster,
  NWQ_ASSETS.decorations.trees.clusterA
];

function trailPoint(index) {
  return {
    x: index % 2 === 0 ? 405 : 595,
    y: START_Y + index * STEP_SPACING
  };
}

function buildTrailPath(count) {
  if (count <= 0) return "";

  const points = Array.from({ length: count }, (_, index) => trailPoint(index));
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const middleY = (previous.y + current.y) / 2;

    path += ` C ${previous.x} ${middleY}, ${current.x} ${middleY}, ${current.x} ${current.y}`;
  }

  return path;
}

export default function LevelSelect({
  player,
  stars,
  world,
  onBack,
  onPlay
}) {
  return (
    <main className="screen level-screen forest-level-screen">
      <SceneBackground src={NWQ_ASSETS.backgrounds.levelSelect.forestTrailNight} fit="cover">
        <GameTopBar
          title={world.shortName.toUpperCase()}
          streak={player.streak}
          stars={stars}
          onBack={onBack}
        />

        <section className="world-title">
          <h1>WORLD {world.id} – {world.name.toUpperCase()}</h1>
          <p>
            {world.words.length} words · {world.lessons.length} lesson
            {world.lessons.length === 1 ? "" : "s"}
          </p>
        </section>

        <section className="lesson-stack forest-lesson-stack">
          {world.lessons.map((lesson, lessonIndex) => {
            const lessonUnlocked = isLessonUnlocked(player, world, lessonIndex);
            const lessonComplete = isLessonComplete(player, lesson);
            const trailHeight = Math.max(
              420,
              START_Y * 2 + Math.max(0, lesson.words.length - 1) * STEP_SPACING
            );
            const path = buildTrailPath(lesson.words.length);

            return (
              <article
                className={`lesson-panel forest-lesson-panel ${
                  !lessonUnlocked ? "lesson-panel-locked" : ""
                }`}
                key={lesson.id}
              >
                <header className="lesson-header forest-lesson-header">
                  <div>
                    <span>LESSON {lesson.number}</span>
                    <strong>
                      {lesson.words.length} word{lesson.words.length === 1 ? "" : "s"}
                    </strong>
                  </div>

                  <span className="lesson-state">
                    {lessonComplete ? "✓ COMPLETE" : lessonUnlocked ? "OPEN" : "LOCKED"}
                  </span>
                </header>

                <div
                  className="forest-trail-canvas"
                  style={{ height: `${trailHeight}px` }}
                >
                  <div className="forest-bank forest-bank-left" aria-hidden="true">
                    {BANK_TREES.map((src, index) => (
                      <AssetImage key={index} src={src} decorative className="forest-bank-tree" />
                    ))}
                  </div>
                  <div className="forest-bank forest-bank-right" aria-hidden="true">
                    {BANK_TREES.map((src, index) => (
                      <AssetImage key={index} src={src} decorative className="forest-bank-tree" />
                    ))}
                  </div>

                  <svg
                    className="curved-forest-trail"
                    viewBox={`0 0 1000 ${trailHeight}`}
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path className="trail-earth" d={path} />
                    <path className="trail-highlight" d={path} />
                  </svg>

                  {lesson.words.map((word, wordIndex) => {
                    const unlocked = isWordUnlocked(
                      player,
                      world,
                      lessonIndex,
                      wordIndex
                    );

                    const starCount = starsForWord(player, word.id);
                    const absoluteNumber = lessonIndex * 10 + wordIndex + 1;
                    const point = trailPoint(wordIndex);
                    const sideClass = wordIndex % 2 === 0 ? "step-left" : "step-right";
                    const isCurrent = unlocked && starCount === 0;

                    return (
                      <button
                        key={word.id}
                        className={`footstep-level trail-footstep ${sideClass} ${
                          !unlocked ? "footstep-locked" : ""
                        } ${isCurrent ? "footstep-current" : ""}`}
                        style={{
                          left: `${point.x / 10}%`,
                          top: `${point.y}px`
                        }}
                        disabled={!unlocked}
                        onClick={() => onPlay(word.id)}
                        title={
                          unlocked
                            ? `Hint: ${word.categoryLabel}`
                            : "Complete the previous word first"
                        }
                      >
                        <span className={`paw-token ${isCurrent ? "paw-token-gold" : "paw-token-green"}`}>
                          <strong className="footstep-number">{absoluteNumber}</strong>
                          {!unlocked && (
                            <AssetImage
                              src={NWQ_ASSETS.status.lockClosed}
                              decorative
                              className="footstep-lock-img"
                            />
                          )}
                        </span>

                        {unlocked && (
                          <div className="footstep-meta trail-footstep-meta">
                            <Stars count={starCount} />
                            <small className="category-mini-label">
                              {word.categoryLabel}
                            </small>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </section>
      </SceneBackground>
    </main>
  );
}
