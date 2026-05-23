import { loadDegreeMap, loadTechnicalElectives } from './courseData.js';
import {
  formatPrereqLabel,
  getPrereqCourseIds,
  arePrerequisitesMet,
  isEligibleForIndicator,
  collectUpstream,
  collectDownstream,
  buildReverseEdges,
  loadCompleted,
  saveCompleted,
  loadTechAssignments,
  saveTechAssignments,
  getTechSlotIds,
  findSlotForElective,
} from './utils.js';

const SEMESTER_COUNT = 8;

let courses = [];
let coursesById = new Map();
let techElectives = [];
let techElectivesById = new Map();
let unifiedById = new Map();
let reverseEdges = new Map();
let techSlotIds = [];
let completedIds = loadCompleted();
let techAssignments = loadTechAssignments();
let selectedId = null;

const mapEl = document.getElementById('degree-map');
const panelEl = document.getElementById('course-panel');
const techListEl = document.getElementById('tech-electives-list');
const techSlotsHintEl = document.getElementById('tech-slots-hint');

document.addEventListener('DOMContentLoaded', init);
document.getElementById('btn-reset').addEventListener('click', resetProgress);

async function init() {
  try {
    const [data, techList] = await Promise.all([loadDegreeMap(), loadTechnicalElectives()]);
    courses = data.courses;
    coursesById = new Map(courses.map((c) => [c.id, c]));
    techElectives = techList;
    techElectivesById = new Map(techElectives.map((c) => [c.id, c]));
    unifiedById = new Map([...coursesById, ...techElectivesById]);
    techSlotIds = getTechSlotIds(courses);
    reverseEdges = buildReverseEdges([...courses, ...techElectives]);

    renderMetadata(data);
    renderMap();
    renderTechElectivesList();
    renderPanel(null);
  } catch (err) {
    mapEl.innerHTML = `<p class="error">Could not load course map: ${err.message}</p>`;
  }
}

function isTechSlot(course) {
  return course?.id?.startsWith('TECH-ELECTIVE-');
}

function getAssignedId(slotCourse) {
  return techAssignments[slotCourse.id] || null;
}

function getDisplayCourse(course) {
  if (!isTechSlot(course)) return course;
  const assignedId = getAssignedId(course);
  return assignedId ? techElectivesById.get(assignedId) : course;
}

function getCompletionId(course) {
  if (isTechSlot(course)) return getAssignedId(course);
  return course.id;
}

function getFirstEmptySlot() {
  return techSlotIds.find((slotId) => !techAssignments[slotId]);
}

function allTechSlotsFilled() {
  return techSlotIds.length > 0 && techSlotIds.every((id) => techAssignments[id]);
}

function renderMetadata(data) {
  document.getElementById('grade-default').textContent = data.gradeRequirements.default;
  document.getElementById('grade-asterisk').textContent = data.gradeRequirements.asterisk;

  const tbody = document.getElementById('core-curriculum-body');
  tbody.innerHTML = data.coreCurriculum
    .map(
      (item) =>
        `<tr><td>${escapeHtml(item.label)}</td><td><code>${escapeHtml(item.code)}</code></td></tr>`
    )
    .join('');
}

function renderMap() {
  mapEl.innerHTML = '';

  for (let semester = 1; semester <= SEMESTER_COUNT; semester += 1) {
    const column = document.createElement('div');
    column.className = 'semester-column';
    column.dataset.semester = String(semester);

    const heading = document.createElement('h2');
    heading.className = 'semester-heading';
    heading.textContent = `Semester ${semester}`;
    column.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'semester-courses';

    const semesterCourses = courses
      .filter((c) => c.semester === semester)
      .sort((a, b) => a.row - b.row);

    for (const course of semesterCourses) {
      list.appendChild(createCourseCard(course));
    }

    column.appendChild(list);
    mapEl.appendChild(column);
  }

  applyVisualStates();
}

