import { RINGS } from "../ringHelpers.js";
import { AUTHORS } from "../authorList.js";
import { MODULE_ID } from "../const.js";
import { getMap } from "../module.js";
import { askToReload } from "./askToReloadDialog.js";
import { convertText } from "../hooks.js";

export async function showRingDialog() {
  const ringActivationMap = getMap();
  const old_rings = game.settings.get(MODULE_ID, "old-rings");
  const new_rings = RINGS.filter((ring) => !old_rings.includes(ring.id)).map(
    (ring) => ring.id
  );

  function generateDialogContent(rings, authors, ringActivationMap, new_rings) {
    let con = `
    <form>
      <input type="text" id="ring-search" placeholder="Search by Ring Name or Author">
      <div class="ring-grid">`;

    rings.forEach((ring) => {
      const author = authors.find((auth) => auth.name === ring.author);
      const authorLink = author ? author.link : "#";
      const isActive = ringActivationMap[ring.id] || false;

      con += `
      <div class="ring-item" data-ring-name="${ring.name.toLowerCase()}" data-author-name="${ring.author.toLowerCase()}">
        <h4>${
          new_rings.includes(ring.id)
            ? '<i class="fa-solid fa-circle-exclamation fa-beat-fade" style="--fa-beat-fade-opacity: 0.8; --fa-beat-fade-scale: 1.05; --fa-animation-duration: 1.5s;" data-tooltip="' +
              game.i18n.localize(MODULE_ID + ".hover-text.new-ring") +
              '" data-tooltip-direction="UP"></i> '
            : ""
        }${ring.name}</h4>
        <h5><a href="${authorLink}">${ring.author}</a></h5>
        <label>
          <input type="checkbox" data-tooltip="Enable Ring" data-tooltip-direction="UP" data-id="${
            ring.id
          }" ${isActive ? "checked" : ""}>
        </label>
      <img src="${ring.preview}" alt="${ring.label}" data-id="${
        ring.id
      }" data-ring-id="${convertText(
        ring.label
      )}" data-tooltip="${game.i18n.localize(
        MODULE_ID + ".hover-text.click-ring"
      )}<img src='https://raw.githubusercontent.com/ChasarooniZ/More-Dynamic-Token-Rings/main/previews/rings/${
        ring.id
      }.webp'>">
      </div>`;
    });

    return con;
  }

  const content = generateDialogContent(
    RINGS,
    AUTHORS,
    ringActivationMap,
    new_rings
  );

  const dialog = foundry.applications.api.DialogV2.wait({
    window: {
      title: "Ring Activation",
      controls: [
        {
          action: "kofi",
          label: "Support Dev",
          icon: "fa-solid fa-mug-hot fa-beat-fade",
          onClick: () => window.open("https://ko-fi.com/chasarooni", _blank),
        },
      ],
      icon: "fas fa-circle-notch",
    },
    content: content,
    buttons: [
      {
        action: "submit",
        label: "Submit",
        default: true,
        callback: async (event, button, dialog) => {
          const html = dialog.element ? dialog.element : dialog;
          const updatedMap = {};
          console.log({ event, button, dialog });
          $(html)
            .find('input[type="checkbox"]')
            .each((_index, element) => {
              updatedMap[element.dataset.id] = element.checked;
              game.settings.set(MODULE_ID, element.dataset.id, element.checked);
            });
          console.log(updatedMap); // For now, logging the updated map. Replace this with the desired functionality.
          ui.notifications.notify(
            game.i18n.localize(MODULE_ID + ".notifications.ring-list-saved")
          );
          await askToReload();
          dialog.close();
        },
      },
    ],
    render: (_event, app) => {
      console.log("-----------HI");
      const html = app.element ? app.element : app;
      console.log({ app, html, _event });
      // Implement search functionality
      const searchInput = $(html).find("#ring-search");
      searchInput.on("input", function () {
        const searchTerm = searchInput.val().toLowerCase();
        $(html)
          .find(".ring-item")
          .each(function () {
            const ringName = $(this).data("ring-name");
            const authorName = $(this).data("author-name");
            if (
              ringName.includes(searchTerm) ||
              authorName.includes(searchTerm)
            ) {
              $(this).show();
            } else {
              $(this).hide();
            }
          });
      });
      $(html)
        .find(".ring-item img")
        .on("click", function () {
          const ringId = $(this).data("ring-id");
          console.log("Clicked ring ID:", ringId);
          const settingID = $(this).data("id");
          game.settings.set(MODULE_ID, settingID, true);
          askToReload(ringId);
        });
    },
    position: {
      width: 1000,
      height: 750,
      top: 50,
    },
  });
  game.settings.set(
    MODULE_ID,
    "old-rings",
    RINGS.map((ring) => ring.id)
  );
}
