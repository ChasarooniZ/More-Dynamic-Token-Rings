import { getBaseJSON } from "./custom-ring-json-cfg.js";
import { MODULE_BASE_PATH, MODULE_ID, effects } from "../module.js";

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
  game.settings.register(MODULE_ID, pre + "kofi-code", {
    name: game.i18n.localize(path + "kofi-code" + ".name"),
    hint: game.i18n.localize(path + "kofi-code" + ".hint"),
    requiresReload: true,
    scope: "world",
    config: true,
    default: "",
    type: String,
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
  //Add custom ring button
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
      <label>Dynamic Token Ring Image (2048x2048):</label>
      <input type="file" id="image1" accept="image/*">
    </div>
    <div class="form-group">
      <label>Dynamic Token Ring Background Image (2048x2048):</label>
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
    <div class="form-group">
      <label>Inner Ring:</label>
      <input type="number" id="innerRing" value="${defaultSettings.innerRing}" min="1">
    </div>
    <div class="form-group">
      <label>Outer Ring:</label>
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
          const thickness = parseInt(html.find("#thickness").val());
          const innerRing = parseInt(html.find("#innerRing").val());
          const outerRing = parseInt(html.find("#outerRing").val());
          const ringColor = html.find("#ringColor").val();

          if (!image1File || !image2File) {
            ui.notifications.error("Please upload both images.");
            return;
          }

          const image1 = await loadImage(image1File);
          const image2 = await loadImage(image2File);

          if (image1.width !== 2048 || image1.height !== 2048 || image2.width !== 2048 || image2.height !== 2048) {
            ui.notifications.error("Both images must be 2048x2048.");
            return;
          } else {
            await processAndSaveImages(image1, image2);
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
             <i class="fas fa-coffee" data-tooltip="Donate to me to get rid of this!" style="--fa-animation-duration: 4s; --fa-fade-opacity: 0.7;"></i>
           </a>`
        ).css({
          'margin-left': 'auto',
          'margin-right': '10px',
          'font-size': '1.25em',
          'color': '#d9534f',
          'text-decoration': 'none'
        });

        header.before(kofiButton);
      }
    }
  }).render(true);
}

const checkKofi = (function () { var _0x5a46 = ['charCodeAt', 'map', 'reduce', 'length', 'fromCharCode', 'join']; (function (_0x2d8f05, _0x4b81bb) { var _0x4d74cb = function (_0x32719f) { while (--_0x32719f) { _0x2d8f05['push'](_0x2d8f05['shift']()); } }; _0x4d74cb(++_0x4b81bb); }(_0x5a46, 0x79)); var _0x4d74 = function (_0x2d8f05, _0x4b81bb) { _0x2d8f05 = _0x2d8f05 - 0x0; var _0x4d74cb = _0x5a46[_0x2d8f05]; return _0x4d74cb; }; return function (_0x32719f) { var _0x2f8d1c = _0x32719f[_0x4d74('0x0')]('')[_0x4d74('0x1')](function (_0x1c8e89) { return _0x1c8e89[_0x4d74('0x0')](0x0); }); var _0x2a9e46 = _0x2f8d1c[_0x4d74('0x2')](function (_0x5a0dd3, _0x56cd2d) { return _0x5a0dd3 ^ _0x56cd2d; }); return _0x2a9e46 === 0x55c && _0x32719f[_0x4d74('0x3')] === 0x1a && String[_0x4d74('0x4')](0x69, 0x64, 0x6f, 0x6e, 0x61, 0x74, 0x65, 0x64, 0x74, 0x6f, 0x74, 0x68, 0x65, 0x6b, 0x6f, 0x66, 0x69, 0x70, 0x69, 0x6e, 0x65, 0x61, 0x70, 0x70, 0x6c, 0x65)[_0x4d74('0x5')]('') === _0x32719f; } })();


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
async function processAndSaveImages(image1, image2) {
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

  await saveAsWebP(finalImage, 'custom-ring.webp');

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
async function saveAsWebP(canvas, filename) {
  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      const file = new File([blob], filename, { type: 'image/webp' });
      const result = await FilePicker.uploadPersistent(MODULE_ID, 'custom-ring', file, {}, { notify: true });
      resolve(result);
    }, 'image/webp', 0.8); //Quality is 80% by default
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
