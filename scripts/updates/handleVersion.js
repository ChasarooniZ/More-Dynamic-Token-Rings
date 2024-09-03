import { TOURS } from "./tourList.js";
import { isVersionBetween } from "./versionChecker.js";

export function handleVersion(oldVersion, newVersion) {
    if (!oldVersion) oldVersion = '0.0.0';
    const relevantTours = Object.keys(TOURS).filter(t => isVersionBetween(t, oldVersion, newVersion))
    for (const tour in relevantTours) {
        TOURS[tour].start();
    }
}