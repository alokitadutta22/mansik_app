/* Sentiment keyword lists for chat mood signals */
export const CRISIS_WORDS = [
  "suicide",
  "end my life",
  "kill myself",
  "can't go on",
  "want to die",
  "self harm",
  "hurt myself",
  "no reason to live",
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
