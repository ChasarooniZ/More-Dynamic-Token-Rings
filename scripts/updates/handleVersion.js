import { TOURS } from "./tourList.js";
import { isVersionBetween } from "./versionChecker.js";

export function handleVersion(oldVersion, newVersion) {
    if (!oldVersion) oldVersion = '0.0.0';
    const toursRun = game.settings.get(MODULE_ID,"tours-run");
    const relevantTours = Object.keys(TOURS).filter(t => isVersionBetween(t, oldVersion, newVersion) && !toursRun.includes(t))
    for (const tour of relevantTours) {
        TOURS[tour]();
        toursRun.push(tour);
        game.settings.set(MODULE_ID,"tours-run", toursRun)
    }
}