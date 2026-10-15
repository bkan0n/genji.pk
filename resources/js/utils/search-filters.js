export function normalizeMapNames(value) {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  const seen = new Set();
  return values
    .map((name) => String(name).trim())
    .filter((name) => {
      const key = name.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function toggleMapName(value, name) {
  const names = normalizeMapNames(value);
  const candidate = String(name ?? '').trim();
  if (!candidate) return names;
  const key = candidate.toLowerCase();
  return names.some((selected) => selected.toLowerCase() === key)
    ? names.filter((selected) => selected.toLowerCase() !== key)
    : [...names, candidate];
}

// Browser requests go through Laravel, which needs bracketed array keys.
// The controller converts these to the upstream API's repeated flat keys.
export function serializeSearchFilters(filters = {}) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value == null || value === '') continue;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item != null && item !== '') params.append(`${key}[]`, item);
      });
    } else {
      params.set(key, value);
    }
  }
  return params.toString();
}
