export function encodeColumn(index) {
  if (!Number.isInteger(index) || index < 0) {
    throw new Error("encodeColumn expects a non-negative integer index.");
  }

  let n = index;
  let label = "";

  n += 1;

  while (n > 0) {
    const rem = (n - 1) % 26;
    label = String.fromCharCode(65 + rem) + label; // 65 = "A"
    n = Math.floor((n - 1) / 26);
  }

  return label;
}

export function decodeColumn(label) {
  if (typeof label !== "string" || label.length === 0) {
    throw new Error("decodeColumn expects a non-empty string label.");
  }

  let result = 0;
  const upper = label.toUpperCase();

  for (let i = 0; i < upper.length; i++) {
    const code = upper.charCodeAt(i);
    if (code < 65 || code > 90) {
      throw new Error(
        `decodeColumn: invalid character "${upper[i]}", expected A-Z.`,
      );
    }
    result = result * 26 + (code - 64);
  }

  return result - 1;
}
