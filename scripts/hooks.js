import { RINGS } from "./ringHelpers.js";
import { MODULE_BASE_PATH, MODULE_ID,effects } from "./const.js";
import {
  getCustomRingData, validateAddCustomRing
} from "./custom-ring/custom-ring.js";

export function renderSettingsConfig(_, html) {
  if (!game.user.isGM)
    return false;
  const coreTab = html.find(`.tab[data-tab=core]`);
  // Retrieve the localized name for the setting
  const localizedName = game.i18n.localize(
    MODULE_ID + ".module-settings.button"
  );
  const isNewRing = game.settings.get(MODULE_ID, "old-rings").length < RINGS.length;

  // Find the target element and add the localized name before it
  coreTab.find(`[name="core.dynamicTokenRing"]`).closest(".form-group").before(`
      <button type="button" class="SETT-button" onclick="(async () => { 
          game.SETT.showRingDialog(); 
      })()">
          ${isNewRing
      ? '<i class="fa-solid fa-circle-exclamation" data-tooltip="' +
      game.i18n.localize(MODULE_ID + ".hover-text.new-ring") +
      '" data-tooltip-direction="UP"></i> '
      : ""}${localizedName}
      </button>
  `);

  const moduleTab = html.find(`.tab[data-tab=${MODULE_ID}]`);
  const button = `
      <button type="button" class="SETT-button-settings" onclick="(async () => { 
        game.SETT.custom.menu() 
      })()">Custom Ring Maker
      </button>`;

  // Add import/export buttons before the 'share-flash' setting
  moduleTab
    .find(`[name="more-dynamic-token-rings.custom-ring.enabled"]`)
    .closest(".form-group").before(`
    <div class="SETT-button-container">${button}
    </div>`);
}

export async function ready() {
  if (game.settings.get(MODULE_ID, "first-time-user")) {
    //TODO direct them how to enable rings
    game.settings.set(MODULE_ID, "first-time-user", false);
    await ChatMessage.create({
      content: game.i18n.localize(
        MODULE_ID + ".notifications.first-time-user.content"
      ),
      whisper: [game.userId],
    });
  }

}

export function initializeDynamicTokenRingConfig(ringConfig) {
  if (validateAddCustomRing()) {
    ringConfig.addConfig(...getCustomRingData());
  }
  RINGS.forEach(({ label, jsonPath, id }) => {
    if (game.settings.get(MODULE_ID, id))
      ringConfig.addConfig(...getRingDataRing(label, jsonPath));
  });
}


function getRingDataRing(label, jsonName) {
  return [
    convertText(label),
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