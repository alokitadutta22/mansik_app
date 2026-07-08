export const PSS = [
  {
    id: 1,
    t: "Been upset because of something that happened unexpectedly?",
    r: false,
  },
  {
    id: 2,
    t: "Felt unable to control the important things in your life?",
    r: false,
  },
  { id: 3, t: "Felt nervous and stressed?", r: false },
  { id: 4, t: "Successfully dealt with irritating life hassles?", r: true },
  {
    id: 5,
    t: "Felt effectively coping with important changes in your life?",
    r: true,
  },
  {
    id: 6,
    t: "Felt confident about your ability to handle personal problems?",
    r: true,
  },
  { id: 7, t: "Felt that things were going your way?", r: true },
  {
    id: 8,
    t: "Found that you could not cope with all the things you had to do?",
    r: false,
  },
  { id: 9, t: "Been able to control irritations in your life?", r: true },
  { id: 10, t: "Felt that you were on top of things?", r: true },
  {
    id: 11,
    t: "Been angered because of things outside your control?",
    r: false,
  },
  {
    id: 12,
    t: "Found yourself thinking about things you have to accomplish?",
    r: false,
  },
  { id: 13, t: "Been able to control how you spend your time?", r: true },
  {
    id: 14,
    t: "Felt difficulties piling up so high you could not overcome them?",
    r: false,
  },
];
export const SCALE = [
  { v: 0, l: "Never" },
  { v: 1, l: "Almost Never" },
  { v: 2, l: "Sometimes" },
  { v: 3, l: "Often" },
  { v: 4, l: "Very Often" },
];

/* Pillars: each now has an icon key for SVG rendering */
export const PIL = {
  Health: {
    ico: "leaf",
    c: "#C4CDB8",
    d: "#8FA08A",
    a: ["Sleep", "Fitness", "Medication", "Nutrition", "Hydration"],
  },
  Habit: {
    ico: "pen",
    c: "#C2D0DC",
    d: "#97AEC0",
    a: ["Exercise", "Journaling", "Reading", "Meditation", "Social Media"],
  },
  Relationship: {
    ico: "heart",
    c: "#CCC4D8",
    d: "#9B8FB0",
    a: ["Friends", "Family", "Partner", "Manager", "Peers"],
  },
  Occupation: {
    ico: "brief",
    c: "#E2C88A",
    d: "#C4A45A",
    a: ["Student", "IT Professional", "Doctor", "Engineer", "Entrepreneur"],
  },
  Entertainment: {
    ico: "film",
    c: "#E8C8C2",
    d: "#D4A9A3",
    a: ["Movies", "Traveling", "Gaming", "Music", "Sports"],
  },
  Liability: {
    ico: "moon",
    c: "#D8CCBC",
    d: "#A8846E",
    a: [
      "Financial Stress",
      "Family Duties",
      "Work Pressure",
      "Health Worries",
      "Debt",
    ],
  },
};

export const HIST = [];
export const calcSc = (rs) =>
  PSS.reduce((s, q, i) => {
    const v = rs[i] ?? 0;
    return s + (q.r ? 4 - v : v);
  }, 0);
export const sev = (sc) => (sc <= 19 ? "Low" : sc <= 37 ? "Moderate" : "High");
export const sc = (sv) =>
  sv === "Low" ? "#7A9A78" : sv === "Moderate" ? "#A88040" : "#A8504A";
export const fd = (d) =>
  new Date(d).toLocaleDateString("en-IN", { month: "short", day: "numeric" });
