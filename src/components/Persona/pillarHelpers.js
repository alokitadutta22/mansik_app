export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const todayName = () => {
  const d = new Date();
  return DAYS[d.getDay() === 0 ? 6 : d.getDay() - 1];
};
export const todayStr = () => new Date().toISOString().split("T")[0];

/* Pillar Analytics helper */
export const calcPillarStats = (activities, pillar) => {
  const acts = activities.filter((a) => a.pillar === pillar);
  if (!acts.length) return null;
  let totalPlanned = 0,
    totalCompleted = 0,
    currentStreak = 0,
    longestStreak = 0;
  const today = new Date();
  const last14 = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    last14.push(d.toISOString().split("T")[0]);
  }
  const weeklyRates = [];
  for (let w = 0; w < 2; w++) {
    let wPlanned = 0,
      wDone = 0;
    for (let d = 0; d < 7; d++) {
      const dateStr = last14[w * 7 + d];
      const dayOfWeek =
        DAYS[
          new Date(dateStr).getDay() === 0 ? 6 : new Date(dateStr).getDay() - 1
        ];
      acts.forEach((act) => {
        if (act.days.includes(dayOfWeek)) {
          wPlanned++;
          totalPlanned++;
          if (act.completionLog?.[dateStr]) {
            wDone++;
            totalCompleted++;
          }
        }
      });
    }
    weeklyRates.push(wPlanned > 0 ? Math.round((wDone / wPlanned) * 100) : 0);
  }
  // streak calc (last 14 days, most recent first)
  for (let i = last14.length - 1; i >= 0; i--) {
    const dateStr = last14[i];
    const dayOfWeek =
      DAYS[
        new Date(dateStr).getDay() === 0 ? 6 : new Date(dateStr).getDay() - 1
      ];
    const dayPlanned = acts.filter((a) => a.days.includes(dayOfWeek));
    if (!dayPlanned.length) continue;
    const allDone = dayPlanned.every((a) => a.completionLog?.[dateStr]);
    if (allDone) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else break;
  }
  // activityStats
  const actStats = acts.map((act) => {
    let p = 0,
      c = 0;
    last14.forEach((ds) => {
      const dow =
        DAYS[new Date(ds).getDay() === 0 ? 6 : new Date(ds).getDay() - 1];
      if (act.days.includes(dow)) {
        p++;
        if (act.completionLog?.[ds]) c++;
      }
    });
    return {
      ...act,
      planned: p,
      completed: c,
      rate: p > 0 ? Math.round((c / p) * 100) : 0,
    };
  });
  return {
    consistency:
      totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
    currentStreak,
    longestStreak,
    weeklyRates,
    actStats,
    score:
      totalPlanned > 0 ? Math.round((totalCompleted / totalPlanned) * 100) : 0,
  };
};
