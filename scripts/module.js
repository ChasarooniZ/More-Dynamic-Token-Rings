import { RingDialog } from "./lib/ringConfig.js";
import { RINGS } from "./ringHelpers.js";
import { AUTHORS } from "./ringList.js";

const MODULE_ID = "more-dynamic-token-rings";
const MODULE_BASE_PATH = `modules/${MODULE_ID}/`;
const effects = {
  RING_PULSE: "TOKEN.RING.EFFECTS.RING_PULSE",
  RING_GRADIENT: "TOKEN.RING.EFFECTS.RING_GRADIENT",
  BKG_WAVE: "TOKEN.RING.EFFECTS.BKG_WAVE",
  INVISIBILITY: "TOKEN.RING.EFFECTS.INVISIBILITY",
};
Hooks.once("init", async function () {
  // Create a hook to add a custom token ring configuration. This ring configuration will appear in the settings.
  game.SETT = {
    authors: AUTHORS,
    rings: RINGS,
    RingDialog,
    getMap
  };
  registerSettings();
  Hooks.on("initializeDynamicTokenRingConfig", (ringConfig) => {
    RINGS.forEach(({ label, json, id }) => {
      if (game.settings.get(MODULE_ID, id))
        ringConfig.addConfig(...getRingDataRing(label, json));
    });
  });
  Hooks.on("renderSettingsConfig", renderSettingsConfig);
});

function getRingDataRing(label, jsonName) {
  return [
    convertText(jsonName),
    new foundry.canvas.tokens.DynamicRingData({
      label,
      effects,
      spritesheet: MODULE_BASE_PATH + "assets/rings/" + jsonName,
    }),
  ];
}

function convertText(input) {
  // Split the input string by spaces
  let words = input.toLowerCase().split(" ");
  //Remove all non alphanumeric characters

  // Capitalize the first letter of each word except the first one, and join them together
  return words
    .map((word, index) => {
      if (index === 0) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("")
    .replace(/\W/g, "");
}

function registerSettings() {
  RINGS.forEach(({ label, author, id }) => {
    registerASetting(label, author, id);
  });
}

function registerASetting(name, author, id) {
  game.settings.register(MODULE_ID, id, {
    name,
    hint: author,
    requiresReload: true,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
  });
}

function renderSettingsConfig(_, html) {
  const coreTab = html.find(`.tab[data-tab=core]`);
  // Retrieve the localized name for the setting
  const localizedName = game.i18n.localize(
    MODULE_ID + ".module-settings.button"
  );

  // Find the target element and add the localized name before it
  coreTab
    .find(`[data-settings-key="core.dynamicTokenRing"]`)
    .closest(".form-group").before(`
      <button type="button" style="width: 50%;position: relative;transform: translateX(95%);" onclick="(async () => { 
          new game.SETT.RingDialog(game.SETT.rings, game.SETT.authors, game.SETT.getMap).render(true); 
      })()">
          ${localizedName}
      </button>
  `);
  // coreTab
  //   .find(`[data-settings-key="core.dynamicTokenRing"]`)
  //   .closest(".form-group").before(`
  //     <button type="button" style="width: 50%;position: relative;transform: translateX(95%);" onclick="(async () => {
  //         await game.settings.sheet.activateTab('more-dynamic-token-rings');
  //     })()">
  //         ${localizedName}F
  //     </button>
  // `);
}

function getMap() {
  const ringActivationMap = {};
  RINGS.forEach((ring) => {
    ringActivationMap[ring.id] = game.settings.register(MODULE_ID, ring.id);
  });
  return ringActivationMap
}
