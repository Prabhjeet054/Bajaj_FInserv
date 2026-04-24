export function validateEntry(entry) {
  if (typeof entry !== "string") {
    return { valid: false, trimmed: String(entry) };
  }

  const trimmed = entry.trim();
  const VALID_PATTERN = /^[A-Z]->[A-Z]$/;

  if (!VALID_PATTERN.test(trimmed)) {
    return { valid: false, trimmed };
  }

  const parent = trimmed[0];
  const child = trimmed[3];

  if (parent === child) {
    return { valid: false, trimmed };
  }

  return { valid: true, trimmed, parent, child };
}
