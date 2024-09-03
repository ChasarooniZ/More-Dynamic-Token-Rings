export function isVersionBetween(versionToCheck, minVersion, maxVersion) {
    function normalizeVersion(version) {
        return version.split('-')[0]; // Remove anything after the dash
    }

    function compareVersions(v1, v2) {
        const parts1 = v1.split('.').map(Number);
        const parts2 = v2.split('.').map(Number);

        for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            const part1 = parts1[i] || 0;
            const part2 = parts2[i] || 0;

            if (part1 < part2) return -1;
            if (part1 > part2) return 1;
        }

        return 0;
    }

    const normVersionToCheck = normalizeVersion(versionToCheck);
    const normMinVersion = normalizeVersion(minVersion);
    const normMaxVersion = normalizeVersion(maxVersion);
    
    return compareVersions(normMinVersion, normVersionToCheck) <= 0 &&
        compareVersions(normVersionToCheck, normMaxVersion) <= 0;
}
