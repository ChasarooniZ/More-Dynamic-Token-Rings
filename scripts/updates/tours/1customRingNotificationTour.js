import { MODULE_ID } from "../../const.js";

export const customRingTour = () => {
    const t =  new Tour({
        namespace: "core",
        id: "sett-custom-ring-notification-tour",
        title: game.i18n.localize(MODULE_ID + ".tours.custom.notification.title"),
        steps: [
            {
                title: game.i18n.localize(MODULE_ID + ".tours.custom.notification.title"),
                selector: 'section#ui-middle',
                content: game.i18n.localize(MODULE_ID + ".tours.custom.notification.step"),
                tooltipDirection: "CENTER"
            }
        ]
    })
    t.start();
}