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
    )}</p>`,
    buttons: {
      yes: {
        label: game.i18n.localize(
          MODULE_ID + ".dialog.reload.buttons.yes"
        ),
        callback: () => {
          if (ringID !== null) {
            game.settings.set(MODULE_ID, "set-ring-to", ringID);
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
