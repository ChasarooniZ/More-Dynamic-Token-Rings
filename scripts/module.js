// import { RingDialog } from "./lib/ringConfig.js";
import { RINGS } from "./ringHelpers.js";
import { AUTHORS } from "./authorList.js";
import {
  registerCustomRingSettings,
} from "./custom-ring/custom-ring.js";
import { createCustomTokenRingDialog } from "./custom-ring/createCustomTokenRingDialog.js";
import { initializeDynamicTokenRingConfig, ready, renderSettingsConfig } from "./hooks.js";
import { MODULE_ID } from "./const.js";
import { showRingDialog } from "./dialog/showRingDialog.js";
Hooks.once("init", async function () {
  // Create a hook to add a custom token ring configuration. This ring configuration will appear in the settings.
  game.SETT = {
    authors: AUTHORS,
    rings: RINGS,
    // RingDialog,
    getMap,
    showRingDialog: showRingDialog,
    tours: {
      starter: starterTour,
    },
    custom: {
      menu: createCustomTokenRingDialog,
    }
  };
  registerCustomRingSettings();
  registerSettings();

  Hooks.on("initializeDynamicTokenRingConfig", initializeDynamicTokenRingConfig);
  Hooks.on("renderSettingsConfig", renderSettingsConfig);
});

Hooks.once("ready", ready);

function registerSettings() {
  game.settings.register(MODULE_ID, "old-rings", {
    name: "old-rings",
    hint: "",
    requiresReload: false,
    scope: "world",
    config: false,
    default: [],
    type: Array,
  });

  game.settings.register(MODULE_ID, "set-ring-to", {
    name: "set-ring-to",
    hint: "",
    requiresReload: false,
    scope: "world",
    config: false,
    default: "",
    type: String,
  });


  game.settings.register(MODULE_ID, "first-time-user", {
    name: "first-time-user",
    hint: "",
    requiresReload: false,
    scope: "world",
    config: false,
    default: true,
    type: Boolean,
  });

  game.settings.register(MODULE_ID, "last-version", {
    name: "last-version",
    hint: "",
    requiresReload: false,
    scope: "world",
    config: false,
    default: '',
    type: String,
  });

  game.settings.register(MODULE_ID, "tours-run", {
    name: "tours-run",
    hint: "",
    requiresReload: false,
    scope: "world",
    config: false,
    default: [],
    type: Array,
  });

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

export function getMap() {
  const ringActivationMap = {};
  RINGS.forEach((ring) => {
    ringActivationMap[ring.id] = game.settings.get(MODULE_ID, ring.id);
  });
  return ringActivationMap;
}

async function starterTour() {
  //tour path
  const tp = ".tours.starter.";
  game.settings.sheet.render(true);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  game.settings.sheet.activateTab("core");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let tour = new Tour({
    namespace: "core",
    id: "sett-starter-tour",
    title: game.i18n.localize(MODULE_ID + tp + "title"),
    steps: [
      {
        title: stepStart(tp, 1) + "title",
        selector: '[data-tab="core"]',
        content: stepStart(tp, 1) + "content",
      },
      {
        title: stepStart(tp, 2) + "title",
        selector: ".SETT-button",
        content: stepStart(tp, 2) + "content",
      },

      {
        title: stepStart(tp, 3) + "title",
        selector: "#client-settings",
        content: stepStart(tp, 3) + "content",
      },
      {
        selector: '[data-setting-id="core.dynamicTokenRing"]',
        title: stepStart(tp, 4) + "title",
        content: stepStart(tp, 4) + "content",
      },
      {
        title: stepStart(tp, 5) + "title",
        selector: "",
        content: stepStart(tp, 5) + "content",
      },
    ],
  });
  tour.start();
}

function stepStart(tourPath, step) {
  return MODULE_ID + tourPath + `steps.${step}.`;
}
