import { RINGS } from "./ringHelpers.js";
import { MODULE_BASE_PATH, MODULE_ID, effects } from "./const.js";
import {
  getCustomRingData,
  validateAddCustomRing,
} from "./custom-ring/custom-ring.js";
import { handleVersion } from "./updates/handleVersion.js";
import { checkKofi } from "./checkkofi.js";

export function renderSettingsConfig(_, html) {
  if (!game.user.isGM) return false;
  const coreTab = $(html).find(`.tab[data-tab=core]`);
  // Retrieve the localized name for the setting
  const localizedName = game.i18n.localize(
    MODULE_ID + ".module-settings.button",
  );
  const isNewRing =
    game.settings.get(MODULE_ID, "old-rings").length < RINGS.length;

  // Find the target element and add the localized name before it
  coreTab.find(`[name="core.dynamicTokenRing"]`).closest(".form-group").before(`
      <button type="button" class="SETT-button" onclick="(async () => { 
          game.SETT.showRingDialog(); 
      })()">
          ${
            isNewRing
              ? '<i class="fa-solid fa-circle-exclamation fa-beat-fade" style="--fa-beat-fade-opacity: 0.8; --fa-beat-fade-scale: 1.05; --fa-animation-duration: 1.5s;" data-tooltip="' +
                game.i18n.localize(MODULE_ID + ".hover-text.new-ring") +
                '" data-tooltip-direction="UP"></i> '
              : ""
          }${localizedName}
      </button>
  `);

  const moduleTab = $(html).find(`.tab[data-tab=${MODULE_ID}]`);
  const button = `
      <button type="button" class="SETT-button-settings" onclick="(async () => { 
        game.SETT.custom.menu() 
      })()"> ${game.i18n.localize(MODULE_ID + ".module-settings.custom-ring.menu.settings-button")}
      </button>`;

  // Add import/export buttons before the 'share-flash' setting
  moduleTab
    .find(`[name="more-dynamic-token-rings.custom-ring.enabled"]`)
    .closest(".form-group").before(`
    <div class="SETT-button-container">${button}
    </div>`);

  // Add second copy of the SETT Button without styling
  moduleTab
    .find(`[name="more-dynamic-token-rings.custom-ring.enabled"]`)
    .closest(".form-group").after(`
    <button type="button" onclick="(async () => { 
        game.SETT.showRingDialog(); 
    })()">
        ${
          isNewRing
            ? '<i class="fa-solid fa-circle-exclamation fa-beat-fade" style="--fa-beat-fade-opacity: 0.8; --fa-beat-fade-scale: 1.05; --fa-animation-duration: 1.5s;" data-tooltip="' +
              game.i18n.localize(MODULE_ID + ".hover-text.new-ring") +
              '" data-tooltip-direction="UP"></i> '
            : ""
        }${localizedName}
    </button>
`);

  if (checkKofi(game.settings.get(MODULE_ID, "custom-ring.kofi-code"))) {
    const kofisetting = $(
      'input[name="more-dynamic-token-rings.custom-ring.kofi-code"]',
    ).closest(".form-group");
    kofisetting.hide();
  }
}

export async function ready() {
  if (!game.user.isGM) return;
  if (game.settings.get(MODULE_ID, "first-time-user")) {
    //TODO direct them how to enable rings
    game.settings.set(MODULE_ID, "first-time-user", false);
    await ChatMessage.create({
      content: game.i18n.localize(
        MODULE_ID + ".notifications.first-time-user.content",
      ),
      whisper: [game.userId],
    });
  }
  //Sets the ring after token Ring Config setup
  const setRingTo = game.settings.get(MODULE_ID, "set-ring-to");
  if (setRingTo) {
    await game.settings.set("core", "dynamicTokenRing", setRingTo);
    await game.settings.set(MODULE_ID, "set-ring-to", "");
    ui.notifications.notify(
      game.i18n.localize(MODULE_ID + ".notifications.reload-to-switch"),
    );
    foundry.utils.debouncedReload();
  }
  handleVersion(
    game.settings.get(MODULE_ID, "last-version"),
    game.modules.get("more-dynamic-token-rings").version,
  );
  if (game.settings.get(MODULE_ID, "open-ring-config")) {
    game.settings.set(MODULE_ID, "open-ring-config", false);
    game.settings.sheet.render(true, { activeCategory: "core" });
    const selector = `[name="core.dynamicTokenRing"]`;
    const timeout = 2000;
    await new Promise((resolve, reject) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      setTimeout(
        () => reject(new Error("Timeout waiting for element")),
        timeout,
      );
    });
  }
}

export async function initializeDynamicTokenRingConfig(ringConfig) {
  const isCustom = validateAddCustomRing();
  if (isCustom) {
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

export function convertText(input) {
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