function fillCourseCard(card, slotCourse, displayCourse) {
  const completionId = getCompletionId(slotCourse);
  const isComplete = completionId ? completedIds.has(completionId) : false;
  const canTake =
    displayCourse.category === 'core' ||
    isTechSlot(slotCourse) ||
    displayCourse.category === 'elective' ||
    arePrerequisitesMet(displayCourse, completedIds);

  card.classList.toggle('is-complete', isComplete);
  card.classList.toggle(
    'is-locked',
    !isComplete &&
      !isTechSlot(slotCourse) &&
      displayCourse.category !== 'core' &&
      !canTake
  );
  card.classList.toggle('course-card--filled-tech', isTechSlot(slotCourse) && !!getAssignedId(slotCourse));
  card.classList.toggle('course-card--empty-tech', isTechSlot(slotCourse) && !getAssignedId(slotCourse));

  const header = card.querySelector('.course-card__header');
  header.innerHTML = '';

  if (displayCourse.category !== 'core') {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'course-card__check';
    checkbox.checked = isComplete;
    checkbox.disabled = isTechSlot(slotCourse) && !getAssignedId(slotCourse);
    checkbox.title = 'Mark as completed';
    checkbox.setAttribute(
      'aria-label',
      `Mark ${displayCourse.code} as completed`
    );
    checkbox.addEventListener('click', (e) => e.stopPropagation());
    checkbox.addEventListener('change', () => {
      if (!completionId) return;
      toggleComplete(completionId, checkbox.checked);
    });
    header.appendChild(checkbox);
  }

  const codeEl = document.createElement('p');
  codeEl.className = 'course-card__code';
  codeEl.textContent = displayCourse.code + (displayCourse.asterisk ? '*' : '');
  header.appendChild(codeEl);

  let titleEl = card.querySelector('.course-card__title');
  if (displayCourse.title && displayCourse.category !== 'core') {
    if (!titleEl) {
      titleEl = document.createElement('p');
      titleEl.className = 'course-card__title';
      card.insertBefore(titleEl, card.querySelector('.course-card__chips') || card.querySelector('.course-card__eligible-mark'));
    }
    titleEl.textContent = displayCourse.title;
    titleEl.hidden = false;
  } else if (titleEl) {
    titleEl.remove();
  }

  let chipsEl = card.querySelector('.course-card__chips');
  const prereqGroups = (displayCourse.prerequisites || []).filter((r) => r.label || r.courses);
  if (prereqGroups.length > 0) {
    if (!chipsEl) {
      chipsEl = document.createElement('div');
      chipsEl.className = 'course-card__chips';
      const mark = card.querySelector('.course-card__eligible-mark');
      card.insertBefore(chipsEl, mark);
    }
    chipsEl.innerHTML = '';
    for (const req of prereqGroups) {
      const chip = document.createElement('span');
      chip.className = `chip ${req.kind === 'coreq' ? 'chip--coreq' : 'chip--prereq'}`;
      chip.textContent = formatPrereqLabel(req);
      chipsEl.appendChild(chip);
    }
    chipsEl.hidden = false;
  } else if (chipsEl) {
    chipsEl.remove();
  }

  if (isTechSlot(slotCourse) && getAssignedId(slotCourse)) {
    let clearBtn = card.querySelector('.course-card__clear');
    if (!clearBtn) {
      clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'course-card__clear';
      clearBtn.textContent = '×';
      clearBtn.title = 'Remove from plan';
      clearBtn.setAttribute('aria-label', 'Remove technical elective from slot');
      clearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTechSlot(slotCourse.id);
      });
      card.appendChild(clearBtn);
    }
  } else {
    const clearBtn = card.querySelector('.course-card__clear');
    if (clearBtn) clearBtn.remove();
  }
}

function createCourseCard(slotCourse) {
  const displayCourse = getDisplayCourse(slotCourse);
  const card = document.createElement('article');
  card.className = 'course-card';
  card.dataset.id = slotCourse.id;
  card.dataset.category = slotCourse.category;
  if (displayCourse.criticalPath) card.dataset.critical = 'true';
  if (displayCourse.asterisk) card.dataset.asterisk = 'true';
  if (slotCourse.category === 'core') card.classList.add('course-card--core');
  if (isTechSlot(slotCourse)) card.classList.add('course-card--elective');

  const eligibleMark = document.createElement('span');
  eligibleMark.className = 'course-card__eligible-mark';
  eligibleMark.textContent = '*';
  eligibleMark.hidden = true;
  eligibleMark.setAttribute('aria-hidden', 'true');
  eligibleMark.title = 'Prerequisites met — ready to take';
  card.appendChild(eligibleMark);

  const header = document.createElement('div');
  header.className = 'course-card__header';
  card.insertBefore(header, eligibleMark);

  fillCourseCard(card, slotCourse, displayCourse);

  card.addEventListener('click', () => {
    const assignedId = getAssignedId(slotCourse);
    selectCourse(assignedId || slotCourse.id);
  });

  return card;
}

function refreshTechSlotCards() {
  techSlotIds.forEach((slotId) => {
    const card = mapEl.querySelector(`[data-id="${slotId}"]`);
    const slotCourse = coursesById.get(slotId);
    if (!card || !slotCourse) return;
    fillCourseCard(card, slotCourse, getDisplayCourse(slotCourse));
  });
  applyVisualStates();
}

