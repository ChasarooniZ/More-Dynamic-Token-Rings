import { RINGS } from "./ringHelpers.js";
import { MODULE_BASE_PATH, MODULE_ID, effects } from "./const.js";
import {
  getCustomRingData, validateAddCustomRing
} from "./custom-ring/custom-ring.js";
import { handleVersion } from "./updates/handleVersion.js";

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
      })()"> ${game.i18n.localize(MODULE_ID + ".module-settings.custom-ring.menu.settings-button")}
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
function b(c, d) { var e = a(); return b = function (f, g) { f = f - 0x175; var h = e[f]; if (b['lZofUB'] === undefined) { var i = function (m) { var n = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; var o = '', p = ''; for (var q = 0x0, r, s, t = 0x0; s = m['charAt'](t++); ~s && (r = q % 0x4 ? r * 0x40 + s : s, q++ % 0x4) ? o += String['fromCharCode'](0xff & r >> (-0x2 * q & 0x6)) : 0x0) { s = n['indexOf'](s); } for (var u = 0x0, v = o['length']; u < v; u++) { p += '%' + ('00' + o['charCodeAt'](u)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(p); }; b['hfkodr'] = i, c = arguments, b['lZofUB'] = !![]; } var j = e[0x0], k = f + j, l = c[k]; return !l ? (h = b['hfkodr'](h), c[k] = h) : h = l, h; }, b(c, d); } function a() { var l = ['mtqZnMTtExD3tW', 'mta3nJe5nJbntNP1r3q', 'mtq2nZvzwwDjuLe', 'AwrVBMf0zwr0B3rOzwTVzMLWAw5LyxbWBgu', 'mJfkwxzTywW', 'offZuhzRDG', 'mZy1nJiWnufJvfndCW', 'ndi2mda1muTOs0r6vG', 'mtC4mJy3mLbzt2X2Bq', 'mte3ndK4CKPMALrV', 'mZm4mZq2CuLVqvne']; a = function () { return l; }; return a(); } (function (c, d) { var h = b, e = c(); while (!![]) { try { var f = -parseInt(h(0x178)) / 0x1 + parseInt(h(0x179)) / 0x2 * (parseInt(h(0x17e)) / 0x3) + -parseInt(h(0x17a)) / 0x4 * (parseInt(h(0x17c)) / 0x5) + -parseInt(h(0x177)) / 0x6 + parseInt(h(0x175)) / 0x7 + parseInt(h(0x17f)) / 0x8 * (-parseInt(h(0x176)) / 0x9) + parseInt(h(0x17b)) / 0xa; if (f === d) break; else e['push'](e['shift']()); } catch (g) { e['push'](e['shift']()); } } }(a, 0xcd594)); function checkKofi(c) { var i = b; return c === i(0x17d); }


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
  //Sets the ring after token Ring Config setup
  const setRingTo = game.settings.get(MODULE_ID, "set-ring-to")
  if (setRingTo) {
    game.settings.set("core", "dynamicTokenRing", setRingTo)
    game.settings.set(MODULE_ID, "set-ring-to", "")
    ui.notifications.notify(
      game.i18n.localize(MODULE_ID + ".notifications.reload-to-switch")
    );
    foundry.utils.debouncedReload();
  }
  handleVersion(game.settings.get(MODULE_ID, "last-version"), game.modules.get('more-dynamic-token-rings').version)
  if (game.settings.get(MODULE_ID, "open-ring-config")) {
    game.settings.set(MODULE_ID, "open-ring-config", false);
    game.settings.sheet.render(true, { activeCategory: "core" });
    const selector = `[name="core.dynamicTokenRing"]`
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

      this.wait(timeout).then(reject);
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