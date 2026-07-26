// @coderabbitai review: check for security and data migration edge cases
export function hasLocalStorageData(email) {
  const assessments = localStorage.getItem(`mansik_assessments_${email}`);
  const persona = localStorage.getItem(`mansik_persona_${email}`);
  const activities = localStorage.getItem(`mansik_activities_${email}`);

  return {
    hasAssessments: !!assessments,
    hasPersona: !!persona,
    hasActivities: !!activities,
    hasAny: !!(assessments || persona || activities),
  };
}

export function getLocalStorageData(email) {
  try {
    return {
      assessments: JSON.parse(
        localStorage.getItem(`mansik_assessments_${email}`) || "[]",
      ),
      persona: JSON.parse(
        localStorage.getItem(`mansik_persona_${email}`) || "{}",
      ),
      activities: JSON.parse(
        localStorage.getItem(`mansik_activities_${email}`) || "[]",
      ),
    };
  } catch {
    return { assessments: [], persona: {}, activities: [] };
  }
}

export function clearLocalStorageData(email) {
  localStorage.removeItem(`mansik_assessments_${email}`);
  localStorage.removeItem(`mansik_persona_${email}`);
  localStorage.removeItem(`mansik_activities_${email}`);
  localStorage.removeItem(`mansik_chat_${email}`);
}
