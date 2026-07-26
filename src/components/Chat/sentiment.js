// @coderabbitai review: check for security and regex edge cases
/* Sentiment keyword lists for chat mood signals */
export const CRISIS_WORDS = [
  "suicide",
  "suicidal",
  "end my life",
  "kill myself",
  "can't go on",
  "cant go on",
  "want to die",
  "wnat to die",
  "don't want to live",
  "dont want to live",
  "self harm",
  "hurt myself",
  "no reason to live",
  "cant deal with this",
  "can't deal with this",
  "don't like this life",
  "dont like this life",
];
export const NEG_WORDS = [
  "anxious",
  "panic",
  "depressed",
  "hopeless",
  "worthless",
  "alone",
  "scared",
  "terrified",
  "exhausted",
  "overwhelmed",
  "can't cope",
  "breaking down",
  "falling apart",
  "numb",
  "empty",
  "suffering",
  "miserable",
  "hate myself",
  "useless",
  "trapped",
  "helpless",
  "crying",
  "breakdown",
];
export const classifySentiment = (text) => {
  const t = text.toLowerCase();
  if (CRISIS_WORDS.some((w) => t.includes(w)))
    return { score: 48, level: "High", trigger: "crisis" };
  if (NEG_WORDS.some((w) => t.includes(w)))
    return { score: 30, level: "Moderate", trigger: "emotional" };
  return null; // No signal for neutral messages
};
