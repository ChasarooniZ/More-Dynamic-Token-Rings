import { MODULE_ID } from "../../const.js";
const prefix = MODULE_ID + '.tours.custom.full.'
export const customRingFullTour = () => {
    const t = new Tour({
        namespace: "core",
        id: "sett-custom-ring-menu-tour",
        title: "SETT Custom Ring",
        steps: [
            {
                title: `${prefix}${1}.title`,
                selector: 'p.SETT.custom-ring.guide',
                content: `${prefix}${1}.content`,
            },
            {
                title: `${prefix}${2}.title`,
                selector: 'span.SETT.custom-ring.spritesheet',
                content: `${prefix}${2}.content`,
            },
            {
                title: `${prefix}${3}.title`,
                selector: 'span.SETT.custom-ring.json',
                content: `${prefix}${3}.content`,
            },
            {
                title: `${prefix}${4}.title`,
                selector: 'button.dialog-button.create',
                content: `${prefix}${4}.content`,
            },
            {
                title: `${prefix}${5}.title`,
                selector: 'button.dialog-button.export',
                content: `${prefix}${5}.content`,
            },
            {
                title: `${prefix}${6}.title`,
                selector: 'div.app.window-app.dialog',
                content: `${prefix}${6}.content`,
            }
        ]
    })
    t.start();
}

