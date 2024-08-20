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
    default: '',
    type: String,
    filePicker: image,
  });
  game.settings.register(MODULE_ID, pre + "token-bg", {
    name: game.i18n.localize(path + "token-bg" + ".name"),
    hint: game.i18n.localize(path + "token-bg" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: '',
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
    type: Number
  });

  game.settings.register(MODULE_ID, pre + "color-band.start", {
    name: game.i18n.localize(path + "color-band.start" + ".name"),
    hint: game.i18n.localize(path + "color-band.start" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: 0,
    type: Number
  });

  game.settings.register(MODULE_ID, pre + "color-band.end", {
    name: game.i18n.localize(path + "color-band.end" + ".name"),
    hint: game.i18n.localize(path + "color-band.end" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: 1,
    type: Number
  });

  game.settings.register(MODULE_ID, pre + "color-band.color", {
    name: game.i18n.localize(path + "color-band.color" + ".name"),
    hint: game.i18n.localize(path + "color-band.color" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: "#A51EE6",
    type: new foundry.data.fields.ColorField()
  });
}
