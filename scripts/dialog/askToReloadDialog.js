import { MODULE_ID } from "../const.js";

/**
 *
 * @param {*} ringID ID of ring to switch to if you reload this way
 * @returns
 */

export async function askToReload(ringID) {
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
