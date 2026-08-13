export const LESSON_SIZE = 10;

const CATEGORY_ALIASES = {
  "animals": "animal",
  "bodypart": "body part",
  "body parts": "body part",
  "verd": "verb",
  "emotion": "feeling",
  "emotions": "feeling",
  "household oject": "household",
  "household object": "household",
  "household objects": "household",
  "oject": "household",
  "object": "household",
  "in a house": "household",
  "time of day": "part of day",
  "bug/bug related": "insect",
  "bug": "insect",
  "bugs": "insect",
  "outside": "nature",
  "type of tree": "nature",
  "vechicle": "vehicle",
  "illness related": "health",
  "a seasoning": "seasoning",
  "used for cooking": "food"
};

export const WORLD_DEFINITIONS = [
  { id: 1, name: "Animals & Insects", shortName: "Animals", categories: ["animal", "insect"] },
  { id: 2, name: "Numbers & Amounts", shortName: "Numbers", categories: ["number", "amount"] },
  { id: 3, name: "Weather, Seasons & Time", shortName: "Weather & Time", categories: ["weather", "season", "part of day", "frequency"] },
  { id: 4, name: "Actions", shortName: "Actions", categories: ["verb", "command"] },
  { id: 5, name: "People, Family & Body", shortName: "People & Family", categories: ["family", "person", "noun", "body part", "physical trait"] },
  { id: 6, name: "Conversation", shortName: "Conversation", categories: ["conversational", "greeting", "question word", "location"] },
  { id: 7, name: "Food & Drink", shortName: "Food", categories: ["food", "drink", "seasoning"] },
  { id: 8, name: "Home, Clothing & Travel", shortName: "Home & Clothing", categories: ["household", "clothing", "vehicle"] },
  { id: 9, name: "Land & Nature", shortName: "Nature", categories: ["nature", "place", "color"] },
  { id: 10, name: "Feelings & Descriptions", shortName: "Feelings", categories: ["feeling", "description", "health"] },
  { id: 11, name: "More Words", shortName: "More Words", categories: ["other"] }
];

export function normalizeCategory(category = "") {
  const value = String(category)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (!value) return "other";
  return CATEGORY_ALIASES[value] || value;
}

export function displayCategory(category = "") {
  return normalizeCategory(category)
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join(" ");
}

function slugify(value = "") {
  return String(value)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createWordKey(row, index) {
  if (row.id && String(row.id).trim()) {
    return String(row.id).trim();
  }

  const base = slugify(`${row.ojibwe || ""}-${row.english || ""}-${row.category || ""}`);
  return base || `word-${index + 1}`;
}

export function getWorldForCategory(category) {
  const normalized = normalizeCategory(category);

  return (
    WORLD_DEFINITIONS.find((world) => world.categories.includes(normalized)) ||
    WORLD_DEFINITIONS[WORLD_DEFINITIONS.length - 1]
  );
}

function isMetadataRow(row) {
  const ojibwe = String(row.ojibwe || "").trim();
  const english = String(row.english || "").trim();

  if (!ojibwe || !english) return true;
  if (/^finalized\b/i.test(ojibwe)) return true;

  return false;
}

export function prepareWords(rawRows) {
  const seenKeys = new Map();

  return rawRows
    .filter((row) => !isMetadataRow(row))
    .map((row, index) => {
      const category = normalizeCategory(row.category);
      const world = getWorldForCategory(category);

      let key = createWordKey({ ...row, category }, index);
      const duplicateCount = seenKeys.get(key) || 0;
      seenKeys.set(key, duplicateCount + 1);

      if (duplicateCount > 0) {
        key = `${key}-${duplicateCount + 1}`;
      }

      return {
        id: key,
        ojibwe: String(row.ojibwe || "").trim(),
        english: String(row.english || "").trim(),
        category,
        categoryLabel: displayCategory(category),
        worldId: world.id,
        worldName: world.name,
        worldShortName: world.shortName,
        sourceRow: row._rowNumber || index + 2
      };
    });
}

export function buildWorlds(words, lessonSize = LESSON_SIZE) {
  return WORLD_DEFINITIONS
    .map((definition) => {
      const worldWords = words.filter((word) => word.worldId === definition.id);
      const lessons = [];

      for (let start = 0; start < worldWords.length; start += lessonSize) {
        lessons.push({
          id: Math.floor(start / lessonSize) + 1,
          number: Math.floor(start / lessonSize) + 1,
          words: worldWords.slice(start, start + lessonSize)
        });
      }

      return { ...definition, words: worldWords, lessons };
    })
    .filter((world) => world.words.length > 0);
}

export function isWordComplete(player, wordId) {
  return Number(player.completed?.[wordId]?.stars || 0) > 0;
}

export function starsForWord(player, wordId) {
  return Number(player.completed?.[wordId]?.stars || 0);
}

export function isLessonComplete(player, lesson) {
  return lesson.words.length > 0 &&
    lesson.words.every((word) => isWordComplete(player, word.id));
}

export function isLessonUnlocked(player, world, lessonIndex) {
  if (lessonIndex === 0) return true;
  return isLessonComplete(player, world.lessons[lessonIndex - 1]);
}

export function isWordUnlocked(player, world, lessonIndex, wordIndex) {
  if (!isLessonUnlocked(player, world, lessonIndex)) return false;
  if (wordIndex === 0) return true;

  const lesson = world.lessons[lessonIndex];
  return isWordComplete(player, lesson.words[wordIndex - 1].id);
}

export function getNextPlayableWord(player, worlds) {
  for (const world of worlds) {
    for (let lessonIndex = 0; lessonIndex < world.lessons.length; lessonIndex += 1) {
      const lesson = world.lessons[lessonIndex];

      if (!isLessonUnlocked(player, world, lessonIndex)) continue;

      for (let wordIndex = 0; wordIndex < lesson.words.length; wordIndex += 1) {
        const word = lesson.words[wordIndex];

        if (
          isWordUnlocked(player, world, lessonIndex, wordIndex) &&
          !isWordComplete(player, word.id)
        ) {
          return { word, world, lessonIndex, wordIndex };
        }
      }
    }
  }

  const firstWorld = worlds[0];
  const firstWord = firstWorld?.lessons?.[0]?.words?.[0];

  return firstWord
    ? { word: firstWord, world: firstWorld, lessonIndex: 0, wordIndex: 0 }
    : null;
}

export function getWorldProgress(player, world) {
  const completed = world.words.filter((word) =>
    isWordComplete(player, word.id)
  ).length;

  return {
    completed,
    total: world.words.length,
    percent: world.words.length
      ? Math.round((completed / world.words.length) * 100)
      : 0
  };
}
