export const BLACKLISTED_WORDS = [
  "les",
  "mon",
  "mes",
  "des",
  "d'un",
  "d'une",
  "j'ai",
  "elle",
  "nous",
  "vous",
  "ils",
  "elles",
  "par",
  "vers",
  "oui",
  "non",
  "and",
  "these",
  "ont",
  "ans",
  "the",
  "bad",
  "sur",
  "this",
  "were",
  "most",
  "dans",
  "pour",
  "avec",
  "with",
  "qui",
  "without",
  "figure",
];

export const TAGS_COLORS = ["blue", "indigo", "green", "yellow", "red"];

export const LEVELS_ENUM = Object.freeze({
  One: {
    distanceCSV : "distance_first.csv",
    neighborCSV : "neighbor_first.csv",
  },
  Two: {
    distanceCSV : "distance_second.csv",
    neighborCSV : "neighbor_second.csv",
  },
  Three: {
    distanceCSV : "distance_third.csv",
    neighborCSV : "neighbor_third.csv",
  },
  Four: {
    distanceCSV : "distance_fourth.csv",
    neighborCSV : "neighbor_fourth.csv",
  },
  Five: {
    distanceCSV : "distance_fifth.csv",
    neighborCSV : "neighbor_fifth.csv",
  },
});

export const KEYWORDS_FIELDS_ENUM = Object.freeze({
  Tesseract : "tesseract_keyword_",
  Caption : "caption_keyword_",
  PageText : "page_text_keyword_",
});
