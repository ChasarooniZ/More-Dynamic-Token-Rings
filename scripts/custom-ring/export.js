export async function downloadCustomRing() {
    return downloadFiles("modules/more-dynamic-token-rings/storage/custom-ring/custom-ring.webp", "modules/more-dynamic-token-rings/storage/custom-ring/custom-ring.json")
}

async function downloadFiles(imagePath, jsonPath) {
    // Fetch and download the image as a PNG
    try {
        const imageResponse = await fetch(imagePath);
        const imageBlob = await imageResponse.blob();

        // Convert WebP image to PNG
        const webpImage = await createImageBitmap(imageBlob);
        const canvas = document.createElement("canvas");
        canvas.width = webpImage.width;
        canvas.height = webpImage.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(webpImage, 0, 0);

        const pngBlob = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
        saveDataToFile(pngBlob, "png", "custom-ring.png");
    } catch (error) {
        console.error(game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.error.failed-to-download.image'), error);
    }

    // Fetch and download the JSON file
    try {
        const jsonResponse = await fetch(jsonPath);
        const jsonBlob = await jsonResponse.blob();
        saveDataToFile(jsonBlob, "json", "custom-ring.json");
    } catch (error) {
        console.error(game.i18n.localize(MODULE_ID + '.module-settings.custom-ring.menu.error.failed-to-download.json'), error);
    }
}