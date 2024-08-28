import { MODULE_BASE_PATH, MODULE_ID, effects } from "./module.js";

export function registerCustomRingSettings() {
  const path = MODULE_ID + ".custom-ring.";
  const pre = "custom-ring.";
  game.settings.register(MODULE_ID, pre + "enabled", {
    name: game.i18n.localize(path + "enabled" + ".name"),
    hint: game.i18n.localize(path + "enabled" + ".hint"),
    requiresReload: true,
    scope: "world",
    config: true,
    default: false,
    type: String,
  });
  game.settings.register(MODULE_ID, pre + "token-ring", {
    name: game.i18n.localize(path + "token-ring" + ".name"),
    hint: game.i18n.localize(path + "token-ring" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: "",
    type: String,
    filePicker: image,
  });
  game.settings.register(MODULE_ID, pre + "token-bg", {
    name: game.i18n.localize(path + "token-bg" + ".name"),
    hint: game.i18n.localize(path + "token-bg" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: "",
    type: String,
    filePicker: image,
  });
  game.settings.register(MODULE_ID, pre + "ring-thickness", {
    name: game.i18n.localize(path + "ring-thickness" + ".name"),
    hint: game.i18n.localize(path + "ring-thickness" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: 0.11,
    type: Number,
  });

  game.settings.register(MODULE_ID, pre + "color-band.start", {
    name: game.i18n.localize(path + "color-band.start" + ".name"),
    hint: game.i18n.localize(path + "color-band.start" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: 0,
    type: Number,
  });

  game.settings.register(MODULE_ID, pre + "color-band.end", {
    name: game.i18n.localize(path + "color-band.end" + ".name"),
    hint: game.i18n.localize(path + "color-band.end" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: 1,
    type: Number,
  });

  game.settings.register(MODULE_ID, pre + "color-band.color", {
    name: game.i18n.localize(path + "color-band.color" + ".name"),
    hint: game.i18n.localize(path + "color-band.color" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: "#A51EE6",
    type: new foundry.data.fields.ColorField(),
  });
}

export function createCustomRing() {
  if (!game.user.isGM) return;
  if (!game.settings.get(MODULE_ID + ".custom-ring.enabled")) return;

  // Grabs the data
  //validates ring size (and other values etc.)
  //Errors if no
  // creates JSON
  // Creates Image (stores both in module)
}

export function validateAddCustomRing() {
  if (!game.user.isGM) return;
  if (!game.settings.get(MODULE_ID + ".custom-ring.enabled")) return;

  //Validates ring is there and adds it if is otherwise error
  // Adds to ring list as _Custom SETT Ring so it is at the top
}

export function getCustomRingData() {
  const usName = "Custom SETT Ring";
  const jsonName = "Custom-SETT-Ring.json"
  let label = `_${usName}`;
  return [
    label,
    new foundry.canvas.tokens.DynamicRingData({
      label: "CustomSETTRing",
      effects,
      spritesheet: MODULE_BASE_PATH + "assets/rings/custom/" + jsonName,
    }),
  ];
}
