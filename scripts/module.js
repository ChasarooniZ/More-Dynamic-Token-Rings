// import { RingDialog } from "./lib/ringConfig.js";
import { RINGS } from "./ringHelpers.js";
import { AUTHORS } from "./authorList.js";
import {
  getCustomRingData,
  registerCustomRingSettings,
} from "./custom-ring.js";

export const MODULE_ID = "more-dynamic-token-rings";
export const MODULE_BASE_PATH = `modules/${MODULE_ID}/`;
export const effects = {
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
    // RingDialog,
    getMap,
    showRingDialog,
    tours: {
      starter: starterTour,
    },
  };
  registerSettings();
  registerCustomRingSettings();

  Hooks.on("initializeDynamicTokenRingConfig", (ringConfig) => {
    RINGS.forEach(({ label, jsonPath, id }) => {
      if (game.settings.get(MODULE_ID, id))
        ringConfig.addConfig(...getRingDataRing(label, jsonPath));
    });
    if (validateAddCustomRing()) {
      ringConfig.addConfig(getCustomRingData());
    }
  });
  Hooks.on("renderSettingsConfig", renderSettingsConfig);
});

Hooks.once("ready", async function () {
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
});

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

  game.settings.register(MODULE_ID, "first-time-user", {
    name: "first-time-user",
    hint: "",
    requiresReload: false,
    scope: "world",
    config: false,
    default: true,
    type: Boolean,
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

function renderSettingsConfig(_, html) {
  if (!game.user.isGM) return false;
  const coreTab = html.find(`.tab[data-tab=core]`);
  // Retrieve the localized name for the setting
  const localizedName = game.i18n.localize(
    MODULE_ID + ".module-settings.button"
  );
  const isNewRing =
    game.settings.get(MODULE_ID, "old-rings").length < RINGS.length;

  // Find the target element and add the localized name before it
  coreTab.find(`[name="core.dynamicTokenRing"]`).closest(".form-group").before(`
      <button type="button" class="SETT-button" style="width: 50%;position: relative;transform: translateX(95%);" onclick="(async () => { 
          game.SETT.showRingDialog(); 
      })()">
          ${
            isNewRing
              ? '<i class="fa-solid fa-circle-exclamation" data-tooltip="' +
                game.i18n.localize(MODULE_ID + ".hover-text.new-ring") +
                '" data-tooltip-direction="UP"></i> '
              : ""
          }${localizedName}
      </button>
  `);
}

function getMap() {
  const ringActivationMap = {};
  RINGS.forEach((ring) => {
    ringActivationMap[ring.id] = game.settings.get(MODULE_ID, ring.id);
  });
  return ringActivationMap;
}

function showRingDialog() {
  const ringActivationMap = getMap();
  const old_rings = game.settings.get(MODULE_ID, "old-rings");
  const new_rings = RINGS.filter((ring) => !old_rings.includes(ring.id)).map(
    (ring) => ring.id
  );

  function generateDialogContent(rings, authors, ringActivationMap, new_rings) {
    let con = `
    <style>
      .ring-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        overflow-y: auto;
        max-height: calc(100vh - 200px); /* Adjust based on desired height */
      }
      .ring-item {
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
      }
      .ring-item h2, .ring-item h3, .ring-item label {
        margin: 5px 0;
      }
      .ring-item img {
        max-width: 100%;
        height: auto;
      }
    </style>
    <form><div class="ring-grid">`;

    rings.forEach((ring) => {
      const author = authors.find((auth) => auth.name === ring.author);
      const authorLink = author ? author.link : "#";
      const isActive = ringActivationMap[ring.id] || false;

      con += `
      <div class="ring-item">
        <h3>${
          new_rings.includes(ring.id)
            ? '<i class="fa-solid fa-circle-exclamation" data-tooltip="' +
              game.i18n.localize(MODULE_ID + ".hover-text.new-ring") +
              '" data-tooltip-direction="UP"></i> '
            : ""
        }${ring.name}</h3>
        <h4><a href="${authorLink}">${ring.author}</a></h4>
        <img src="${ring.preview}" alt="${ring.label}">
        <label>
          <input type="checkbox" data-tooltip="Enable Ring" data-tooltip-direction="UP" data-id="${
            ring.id
          }" ${isActive ? "checked" : ""}>
          Activate
        </label>
      </div>`;
    });

    con += `
    </div>
    <div class="dialog-buttons">
      <button type="button" name="submit">Submit</button>
    </div>
  </form>`;

    return con;
  }

  const content = generateDialogContent(
    RINGS,
    AUTHORS,
    ringActivationMap,
    new_rings
  );

  const dialog = new Dialog({
    title: "Ring Activation",
    content: content,
    buttons: {},
    render: (html) => {
      // Make the dialog wider
      html.closest(".dialog").css({ width: "800px" });

      html.find('button[name="submit"]').click(() => {
        const updatedMap = {};

        html.find('input[type="checkbox"]').each((_index, element) => {
          updatedMap[element.dataset.id] = element.checked;
          game.settings.set(MODULE_ID, element.dataset.id, element.checked);
        });

        console.log(updatedMap); // For now, logging the updated map. Replace this with the desired functionality.
        ui.notifications.notify(
          game.i18n.localize(MODULE_ID + ".notifications.ring-list-saved")
        );
        new Dialog({
          title: game.i18n.localize(MODULE_ID + ".dialog.reload.title"),
          content: `<p>${game.i18n.localize(
            MODULE_ID + ".dialog.reload.content"
          )}</p>`,
          buttons: {
            yes: {
              label: game.i18n.localize(
                MODULE_ID + ".dialog.reload.buttons.yes"
              ),
              callback: () => foundry.utils.debouncedReload(),
            },
            no: {
              label: game.i18n.localize(
                MODULE_ID + ".dialog.reload.buttons.no"
              ),
            },
          },
        }).render(true);
        dialog.close();
      });
    },
  }).render(true, { width: 800, height: 600, top: 50 });
  game.settings.set(
    MODULE_ID,
    "old-rings",
    RINGS.map((ring) => ring.id)
  );
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
