import { MODULE_ID } from "../const.js";

/**
 *
 * @param {*} ringID ID of ring to switch to if you reload this way
 * @returns
 */

export async function askToReload(ringID = null) {
  return new Dialog({
    title: game.i18n.localize(MODULE_ID + ".dialog.reload.title"),
    content: `<p>${game.i18n.localize(
      MODULE_ID + ".dialog.reload.content"
    )}</p>${ringID ? `<p>${game.i18n.localize(MODULE_ID + ".hover-text.click-ring-warning")}</p>` : ""}`,
    buttons: {
      yes: {
        label: game.i18n.localize(
          MODULE_ID + ".dialog.reload.buttons.yes"
        ),
        callback: async () => {
          if (ringID !== null) {
            if (Object.keys(CONFIG.Token.ring.configLabels).includes(ringID)) {
              await game.settings.set("core", "dynamicTokenRing", ringID)
            } else {
              game.settings.set(MODULE_ID, "set-ring-to", ringID);
            }
          } else {
            await game.settings.set(MODULE_ID, "open-ring-config", true);
          }
          foundry.utils.debouncedReload();
        }
      },
      no: {
        label: game.i18n.localize(
          MODULE_ID + ".dialog.reload.buttons.no"
        ),
      },
    },
  }).render(true);
}
