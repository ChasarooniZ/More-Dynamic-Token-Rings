import { getBaseJSON } from "./custom-ring-json-cfg.js";
import { MODULE_BASE_PATH, MODULE_ID, effects } from "../const.js";
import { askToReload } from "../module.js";

export function registerCustomRingSettings() {
  const path = MODULE_ID + ".module-settings.custom-ring.";
  const pre = "custom-ring.";
  game.settings.register(MODULE_ID, pre + "enabled", {
    name: game.i18n.localize(path + "enabled" + ".name"),
    hint: game.i18n.localize(path + "enabled" + ".hint"),
    requiresReload: true,
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
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
  game.settings.register(MODULE_ID, pre + "kofi-code", {
    name: game.i18n.localize(path + "kofi-code" + ".name"),
    hint: game.i18n.localize(path + "kofi-code" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: true,
    default: "",
    type: String,
  });
}

export function createCustomRing() {
  if (!game.user.isGM) return;
  if (!game.settings.get(MODULE_ID, "custom-ring.enabled")) return;

  // Grabs the data
  //validates ring size (and other values etc.)
  //Errors if no
  // creates JSON
  // Creates Image (stores both in module)
}

export async function validateAddCustomRing() {
  if (!game.user.isGM) return;
  if (!game.settings.get(MODULE_ID, "custom-ring.enabled")) return;
  const result = await FilePicker.browse('data', "modules/more-dynamic-token-rings/storage/custom-ring");
  if (result.files.includes("custom-ring.json") && result.files.includes("custom-ring.webp")) {
    return true;
  } else {
    console.error("SETT: Custom Ring doesn't exist, please actually upload it")
    return false;
  }

  //Validates ring is there and adds it if is otherwise error
  // Adds to ring list as _Custom SETT Ring so it is at the top
}

export function getCustomRingData() {
  const usName = "Custom SETT Ring";
  const jsonName = "custom-ring.json"
  let label = `_${usName}`;
  return [
    label,
    new foundry.canvas.tokens.DynamicRingData({
      label,
      effects,
      spritesheet: MODULE_BASE_PATH + "storage/custom-ring/" + jsonName,
    }),
  ];
}

// Function to create the dialog box in Foundry VTT
export async function createCustomTokenRingDialog() {
  const defaultSettings = {
    quality: 80,
    thickness: game.settings.get(MODULE_ID, "custom-ring.ring-thickness") || 0.1,
    innerRing: game.settings.get(MODULE_ID, "custom-ring.color-band.start") || 0,
    outerRing: game.settings.get(MODULE_ID, "custom-ring.color-band.end") || 1,
    ringColor: game.settings.get(MODULE_ID, "custom-ring.color-band.color") || "#ffffff"
  };

  new Dialog({
    title: "Create Token Ring Sprite Sheet",
    content: `
    <form>
    <div class="form-group">
      <label>Dynamic Token Ring:</label>
      <input type="file" id="image1" accept="image/*">
    </div>
    <div class="form-group">
      <label>Dynamic Token BG:</label>
      <input type="file" id="image2" accept="image/*">
    </div>
    <div class="form-group">
      <label>Ring Quality (%):</label>
      <input type="number" id="quality" value="80" min="1">
    </div>
    <div class="form-group">
      <label>Thickness:</label>
      <input type="number" id="thickness" value="${defaultSettings.thickness}" min="1">
    </div>
    <h3>Ring Coloration</h3>
    <div class="form-group">
      <label>Inner %:</label>
      <input type="number" id="innerRing" value="${defaultSettings.innerRing}" min="1">
    </div>
    <div class="form-group">
      <label>Outer %:</label>
      <input type="number" id="outerRing" value="${defaultSettings.outerRing}" min="1">
    </div>
    <div class="form-group">
      <label>Color:</label>
      <input type="color" id="ringColor" value="${defaultSettings.ringColor}">
      <input type="text" id="ringColorHex" value="${defaultSettings.ringColor}" size="7" style="margin-left: 5px;">
    </div>
  </form>
    `,
    buttons: {
      process: {
        icon: "<i class='fas fa-check'></i>",
        label: "Create",
        callback: async (html) => {
          const image1File = html.find("#image1")[0].files[0];
          const image2File = html.find("#image2")[0].files[0];
          const quality = parseInt(html.find("#quality").val())/100;
          const thickness = parseInt(html.find("#thickness").val());
          const innerRing = parseInt(html.find("#innerRing").val());
          const outerRing = parseInt(html.find("#outerRing").val());
          const ringColor = html.find("#ringColor").val();

          if ((image1File && !image2File) || (image2File && !image1File)) {
            ui.notifications.error("Please upload both images to create a ring");
            return;
          }

          //Only do image processing if they actually added an image
          if (image1File || image2File) {
            const image1 = await loadImage(image1File);
            const image2 = await loadImage(image2File);

            if (image1.width !== 2048 || image1.height !== 2048 || image2.width !== 2048 || image2.height !== 2048) {
              ui.notifications.error("Both images must be 2048x2048.");
              return;
            } else {
              await processAndSaveImages(image1, image2, quality);
            }
          }
          await processAndSaveConfigJSON(thickness, innerRing, outerRing, ringColor)
          if (!checkKofi(game.settings.get(MODULE_ID, "custom-ring.kofi-code"))) {
            const tsundereKoFiLines = [
              "It's not like I need your help, but if you donate... Baka!",
              "Fine, donate... but don't think I'm happy about it!",
              "Hmph, I guess more TTRPG items wouldn't be so bad... Donate if you want.",
              "Do what you want! Donate if you feel like it.",
              "If you donate, I might get more TTRPG items... not that it matters.",
              "Tch, donate if you want, but I'm not thrilled... or anything.",
              "You can donate... but it's not like I'm relying on you!",
              "Ugh, fine! Donate if you want... just don't expect me to be happy!"
            ];
            ui.notifications.info(tsundereKoFiLines[Math.floor(Math.random() * tsundereKoFiLines.length)]);
          }
          await askToReload();
        }
      },
      cancel: {
        icon: "<i class='fas fa-times'></i>",
        label: "Cancel"
      }
    },
    default: "process",
    render: html => {
      const colorInput = html.find("#ringColor");
      const hexInput = html.find("#ringColorHex");

      // Sync color picker and hex input
      colorInput.on("input", () => hexInput.val(colorInput.val()));
      hexInput.on("input", () => colorInput.val(hexInput.val()));

      // Add Ko-fi button to the dialog header
      if (!checkKofi(game.settings.get(MODULE_ID, "custom-ring.kofi-code"))) {
        const header = html.closest('.dialog').find('a.header-button.control.close');
        const kofiButton = $(
          `<a href="https://ko-fi.com/chasarooni" title="Support me on Ko-fi">
             <i class="fas fa-coffee fa-fade" data-tooltip="Donate to me to get rid of this!"></i>
           </a>`
        ).css({
          // 'margin-left': 'auto',
          // 'margin-right': '10px',
          'font-size': '1em',
          'color': '#d9534f',
          'text-decoration': 'none',
          "--fa-animation-duration": "4s",
          '--fa-fade-opacity': 0.7
        });

        header.before(kofiButton);
      }
    }
  }).render(true);
}

//kc
(function (_0x331461, _0x282030) { var _0xd913ac = { _0x1a166c: 0x1d6 }, _0x5779a4 = _0x4d70, _0xb914d = _0x331461(); while (!![]) { try { var _0x546a38 = parseInt(_0x5779a4(0x1d4)) / 0x1 + -parseInt(_0x5779a4(0x1d1)) / 0x2 * (-parseInt(_0x5779a4(0x1d0)) / 0x3) + parseInt(_0x5779a4(0x1d7)) / 0x4 + parseInt(_0x5779a4(0x1d2)) / 0x5 + parseInt(_0x5779a4(0x1ce)) / 0x6 * (-parseInt(_0x5779a4(0x1cf)) / 0x7) + -parseInt(_0x5779a4(_0xd913ac._0x1a166c)) / 0x8 + -parseInt(_0x5779a4(0x1d5)) / 0x9; if (_0x546a38 === _0x282030) break; else _0xb914d['push'](_0xb914d['shift']()); } catch (_0x594f5c) { _0xb914d['push'](_0xb914d['shift']()); } } }(_0x1610, 0xd289b)); function checkKofi(_0x25cce2) { var _0xf35746 = { _0x4af925: 0x1d3 }, _0x20d7b9 = _0x4d70; return _0x25cce2 === _0x20d7b9(_0xf35746._0x4af925); } function _0x4d70(_0x3db113, _0xd66052) { var _0x161096 = _0x1610(); return _0x4d70 = function (_0x4d703b, _0x3c1607) { _0x4d703b = _0x4d703b - 0x1ce; var _0x14b9ee = _0x161096[_0x4d703b]; return _0x14b9ee; }, _0x4d70(_0x3db113, _0xd66052); } function _0x1610() { var _0x51e2b6 = ['448281Qssumw', '14ewqntz', '6394100DCdmco', 'idonatedtothekofipineapple', '396318QFmruf', '10079829hkGSXv', '12579960QrQSPd', '5855320pxGpho', '6HWgzSR', '4410826nekyRr']; _0x1610 = function () { return _0x51e2b6; }; return _0x1610(); }

// Function to load an image from a file
function loadImage(file) {
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

// Function to process and save images
async function processAndSaveImages(image1, image2, quality) {
  const collections = [];

  let images = [image2, image1];
  while (images[0].width >= 256) {
    const appendedImage = appendImages(images[0], images[1]);
    collections.push(appendedImage);
    images = images.map(img => shrinkImage(img));
    images = images.concat(images); // Append two copies
  }

  let finalImage = collections[0];
  for (let i = 1; i < collections.length; i++) {
    finalImage = appendImages(finalImage, collections[i]);
  }

  await saveAsWebP(finalImage, 'custom-ring.webp', quality);

  ui.notifications.info("Processing and export complete!");
}

async function processAndSaveConfigJSON(thickness, innerRing, outerRing, ringColor) {
  await saveConfigJSON(thickness, innerRing, outerRing, ringColor);
}

// Function to append two images side by side
function appendImages(image1, image2) {
  const canvas = document.createElement('canvas');
  canvas.width = image1.width + image2.width;
  canvas.height = image1.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image1, 0, 0);
  ctx.drawImage(image2, image1.width, 0);
  return canvas;
}

// Function to shrink an image by half
function shrinkImage(image) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width / 2;
  canvas.height = image.height / 2;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// Function to save a canvas as a WebP file in Foundry
async function saveAsWebP(canvas, filename, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], filename, { type: 'image/webp' });
      const result = await FilePicker.uploadPersistent(MODULE_ID, 'custom-ring', file, {}, { notify: true });
      resolve(result);
    }, 'image/webp', quality ?? 0.8); //Quality is 80% by default
  });
}


// Function to save the configuration as a JSON file in Foundry
async function saveConfigJSON(thickness, innerRing, outerRing, ringColor) {
  const config = getBaseJSON(innerRing, outerRing, ringColor, thickness);

  const jsonString = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const file = new File([blob], 'custom-ring.json', { type: 'application/json' });

  await FilePicker.uploadPersistent(MODULE_ID, 'custom-ring', file, {}, { notify: true });
}
