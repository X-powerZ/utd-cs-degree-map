export function normalizeId(code) {
  return code.replace(/\s+/g, '').replace(/\//g, '-').toUpperCase();
}

export function formatPrereqLabel(req) {
  if (req.external && req.label) return req.label;
  if (!req.courses) return '';
  return req.courses.join(' or ');
}

export function getPrereqCourseIds(course) {
  const ids = [];
  for (const req of course.prerequisites || []) {
    if (req.courses) ids.push(...req.courses);
  }
  return ids;
}

export function isPrereqGroupMet(req, completedIds) {
  if (req.external) return true;
  if (!req.courses || req.courses.length === 0) return true;
  return req.courses.some((id) => completedIds.has(id));
}

export const TECH_ASSIGNMENTS_KEY = 'cs-degree-map-tech-assignments';

export function loadTechAssignments() {
  try {
    const raw = localStorage.getItem(TECH_ASSIGNMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveTechAssignments(assignments) {
  localStorage.setItem(TECH_ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

export function getTechSlotIds(courses) {
  return courses
    .filter((c) => c.id.startsWith('TECH-ELECTIVE-'))
    .sort((a, b) => a.semester - b.semester || a.row - b.row)
    .map((c) => c.id);
}

export function getAssignedElectiveId(slotId, assignments) {
  return assignments[slotId] || null;
}

export function findSlotForElective(assignments, electiveId) {
  return Object.keys(assignments).find((slot) => assignments[slot] === electiveId) || null;
}

export function arePrerequisitesMet(course, completedIds) {
  const reqs = course.prerequisites || [];
  if (reqs.length === 0) return true;
  return reqs.every((req) => isPrereqGroupMet(req, completedIds));
}

/** Course has prereqs we can verify from completed checkboxes (not catalog-only). */
export function hasTrackablePrerequisites(course) {
  const reqs = course.prerequisites || [];
  if (reqs.length === 0) return true;
  return reqs.some((req) => req.courses?.length > 0);
}

/** Prerequisite groups (not coreqs) satisfied by completed map courses. */
export function areTrackablePrerequisitesMet(course, completedIds) {
  const reqs = course.prerequisites || [];
  if (reqs.length === 0) return true;

  const trackable = reqs.filter((req) => req.courses?.length > 0);
  if (trackable.length === 0) return false;

  const prereqGroups = trackable.filter((req) => req.kind !== 'coreq');
  const groupsToCheck = prereqGroups.length > 0 ? prereqGroups : trackable;

  return groupsToCheck.every((req) => isPrereqGroupMet(req, completedIds));
}

/** Show orange * — not done, trackable prereqs, and ready to plan for next semester. */
export function isEligibleForIndicator(course, completedIds) {
  if (completedIds.has(course.id)) return false;
  if (!hasTrackablePrerequisites(course)) return false;
  return areTrackablePrerequisitesMet(course, completedIds);
}

export function collectUpstream(courseId, coursesById, visited = new Set()) {
  if (visited.has(courseId)) return visited;
  visited.add(courseId);
  const course = coursesById.get(courseId);
  if (!course) return visited;
  for (const id of getPrereqCourseIds(course)) {
    collectUpstream(id, coursesById, visited);
  }
  return visited;
}

export function collectDownstream(courseId, reverseEdges, visited = new Set()) {
  if (visited.has(courseId)) return visited;
  visited.add(courseId);
  for (const childId of reverseEdges.get(courseId) || []) {
    collectDownstream(childId, reverseEdges, visited);
  }
  return visited;
}

export function buildReverseEdges(courses) {
  const edges = new Map();
  for (const course of courses) {
    for (const id of getPrereqCourseIds(course)) {
      if (!edges.has(id)) edges.set(id, new Set());
      edges.get(id).add(course.id);
    }
  }
  return edges;
}

export const STORAGE_KEY = 'cs-degree-map-completed';

export function loadCompleted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function saveCompleted(completedIds) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedIds]));
}
