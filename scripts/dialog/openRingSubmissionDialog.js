import { MODULE_ID } from "../const.js";

export async function submitRingDialog() {
  return Dialog.confirm({
    title: game.i18n.localize(MODULE_ID + ".dialog.ring-submission.title"),
    content: `<p>${game.i18n.localize(
      MODULE_ID + ".dialog.ring-submission.content"
    )}</p>`,
    yes: () => { window.open("https://github.com/ChasarooniZ/More-Dynamic-Token-Rings/issues/new/choose", '_blank').focus(); },
    no: () => { /* do something or return value */ },
  }).render(true);
}
