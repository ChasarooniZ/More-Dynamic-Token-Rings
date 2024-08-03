const MODULE_BASE_PATH = "modules/more-dynamic-token-rings/";
const effects = {
  RING_PULSE: "TOKEN.RING.EFFECTS.RING_PULSE",
  RING_GRADIENT: "TOKEN.RING.EFFECTS.RING_GRADIENT",
  BKG_WAVE: "TOKEN.RING.EFFECTS.BKG_WAVE",
  INVISIBILITY: "TOKEN.RING.EFFECTS.INVISIBILITY",
};
Hooks.once("init", async function () {
  // Create a hook to add a custom token ring configuration. This ring configuration will appear in the settings.
  Hooks.on("initializeDynamicTokenRingConfig", (ringConfig) => {
    const tokenToolChainsRing = new foundry.canvas.tokens.DynamicRingData({
      label: "Token Tool: Chains",
      effects,
      spritesheet:
        MODULE_BASE_PATH + "assets/rings/token-tool-chains-ring.json",
    });
    ringConfig.addConfig("tokenToolChainsRing", tokenToolChainsRing);
  });
});

//Hooks.once("ready", async function () {});
