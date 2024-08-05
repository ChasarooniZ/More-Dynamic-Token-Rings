export const RINGS_RAW = [
  "rings-token-tool;-chains.json",
  "rings-token-tool;-runes-black.json",
];

export const RINGS = RINGS_RAW.sort().map((json) => ({
  json,
  label: formatRingName(json),
  author: getAuthor(json),
}));

/**
 * Converts a filename into a more readable token ring name
 * @param {string} filename - The input filename.
 * @returns {string} - The formatted token ring name.
 */
function formatRingName(filename) {
  // Remove the rings prefix
  let name = filename.replace("rings", "");

  // Remove the file extension
  name = name.replace(".json", "");

  // Replace hyphens with spaces
  name = name.replace(/-/g, " ");

  // Capitalize the first letter of each word and remove the semicolon
  return name.replace(/\b\w/g, (char) => char.toUpperCase()).replace(/;/g, "");
}

function getAuthor(filename) {
  // Remove the file extension
  let author = filename.replace(".json", "");
  author = author.replace("rings", "");

  //Get data before the ;
  author = author.split(";")[0];

  // Replace hyphens with spaces
  author = author.replace(/-/g, " ");

  // Capitalize the first letter of each word and remove the semicolon
  return author.replace(/\b\w/g, (char) => char.toUpperCase());
}
