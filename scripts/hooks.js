import { RINGS } from "./ringHelpers.js";
import { MODULE_BASE_PATH, MODULE_ID, effects } from "./const.js";
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
  if (checkKofi(game.settings.get(MODULE_ID, "custom-ring.kofi-code"))) {
    const kofisetting = $('input[name="more-dynamic-token-rings.custom-ring.kofi-code"]').closest('.form-group');
    kofisetting.hide();
  }
}

//kc
(function (_0x331461, _0x282030) { var _0xd913ac = { _0x1a166c: 0x1d6 }, _0x5779a4 = _0x4d70, _0xb914d = _0x331461(); while (!![]) { try { var _0x546a38 = parseInt(_0x5779a4(0x1d4)) / 0x1 + -parseInt(_0x5779a4(0x1d1)) / 0x2 * (-parseInt(_0x5779a4(0x1d0)) / 0x3) + parseInt(_0x5779a4(0x1d7)) / 0x4 + parseInt(_0x5779a4(0x1d2)) / 0x5 + parseInt(_0x5779a4(0x1ce)) / 0x6 * (-parseInt(_0x5779a4(0x1cf)) / 0x7) + -parseInt(_0x5779a4(_0xd913ac._0x1a166c)) / 0x8 + -parseInt(_0x5779a4(0x1d5)) / 0x9; if (_0x546a38 === _0x282030) break; else _0xb914d['push'](_0xb914d['shift']()); } catch (_0x594f5c) { _0xb914d['push'](_0xb914d['shift']()); } } }(_0x1610, 0xd289b)); function checkKofi(_0x25cce2) { var _0xf35746 = { _0x4af925: 0x1d3 }, _0x20d7b9 = _0x4d70; return _0x25cce2 === _0x20d7b9(_0xf35746._0x4af925); } function _0x4d70(_0x3db113, _0xd66052) { var _0x161096 = _0x1610(); return _0x4d70 = function (_0x4d703b, _0x3c1607) { _0x4d703b = _0x4d703b - 0x1ce; var _0x14b9ee = _0x161096[_0x4d703b]; return _0x14b9ee; }, _0x4d70(_0x3db113, _0xd66052); } function _0x1610() { var _0x51e2b6 = ['448281Qssumw', '14ewqntz', '6394100DCdmco', 'idonatedtothekofipineapple', '396318QFmruf', '10079829hkGSXv', '12579960QrQSPd', '5855320pxGpho', '6HWgzSR', '4410826nekyRr']; _0x1610 = function () { return _0x51e2b6; }; return _0x1610(); }


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