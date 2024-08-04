export const RINGS_RAW = [
  "rings-token-tool-chains.json",
  "rings-token-tool-runes-black.json",
];

export const RINGS = RINGS_RAW.sort().map((json) => ({
  json,
  label: formatRingName(json),
}));

/**
 * Converts a filename into a more readable token ring name
 * @param {string} filename - The input filename.
 * @returns {string} - The formatted token ring name.
 */
function formatRingName(filename) {
  // Remove the file extension
  let nameWithoutExtension = filename.replace(".json", "");

  // Replace hyphens with spaces
  let nameWithSpaces = nameWithoutExtension.replace(/-/g, " ");

  // Capitalize the first letter of each word
  return nameWithSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
}
