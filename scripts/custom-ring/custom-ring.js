import { getBaseJSON } from "./customRingJsonCfg.js";
import { MODULE_BASE_PATH, MODULE_ID, effects } from "../const.js";
import { askToReload } from "../dialog/askToReloadDialog.js";
import { downloadCustomRing } from "./export.js";
import { convertText } from "../hooks.js";

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
  }); game.settings.register(MODULE_ID, pre + "ring-thickness", {
    name: game.i18n.localize(path + "ring-thickness" + ".name"),
    hint: game.i18n.localize(path + "ring-thickness" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: false,
    default: 0.11,
    type: Number,
  });

  game.settings.register(MODULE_ID, pre + "color-band.start", {
    name: game.i18n.localize(path + "color-band.start" + ".name"),
    hint: game.i18n.localize(path + "color-band.start" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: false,
    default: 0,
    type: Number,
  });

  game.settings.register(MODULE_ID, pre + "color-band.end", {
    name: game.i18n.localize(path + "color-band.end" + ".name"),
    hint: game.i18n.localize(path + "color-band.end" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: false,
    default: 1,
    type: Number,
  });

  game.settings.register(MODULE_ID, pre + "color-band.color", {
    name: game.i18n.localize(path + "color-band.color" + ".name"),
    hint: game.i18n.localize(path + "color-band.color" + ".hint"),
    requiresReload: false,
    scope: "world",
    config: false,
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
    console.error(game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.error.does-not-exist'))
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
    convertText(usName),
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
  const IMGS = {
    ring: 'https://raw.githubusercontent.com/ChasarooniZ/More-Dynamic-Token-Rings/custom-rings/previews/tutorial/dynamic-ring.gif',
    bg: 'https://raw.githubusercontent.com/ChasarooniZ/More-Dynamic-Token-Rings/custom-rings/previews/tutorial/dynamic-bg.gif',
    thickness: 'https://raw.githubusercontent.com/ChasarooniZ/More-Dynamic-Token-Rings/custom-rings/previews/tutorial/dynamic-coloration-thickness.webp',
    inner: 'https://raw.githubusercontent.com/ChasarooniZ/More-Dynamic-Token-Rings/custom-rings/previews/tutorial/dynamic-coloration-inner.webp',
    outer: 'https://raw.githubusercontent.com/ChasarooniZ/More-Dynamic-Token-Rings/custom-rings/previews/tutorial/dynamic-coloration-outer.webp',
    color: 'https://raw.githubusercontent.com/ChasarooniZ/More-Dynamic-Token-Rings/custom-rings/previews/tutorial/dynamic-coloration-color.webp',
  }

  const prefix = MODULE_ID + '.module-settings.custom-ring.menu.fields.';

  new Dialog({
    title: game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.header'),
    content: `
    <p><a href="https://github.com/ChasarooniZ/More-Dynamic-Token-Rings/blob/custom-rings/CUSTOM_RING_GUIDE.md">${game.i18n.localize(MODULE_ID + ".module-settings.custom-ring.menu.content.link-to-guide")}</a></p>
    <form>
    <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "token-img.ring.tooltip"
    )}<img src='${IMGS.ring}'>" data-tooltip-direction="LEFT">
      <label>${game.i18n.localize(prefix + "token-img.ring.label")}:</label>
      <input type="file" id="image1" accept="image/*">
    </div>
    <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "token-img.background.tooltip"
    )}<img src='${IMGS.bg}'>" data-tooltip-direction="LEFT">
      <label>${game.i18n.localize(prefix + "token-img.background.label")}:</label>
      <input type="file" id="image2" accept="image/*">
    </div>
    <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "token-img.quality.tooltip"
    )}" data-tooltip-direction="LEFT">
      <label>${game.i18n.localize(prefix + "token-img.quality.label")} (%):</label>
      <input type="number" id="quality" value="80" min="1">
    </div>
    <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "thickness.tooltip"
    )}<img src='${IMGS.thickness}'>" data-tooltip-direction="LEFT">
      <label>${game.i18n.localize(prefix + "thickness.label")}:</label>
      <input type="number" id="thickness" value="${defaultSettings.thickness}" min="1">
    </div>
    <h3>${game.i18n.localize(prefix + "coloration.label")}</h3>
    <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "coloration.inner.tooltip"
    )}<img src='${IMGS.inner}'>" data-tooltip-direction="LEFT">
      <label>${game.i18n.localize(prefix + "coloration.inner.label")}:</label>
      <input type="number" id="innerRing" value="${defaultSettings.innerRing}" min="1">
    </div>
    <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "coloration.outer.tooltip"
    )}<img src='${IMGS.outer}'>" data-tooltip-direction="LEFT">
      <label>${game.i18n.localize(prefix + "coloration.outer.label")}:</label>
      <input type="number" id="outerRing" value="${defaultSettings.outerRing}" min="1">
    </div>
    <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "coloration.color.tooltip"
    )}<img src='${IMGS.color}'>" data-tooltip-direction="LEFT">
      <label>${game.i18n.localize(prefix + "coloration.color.label")}:</label>
      <input type="color" id="ringColor" value="${defaultSettings.ringColor}">
      <input type="text" id="ringColorHex" value="${defaultSettings.ringColor}" size="7" style="margin-left: 5px;">
    </div>
  </form>
    `,

    buttons: {
      create: {
        icon: "<i class='fas fa-check'></i>",
        label: game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.buttons.create.label'),
        callback: async (html) => {
          const image1File = html.find("#image1")[0].files[0];
          const image2File = html.find("#image2")[0].files[0];
          const quality = parseInt(html.find("#quality").val()) / 100;
          const thickness = parseFloat(html.find("#thickness").val());
          const innerRing = parseFloat(html.find("#innerRing").val());
          const outerRing = parseFloat(html.find("#outerRing").val());
          const ringColor = html.find("#ringColor").val();

          if ((image1File && !image2File) || (image2File && !image1File)) {
            ui.notifications.error(game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.error.upload-both'));
            return;
          }

          //Only do image processing if they actually added an image
          if (image1File || image2File) {
            const image1 = await loadImage(image1File);
            const image2 = await loadImage(image2File);

            if (image1.width !== 2048 || image1.height !== 2048 || image2.width !== 2048 || image2.height !== 2048) {
              ui.notifications.error(game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.error.2048-min'));
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
      export: {
        icon: "<i class='fas fa-file-export'></i>",
        label: game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.buttons.export.label'),
        callback: async () => {
          await downloadCustomRing();
        }
      },
      cancel: {
        icon: "<i class='fas fa-times'></i>",
        label: game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.buttons.cancel.label')
      }
    },
    default: "create",
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
          `<a href="https://ko-fi.com/chasarooni" title="${game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.icons.kofi.title')}">
             <i class="fas fa-coffee fa-fade" data-tooltip="${game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.icons.kofi.tooltip')}"></i>
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
function b(c, d) { var e = a(); return b = function (f, g) { f = f - 0x175; var h = e[f]; if (b['lZofUB'] === undefined) { var i = function (m) { var n = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/='; var o = '', p = ''; for (var q = 0x0, r, s, t = 0x0; s = m['charAt'](t++); ~s && (r = q % 0x4 ? r * 0x40 + s : s, q++ % 0x4) ? o += String['fromCharCode'](0xff & r >> (-0x2 * q & 0x6)) : 0x0) { s = n['indexOf'](s); } for (var u = 0x0, v = o['length']; u < v; u++) { p += '%' + ('00' + o['charCodeAt'](u)['toString'](0x10))['slice'](-0x2); } return decodeURIComponent(p); }; b['hfkodr'] = i, c = arguments, b['lZofUB'] = !![]; } var j = e[0x0], k = f + j, l = c[k]; return !l ? (h = b['hfkodr'](h), c[k] = h) : h = l, h; }, b(c, d); } function a() { var l = ['mtqZnMTtExD3tW', 'mta3nJe5nJbntNP1r3q', 'mtq2nZvzwwDjuLe', 'AwrVBMf0zwr0B3rOzwTVzMLWAw5LyxbWBgu', 'mJfkwxzTywW', 'offZuhzRDG', 'mZy1nJiWnufJvfndCW', 'ndi2mda1muTOs0r6vG', 'mtC4mJy3mLbzt2X2Bq', 'mte3ndK4CKPMALrV', 'mZm4mZq2CuLVqvne']; a = function () { return l; }; return a(); } (function (c, d) { var h = b, e = c(); while (!![]) { try { var f = -parseInt(h(0x178)) / 0x1 + parseInt(h(0x179)) / 0x2 * (parseInt(h(0x17e)) / 0x3) + -parseInt(h(0x17a)) / 0x4 * (parseInt(h(0x17c)) / 0x5) + -parseInt(h(0x177)) / 0x6 + parseInt(h(0x175)) / 0x7 + parseInt(h(0x17f)) / 0x8 * (-parseInt(h(0x176)) / 0x9) + parseInt(h(0x17b)) / 0xa; if (f === d) break; else e['push'](e['shift']()); } catch (g) { e['push'](e['shift']()); } } }(a, 0xcd594)); function checkKofi(c) { var i = b; return c === i(0x17d); }

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
  game.settings.set(MODULE_ID, "custom-ring.ring-thickness", thickness)
  game.settings.set(MODULE_ID, "custom-ring.color-band.start", innerRing)
  game.settings.set(MODULE_ID, "custom-ring.color-band.end", outerRing)
  game.settings.set(MODULE_ID, "custom-ring.color-band.color", Color.fromString(ringColor))

  const jsonString = JSON.stringify(config, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const file = new File([blob], 'custom-ring.json', { type: 'application/json' });

  await FilePicker.uploadPersistent(MODULE_ID, 'custom-ring', file, {}, { notify: true });
}