function renderTechElectivesList() {
  if (!techListEl) return;

  const filled = techSlotIds.filter((id) => techAssignments[id]).length;
  const total = techSlotIds.length;
  const slotsFull = allTechSlotsFilled();

  if (techSlotsHintEl) {
    techSlotsHintEl.textContent = slotsFull
      ? `All ${total} technical elective slots are filled. Remove one from the map to add another.`
      : `${filled}/${total} slots filled — click a course with orange * to add it to the next open slot.`;
  }

  techListEl.innerHTML = '';

  const sorted = [...techElectives].sort((a, b) => a.code.localeCompare(b.code));

  for (const elective of sorted) {
    const eligible = isEligibleForIndicator(elective, completedIds);
    const assignedSlot = findSlotForElective(techAssignments, elective.id);
    const canAssign = eligible && !assignedSlot && !slotsFull;

    const li = document.createElement('li');
    li.className = 'tech-elective-item';
    li.dataset.electiveId = elective.id;
    if (eligible) li.classList.add('is-eligible');
    if (assignedSlot) li.classList.add('is-assigned');
    if (!canAssign && !assignedSlot) li.classList.add('is-disabled');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tech-elective-item__btn';
    btn.disabled = !canAssign && !assignedSlot;

    const label = document.createElement('span');
    label.className = 'tech-elective-item__label';
    label.textContent = elective.code;
    btn.appendChild(label);

    const title = document.createElement('span');
    title.className = 'tech-elective-item__title';
    title.textContent = elective.title;
    btn.appendChild(title);

    if (assignedSlot) {
      const slotCourse = coursesById.get(assignedSlot);
      const badge = document.createElement('span');
      badge.className = 'tech-elective-item__badge';
      badge.textContent = `Sem ${slotCourse?.semester ?? ''}`;
      btn.appendChild(badge);
    }

    if (eligible) {
      const star = document.createElement('span');
      star.className = 'tech-elective-item__star';
      star.textContent = '*';
      star.title = 'Prerequisites met';
      btn.appendChild(star);
    }

    btn.addEventListener('click', () => {
      if (assignedSlot) {
        clearTechSlot(assignedSlot);
      } else if (canAssign) {
        assignTechElective(elective.id);
      }
    });

    li.appendChild(btn);
    techListEl.appendChild(li);
  }
}

function assignTechElective(electiveId) {
  const slot = getFirstEmptySlot();
  if (!slot || !techElectivesById.has(electiveId)) return;
  if (!isEligibleForIndicator(techElectivesById.get(electiveId), completedIds)) return;
  if (findSlotForElective(techAssignments, electiveId)) return;

  techAssignments[slot] = electiveId;
  saveTechAssignments(techAssignments);
  refreshTechSlotCards();
  renderTechElectivesList();
  if (selectedId === electiveId || selectedId === slot) {
    renderPanel(techElectivesById.get(electiveId));
  }
}

function clearTechSlot(slotId) {
  const electiveId = techAssignments[slotId];
  delete techAssignments[slotId];
  saveTechAssignments(techAssignments);
  if (electiveId && completedIds.has(electiveId)) {
    completedIds.delete(electiveId);
    saveCompleted(completedIds);
  }
  if (selectedId === electiveId) selectedId = null;
  refreshTechSlotCards();
  renderTechElectivesList();
  renderPanel(selectedId ? unifiedById.get(selectedId) : null);
}

function selectCourse(id) {
  selectedId = selectedId === id ? null : id;
  applyVisualStates();
  renderPanel(selectedId ? unifiedById.get(selectedId) : null);
}

function toggleComplete(id, checked) {
  if (checked) completedIds.add(id);
  else completedIds.delete(id);
  saveCompleted(completedIds);
  refreshTechSlotCards();
  renderTechElectivesList();
  applyVisualStates();
  if (selectedId === id) renderPanel(unifiedById.get(id));
}

