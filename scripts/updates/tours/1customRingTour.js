export const customRingTour = () => {
    return new Tour({
        namespace: "core",
        id: "sett-custom-ring-notification-tour",
        title: game.i18n.localize(MODULE_ID + ".tours.custom.notification.title"),
        steps: [
            {
                title: game.i18n.localize(MODULE_ID + ".tours.custom.notification.title"),
                selector: '[data-tab="settings"]',
                content: game.i18n.localize(MODULE_ID + ".tours.custom.notification.step"),
            }
        ]
    })
}