import { MODULE_ID } from "../../const.js";

export const customRingTour = async () => {
    await ChatMessage.create({
        content: `<h2>${game.i18n.localize(MODULE_ID + ".tours.custom.notification.title")}</h2>
    <p>${game.i18n.localize(MODULE_ID + ".tours.custom.notification.step")}</p>`,
        whisper: ChatMessage.getWhisperRecipients("GM")
    })
}