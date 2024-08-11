import { RINGS_RAW } from "./ringList.js";

const default_filepath = "modules/more-dynamic-token-rings/assets/previews/";

export const RINGS = RINGS_RAW.sort().map((jsonPath) => {
  const json = formatJSON(jsonPath);
  return {
    jsonPath,
    json,
    label: formatRingName(json),
    author: getAuthor(json),
    name: formatRingName(json).replace(getAuthor(json), ''),
    preview: getPreview(json),
    id: getSettingId(json),
  };
});

function formatJSON(jsonPath) {
  //split by /
  const parts = jsonPath.split("/");

  return parts[parts.length - 1];
}

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
  return name
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/;/g, "")
    .trim();
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
  return author.replace(/\b\w/g, (char) => char.toUpperCase()).trim();
}

function getPreview(filename) {
  // Remove the file extension
  let name = filename.replace(".json", "");

  return `${default_filepath}${name}-PREVIEW.webp`;
}

function getSettingId(json) {
  return json.replace(".json", "");
}
