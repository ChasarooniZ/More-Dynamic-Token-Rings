// import { RingDialog } from "./lib/ringConfig.js";
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
  if (game.user.isGM) {
    // Create a hook to add a custom token ring configuration. This ring configuration will appear in the settings.
    game.SETT = {
      authors: AUTHORS,
      rings: RINGS,
      // RingDialog,
      getMap,
      showRingDialog,
    };
    registerSettings();
    Hooks.on("initializeDynamicTokenRingConfig", (ringConfig) => {
      RINGS.forEach(({ label, json, id }) => {
        if (game.settings.get(MODULE_ID, id))
          ringConfig.addConfig(...getRingDataRing(label, json));
      });
    });
    Hooks.on("renderSettingsConfig", renderSettingsConfig);
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
          game.SETT.showRingDialog(); 
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
    ringActivationMap[ring.id] = game.settings.get(MODULE_ID, ring.id);
  });
  return ringActivationMap;
}

function showRingDialog() {
  const ringActivationMap = getMap();

  function generateDialogContent(rings, authors, ringActivationMap) {
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
      const author = authors.find((auth) => auth.name === ring.auth);
      const authorLink = author ? author.link : "#";
      const isActive = ringActivationMap[ring.id] || false;

      con += `
      <div class="ring-item">
        <h2>${ring.label}</h2>
        <h3><a href="${authorLink}">${ring.author}</a></h3>
        <img src="${ring.preview}" alt="${ring.label}">
        <label>
          <input type="checkbox" data-id="${ring.id}" ${
        isActive ? "checked" : ""
      }>
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

  const content = generateDialogContent(RINGS, AUTHORS, ringActivationMap);

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
}
