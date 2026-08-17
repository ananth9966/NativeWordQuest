/**
 * NativeWordQuest asset helper.
 *
 * IMPORTANT:
 * Assets live in public/assets, so use import.meta.env.BASE_URL.
 * This works locally and on GitHub Pages, including /NativeWordQuest/.
 */

export const assetUrl = (relativePath) =>
  `${import.meta.env.BASE_URL}assets/${relativePath}`;

export const NWQ_ASSETS = {
  backgrounds: {
    home: {
      day: "backgrounds/home/home-lakeside-tipi-day.webp",
      goldenHour: "backgrounds/home/home-lakeside-golden-hour.webp",
    },
    worldMap: {
      waterfallDay: "backgrounds/world-map/world-map-river-waterfall-day.webp",
      tipiWaterfallDay: "backgrounds/world-map/world-map-tipi-waterfall-day.webp",
      auroraNight: "backgrounds/world-map/world-map-aurora-night.webp",
    },
    levelSelect: {
      forestTrailNight: "backgrounds/level-select/level-select-forest-trail-night.webp",
      lakesideTwilight: "backgrounds/level-select/level-select-lakeside-twilight.webp",
    },
    quiz: {
      forestClearing: "backgrounds/quiz/quiz-forest-clearing.webp",
      twilightLake: "backgrounds/quiz/quiz-twilight-lake.webp",
    },
    wordle: {
      lakeDusk: "backgrounds/wordle/wordle-lake-dusk.webp",
      moonlitLake: "backgrounds/wordle/wordle-moonlit-lake.webp",
    },
    complete: {
      starryCampfire: "backgrounds/level-complete/complete-starry-campfire.webp",
      twilightCampfire: "backgrounds/level-complete/complete-twilight-campfire.webp",
    },
  },

  navigation: {
    menu: "icons/navigation/icon-menu.png",
    back: "icons/navigation/icon-back.png",
    profile: "icons/navigation/icon-profile.png",
    next: "icons/navigation/icon-next.png",
    home: "icons/navigation/icon-home.png",
    settings: "icons/navigation/icon-settings.png",
  },

  gameplay: {
    speaker: "icons/gameplay/icon-speaker.png",
    map: "icons/gameplay/icon-map.png",
    book: "icons/gameplay/icon-book.png",
    target: "icons/gameplay/icon-target.png",
    play: "icons/gameplay/icon-play.png",
    replay: "icons/gameplay/icon-replay.png",
  },

  status: {
    lockClosed: "icons/status/icon-lock-closed.png",
    lockOpen: "icons/status/icon-lock-open.png",
    heartFull: "icons/status/icon-heart-full.png",
    heartEmpty: "icons/status/icon-heart-empty.png",
    streakFire: "icons/status/icon-streak-fire.png",
  },

  rewardIcons: {
    featherCoin: "icons/rewards/icon-feather-coin.png",
    star: "icons/rewards/icon-star.png",
  },

  rewards: {
    starGold: "rewards/stars/star-gold-single-glow.png",
    threeStars: "rewards/stars/star-gold-triple-victory.png",
    starLocked: "rewards/stars/star-locked-silver.png",
    starFeatherEmblem: "rewards/emblems/star-feather-victory-emblem.png",
    featherPairA: "rewards/feathers/feather-pair-ornament-a.png",
    featherPairB: "rewards/feathers/feather-pair-ornament-b.png",
  },

  ui: {
    bannerLarge: "ui/banners/banner-wood-hanging-large.png",
    bannerSmall: "ui/banners/banner-wood-hanging-small.png",
    plankSmall: "ui/banners/banner-wood-plank-small.png",
    curvedFeatherBanner: "ui/banners/banner-curved-feather.png",

    greenPlayButton: "ui/buttons/button-green-play-wide.png",
    greenButton: "ui/buttons/button-green-wide.png",
    goldButton: "ui/buttons/button-gold-wide.png",

    parchmentPanel: "ui/panels/panel-parchment-large.png",
    challengeBeaverPanel: "ui/panels/panel-challenge-beaver.png",
    progressStarPanel: "ui/panels/panel-progress-star.png",
    tabLarge: "ui/panels/panel-tab-large.png",
    tabSmall: "ui/panels/panel-tab-small.png",

    worldCard: "ui/cards/card-world-landscape.png",
  },

  decorations: {
    tipis: {
      campCluster: "decorations/tipis/tipi-camp-cluster-two-fire.png",
      single: "decorations/tipis/tipi-single-tree-cluster.png",
    },
    canoe: "decorations/canoes/canoe-water-edge.png",
    campfire: "decorations/campfires/campfire-large.png",
    beaver: "decorations/animals/beaver-friendly.png",
    eagle: "decorations/animals/eagle-flying.png",

    trees: {
      clusterA: "decorations/trees/tree-cluster-a.png",
      clusterB: "decorations/trees/tree-cluster-b.png",
      tall: "decorations/trees/tree-tall-single.png",
      smallCluster: "decorations/trees/tree-cluster-small.png",
    },

    rocks: {
      large: "decorations/rocks/rock-cluster-large.png",
      small: "decorations/rocks/rock-small.png",
      right: "decorations/rocks/rock-cluster-right.png",
    },

    trail: {
      pawMarkers: "decorations/markers/paw-marker-pair.png",
      stones: "decorations/trails/stone-trail-curves.png",
      paintedPost: "decorations/markers/trail-marker-painted-post.png",
      signpost: "decorations/markers/signpost-arrows.png",
    },

    water: {
      pond: "decorations/water/pond-cattails-rocks.png",
    },
  },
};

/**
 * Convenience helper:
 * <img src={A(NWQ_ASSETS.rewards.starGold)} />
 */
export const A = assetUrl;
