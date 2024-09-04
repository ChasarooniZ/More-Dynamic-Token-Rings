import { MODULE_ID } from "../const.js";
import { askToReload } from "../dialog/askToReloadDialog.js";
import { downloadCustomRing } from "./export.js";
import { loadImage, processAndSaveImages, processAndSaveConfigJSON, checkKofi } from "./custom-ring.js";
import { customRingFullTour } from "../updates/tours/1.5customRingTourFull.js";

// Function to create the dialog box in Foundry VTT

export async function createCustomTokenRingDialog() {
  const defaultSettings = {
    quality: 80,
    thickness: game.settings.get(MODULE_ID, "custom-ring.ring-thickness") || 0.1,
    innerRing: game.settings.get(MODULE_ID, "custom-ring.color-band.start") || 0,
    outerRing: game.settings.get(MODULE_ID, "custom-ring.color-band.end") || 1,
    ringColor: game.settings.get(MODULE_ID, "custom-ring.color-band.color") || "#ffffff"
  };
  const IMG_BASE_URL = 'https://raw.githubusercontent.com/ChasarooniZ/More-Dynamic-Token-Rings/custom-rings/previews/tutorial/';
  const IMGS = {
    ring: IMG_BASE_URL + 'dynamic-ring.gif',
    bg: IMG_BASE_URL + 'dynamic-bg.gif',
    thickness: IMG_BASE_URL + 'dynamic-coloration-thickness.webp',
    inner: IMG_BASE_URL + 'dynamic-coloration-inner.webp',
    outer: IMG_BASE_URL + 'dynamic-coloration-outer.webp',
    color: IMG_BASE_URL + 'dynamic-coloration-color.webp',
  };

  const prefix = MODULE_ID + '.module-settings.custom-ring.menu.fields.';

  new Dialog({
    title: game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.header'),
    content: `
    <p class="SETT custom-ring guide">
    <a href="https://github.com/ChasarooniZ/More-Dynamic-Token-Rings/blob/custom-rings/CUSTOM_RING_GUIDE.md">${game.i18n.localize(MODULE_ID + ".module-settings.custom-ring.menu.content.link-to-guide")}</a>
  </p>
  <form>
    <span class="SETT custom-ring spritesheet">
      <h2>${game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.parts.spritesheet')}</h2>
      <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "token-img.ring.tooltip")} <img src='${IMGS.ring}'>" data-tooltip-direction="LEFT"> <label>${game.i18n.localize(prefix + "token-img.ring.label")}:</label>
        <input type="file" id="image1" accept="image/*">
      </div>
      <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "token-img.background.tooltip")} <img src='${IMGS.bg}'>" data-tooltip-direction="LEFT"> <label>${game.i18n.localize(prefix + "token-img.background.label")}:</label>
        <input type="file" id="image2" accept="image/*">
      </div>
    </span>
    <span class="SETT custom-ring json">
      <h2>${game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.parts.json')}</h2>
      <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "token-img.quality.tooltip")}" data-tooltip-direction="LEFT">
        <label>${game.i18n.localize(prefix + "token-img.quality.label")} (%):</label>
        <input type="number" id="quality" value="80" min="1">
      </div>
      <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "thickness.tooltip")} <img src='${IMGS.thickness}'>" data-tooltip-direction="LEFT"> <label>${game.i18n.localize(prefix + "thickness.label")}:</label>
        <input type="number" id="thickness" value="${defaultSettings.thickness}" min="1">
      </div>
      <span class="SETT custom-ring coloration">
        <h3>${game.i18n.localize(prefix + "coloration.label")}</h3>
        <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "coloration.inner.tooltip")} <img src='${IMGS.inner}'>" data-tooltip-direction="LEFT"> <label>${game.i18n.localize(prefix + "coloration.inner.label")}:</label>
          <input type="number" id="innerRing" value="${defaultSettings.innerRing}" min="1">
        </div>
        <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "coloration.outer.tooltip")} <img src='${IMGS.outer}'>" data-tooltip-direction="LEFT"> <label>${game.i18n.localize(prefix + "coloration.outer.label")}:</label>
          <input type="number" id="outerRing" value="${defaultSettings.outerRing}" min="1">
        </div>
        <div class="form-group" data-tooltip="${game.i18n.localize(prefix + "coloration.color.tooltip")} <img src='${IMGS.color}'>" data-tooltip-direction="LEFT"> <label>${game.i18n.localize(prefix + "coloration.color.label")}:</label>
          <input type="color" id="ringColor" value="${defaultSettings.ringColor}">
          <input type="text" id="ringColorHex" value="${defaultSettings.ringColor}" size="7" style="margin-left: 5px;">
        </div>
      </span>
    </span>
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
          await processAndSaveConfigJSON(thickness, innerRing, outerRing, ringColor);
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
          await submitRingDialog()
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

      const tourName = 'custom-ring-full';
      const toursRun = game.settings.get(MODULE_ID, "tours-run");
      
      if (!toursRun.includes(tourName)) {
        customRingFullTour();
        toursRun.push(tourName);
        game.settings.set(MODULE_ID, "tours-run", toursRun)
      }
    }
  }).render(true);
}