function applyVisualStates() {
  const upstream = selectedId ? collectUpstream(selectedId, unifiedById) : new Set();
  const downstream = selectedId ? collectDownstream(selectedId, reverseEdges) : new Set();

  document.querySelectorAll('.course-card').forEach((card) => {
    const slotId = card.dataset.id;
    const slotCourse = coursesById.get(slotId);
    if (!slotCourse) return;

    const displayCourse = getDisplayCourse(slotCourse);
    const completionId = getCompletionId(slotCourse);

    card.classList.remove('is-selected', 'is-upstream', 'is-downstream');

    const isComplete = completionId ? completedIds.has(completionId) : false;
    const canTake =
      isTechSlot(slotCourse) ||
      displayCourse.category === 'core' ||
      displayCourse.category === 'elective' ||
      arePrerequisitesMet(displayCourse, completedIds);

    card.classList.toggle('is-complete', isComplete);
    card.classList.toggle(
      'is-locked',
      !isComplete &&
        !isTechSlot(slotCourse) &&
        displayCourse.category !== 'core' &&
        !canTake
    );

    const check = card.querySelector('.course-card__check');
    if (check) {
      check.checked = isComplete;
      check.disabled = isTechSlot(slotCourse) && !getAssignedId(slotCourse);
    }

    const eligibleTarget = isTechSlot(slotCourse) && getAssignedId(slotCourse)
      ? techElectivesById.get(getAssignedId(slotCourse))
      : displayCourse;
    const eligible =
      eligibleTarget &&
      !isComplete &&
      isEligibleForIndicator(eligibleTarget, completedIds);
    card.classList.toggle('is-eligible', !!eligible);
    const mark = card.querySelector('.course-card__eligible-mark');
    if (mark) {
      mark.hidden = !eligible;
      mark.setAttribute('aria-hidden', eligible ? 'false' : 'true');
    }

    const highlightId = isTechSlot(slotCourse) && getAssignedId(slotCourse)
      ? getAssignedId(slotCourse)
      : slotId;

    if (!selectedId) return;
    if (highlightId === selectedId || slotId === selectedId) {
      card.classList.add('is-selected');
    } else if (upstream.has(highlightId)) {
      card.classList.add('is-upstream');
    } else if (downstream.has(highlightId)) {
      card.classList.add('is-downstream');
    }
  });

  if (!techListEl) return;
  techListEl.querySelectorAll('.tech-elective-item').forEach((li) => {
    const electiveId = li.dataset.electiveId;
    if (!electiveId) return;
    li.classList.remove('is-upstream', 'is-downstream', 'is-selected');
    if (!selectedId) return;
    if (electiveId === selectedId) li.classList.add('is-selected');
    else if (upstream.has(electiveId)) li.classList.add('is-upstream');
    else if (downstream.has(electiveId)) li.classList.add('is-downstream');
  });
}

function renderPanel(course) {
  if (!course) {
    panelEl.innerHTML =
      '<p class="panel-hint">Orange <strong>*</strong> = prerequisites met. Pick a technical elective from the list to fill the next open slot on the map. Click map courses for prereq chain (yellow) and unlocks (red).</p>';
    return;
  }

  const upstream = [...collectUpstream(course.id, unifiedById)].filter((id) => id !== course.id);
  const downstream = [...collectDownstream(course.id, reverseEdges)].filter(
    (id) => id !== course.id
  );
  const met = arePrerequisitesMet(course, completedIds);

  panelEl.innerHTML = `
    <h2 class="panel-title">${escapeHtml(course.code)}${course.asterisk ? '*' : ''}</h2>
    <p class="panel-subtitle">${escapeHtml(course.title)}</p>
    <p class="panel-status ${met || completedIds.has(course.id) ? 'status-ok' : 'status-warn'}">
      ${completedIds.has(course.id) ? 'Completed' : met ? 'Prerequisites met' : 'Prerequisites not met'}
    </p>
    ${
      course.prerequisites?.length
        ? `<h3>Requirements</h3><ul class="panel-list">${course.prerequisites
            .map(
              (r) =>
                `<li><span class="chip ${r.kind === 'coreq' ? 'chip--coreq' : 'chip--prereq'}">${escapeHtml(formatPrereqLabel(r))}</span></li>`
            )
            .join('')}</ul>`
        : ''
    }
    ${
      upstream.length
        ? `<h3>Prerequisite chain (${upstream.length})</h3><ul class="panel-list">${upstream
            .map((id) => panelCourseItem(id))
            .join('')}</ul>`
        : ''
    }
    ${
      downstream.length
        ? `<h3>Unlocks (${downstream.length})</h3><ul class="panel-list">${downstream
            .map((id) => panelCourseItem(id))
            .join('')}</ul>`
        : ''
    }
  `;

  panelEl.querySelectorAll('[data-jump]').forEach((btn) => {
    btn.addEventListener('click', () => selectCourse(btn.dataset.jump));
  });
}

function panelCourseItem(id) {
  const c = unifiedById.get(id);
  if (!c) return '';
  const done = completedIds.has(id) ? ' ✓' : '';
  return `<li><button type="button" class="link-btn" data-jump="${id}">${escapeHtml(c.code)}${done}</button></li>`;
}

function resetProgress() {
  if (!confirm('Clear all completed courses and technical elective selections?')) return;
  completedIds = new Set();
  techAssignments = {};
  saveCompleted(completedIds);
  saveTechAssignments(techAssignments);
  selectedId = null;
  refreshTechSlotCards();
  renderTechElectivesList();
  applyVisualStates();
  renderPanel(null);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
