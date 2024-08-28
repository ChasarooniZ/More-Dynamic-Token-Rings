// import { RingDialog } from "./lib/ringConfig.js";
import { RINGS } from "./ringHelpers.js";
import { AUTHORS } from "./authorList.js";
import {
  getCustomRingData,
  registerCustomRingSettings,
} from "./custom-ring.js";
class TokenRingDialog extends Dialog {
  constructor(options = {}) {
    super(options);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Token Ring Sprite Sheet Generator",
      template: MODULE_BASE_PATH + "templates/format.html", // Replace with your HTML template path
      width: 400,
      classes: ["fvtt-dialog"],
      buttons: {
        process: {
          label: "Generate",
          callback: (html) => this._processImages(html)
        }
      },
      close: () => console.log("Dialog closed")
    });
  }

  async _processImages(html) {
    const image1File = html.find('[name="image1"]')[0].files[0];
    const image2File = html.find('[name="image2"]')[0].files[0];

    if (!image1File || !image2File) {
      ui.notifications.error("Please upload both images.");
      return;
    }

    // Load and validate images
    const image1 = await this._loadImage(image1File);
    const image2 = await this._loadImage(image2File);

    if (image1.width !== 2048 || image1.height !== 2048 || image2.width !== 2048 || image2.height !== 2048) {
      ui.notifications.error("Both images must be 2048 x 2048.");
      return;
    }

    // Get input values
    const thickness = parseInt(html.find('[name="thickness"]').val());
    const innerRing = parseInt(html.find('[name="innerRing"]').val());
    const outerRing = parseInt(html.find('[name="outerRing"]').val());
    const color = html.find('[name="color"]').val();

    // Process images and generate sprite sheet
    const spriteSheet = await this._generateSpriteSheet(image1, image2, thickness, innerRing, outerRing, color);
    await this._saveSpriteSheet(spriteSheet, "final_ring.webp");

    // Save JSON data
    const jsonData = {
      thickness, innerRing, outerRing, color
    };
    await this._saveJSON(jsonData, "sprite_config.json");

    ui.notifications.info("Processing and export complete!");
  }

  async _loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async _generateSpriteSheet(image1, image2, thickness, innerRing, outerRing, color) {
    let images = [image2, image1];
    const collections = [];

    while (images[0].width >= 256) {
      const appendedImage = this._appendImages(images[0], images[1]);
      collections.push(appendedImage);

      images = images.map(img => this._shrinkImage(img));
      images = images.concat(images); // Append two copies
    }

    let finale = collections[0];
    for (let i = 1; i < collections.length; i++) {
      finale = this._appendImages(finale, collections[i]);
    }

    return finale;
  }

  _appendImages(image1, image2) {
    const canvas = document.createElement('canvas');
    canvas.width = image1.width + image2.width;
    canvas.height = image1.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image1, 0, 0);
    ctx.drawImage(image2, image1.width, 0);
    return canvas;
  }

  _shrinkImage(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.width / 2;
    canvas.height = image.height / 2;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  async _saveSpriteSheet(canvas, filename) {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], filename, { type: 'image/webp' });
      const uploadPath = `${filename}`;
      await FilePicker.upload("data", uploadPath, file);
    }, 'image/webp');
  }

  async _saveJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    const file = new File([json], filename, { type: 'application/json' });
    const uploadPath = `${filename}`;
    await FilePicker.upload("data", uploadPath, file);
  }
}
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

  // Create and render the dialog
  new TokenRingDialog().render(true);

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
          ${isNewRing
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
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        overflow-y: auto;
        max-height: calc(80vh - 200px); /* Adjust based on desired height */
      }
      .ring-item {
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
      }
      .ring-item h3 {
        margin: 5px 0;
      }
      .ring-item img {
        max-width: 100%;
        height: auto;
      }
      .ring-item h4 {
        margin: 5px 0;
        display: inline-block;
        width: calc(100% - 30px); /* Adjusted width to accommodate the checkbox */
        vertical-align: middle;
      }
      
      .ring-item label {
        float: right;
        margin-right: 0; /* Ensures the checkbox is aligned with the right edge */
        vertical-align: middle; /* Aligns the checkbox with the middle of the author's name */
      }
      #ring-search {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
      }
    </style>
    <form>
      <input type="text" id="ring-search" placeholder="Search by Ring Name or Author">
      <div class="ring-grid">`;

    rings.forEach((ring) => {
      const author = authors.find((auth) => auth.name === ring.author);
      const authorLink = author ? author.link : "#";
      const isActive = ringActivationMap[ring.id] || false;

      con += `
      <div class="ring-item" data-ring-name="${ring.name.toLowerCase()}" data-author-name="${ring.author.toLowerCase()}">
        <h3>${new_rings.includes(ring.id)
          ? '<i class="fa-solid fa-circle-exclamation" data-tooltip="' +
          game.i18n.localize(MODULE_ID + ".hover-text.new-ring") +
          '" data-tooltip-direction="UP"></i> '
          : ""
        }${ring.name}</h3>
        <h4><a href="${authorLink}">${ring.author}</a></h4>
        <label>
          <input type="checkbox" data-tooltip="Enable Ring" data-tooltip-direction="UP" data-id="${ring.id
        }" ${isActive ? "checked" : ""}>
        </label>
        <img src="${ring.preview}" alt="${ring.label}">
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
      //html.closest(".dialog").css({ width: "800px" });

      // Implement search functionality
      const searchInput = html.find('#ring-search');
      searchInput.on('input', function () {
        const searchTerm = searchInput.val().toLowerCase();
        html.find('.ring-item').each(function () {
          const ringName = $(this).data('ring-name');
          const authorName = $(this).data('author-name');
          if (ringName.includes(searchTerm) || authorName.includes(searchTerm)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });

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
  }).render(true, { width: 1000, height: 700, top: 50 });
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
