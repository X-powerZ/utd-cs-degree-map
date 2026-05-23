export async function loadDegreeMap() {
  const response = await fetch('./data/courses.json');
  if (!response.ok) throw new Error('Failed to load course data');
  return response.json();
}

export async function loadTechnicalElectives() {
  const response = await fetch('./data/technical-electives.json');
  if (!response.ok) throw new Error('Failed to load technical electives');
  const data = await response.json();
  return data.electives;
}
