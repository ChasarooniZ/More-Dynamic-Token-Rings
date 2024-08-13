import { MODULE_ID } from "./module.js";
import { RINGS_RAW } from "./ringList.js";

const DEFAULT_FILEPATH = "modules/more-dynamic-token-rings/assets/previews/";

export const RINGS = RINGS_RAW.sort().map((jsonPath) => {
  const json = jsonPath.split("/").pop();
  return {
    jsonPath,
    json,
    label: formatRingName(json),
    author: getAuthor(json),
    name: getName(json),
    preview: `${DEFAULT_FILEPATH}${json.replace(".json", "")}-PREVIEW.webp`,
    id: json.replace(".json", ""),
  };
});

function formatRingName(filename) {
  return filename
    .replace("rings", "")
    .replace(".json", "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/;/g, "")
    .trim();
}

function getAuthor(filename) {
  return filename
    .replace(".json", "")
    .replace("rings", "")
    .split(";")[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function getName(json) {
  const id = json.replace(".json", "");
  let name = formatRingName(json).replace(getAuthor(json), "");

  if (game.i18n.lang !== "en") {
    const local_id = `${MODULE_ID}.rings.${id}`;
    const local = game.i18n.localize(local_id);
    name = local !== local_id ? local : name;
  }

  return name;
}
