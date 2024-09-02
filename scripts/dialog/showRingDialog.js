import { RINGS } from "../ringHelpers.js";
import { AUTHORS } from "../authorList.js";
import { MODULE_ID } from "../const.js";
import { getMap } from "../module";
import { askToReload } from "./askToReloadDialog";


export async function showRingDialog() {
  const ringActivationMap = getMap();
  const old_rings = game.settings.get(MODULE_ID, "old-rings");
  const new_rings = RINGS.filter((ring) => !old_rings.includes(ring.id)).map(
    (ring) => ring.id
  );

  async function generateDialogContent(rings, authors, ringActivationMap, new_rings) {
    let con = `
    <style>
      .ring-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        overflow-y: auto;
        max-height: calc(80vh - 200px); /* Adjust based on desired height */
      }
      .ring-item {
        border: 1px solid #ccc;
        padding: 10px;
        border-radius: 5px;
      }
      .ring-item h3 {
        margin: 5px 0;
      }
      .ring-item img {
        max-width: 100%;
        height: auto;
      }
      .ring-item h4 {
        margin: 5px 0;
        display: inline-block;
        width: calc(100% - 30px); /* Adjusted width to accommodate the checkbox */
        vertical-align: middle;
      }
      
      .ring-item label {
        float: right;
        margin-right: 0; /* Ensures the checkbox is aligned with the right edge */
        vertical-align: middle; /* Aligns the checkbox with the middle of the author's name */
      }
      #ring-search {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 16px;
      }
    </style>
    <form>
      <input type="text" id="ring-search" placeholder="Search by Ring Name or Author">
      <div class="ring-grid">`;

    rings.forEach((ring) => {
      const author = authors.find((auth) => auth.name === ring.author);
      const authorLink = author ? author.link : "#";
      const isActive = ringActivationMap[ring.id] || false;

      con += `
      <div class="ring-item" data-ring-name="${ring.name.toLowerCase()}" data-author-name="${ring.author.toLowerCase()}">
        <h3>${new_rings.includes(ring.id)
          ? '<i class="fa-solid fa-circle-exclamation" data-tooltip="' +
          game.i18n.localize(MODULE_ID + ".hover-text.new-ring") +
          '" data-tooltip-direction="UP"></i> '
          : ""}${ring.name}</h3>
        <h4><a href="${authorLink}">${ring.author}</a></h4>
        <label>
          <input type="checkbox" data-tooltip="Enable Ring" data-tooltip-direction="UP" data-id="${ring.id}" ${isActive ? "checked" : ""}>
        </label>
        <img src="${ring.preview}" alt="${ring.label}" data-ring-id="${ring.id}">
      </div>`;
    });

    con += `
    </div>
    <div class="dialog-buttons">
      <button type="button" name="submit">Submit</button>
    </div>
  </form>`;

    return con;
  }


  const content = generateDialogContent(
    RINGS,
    AUTHORS,
    ringActivationMap,
    new_rings
  );

  const dialog = new Dialog({
    title: "Ring Activation",
    content: content,
    buttons: {},
    render: (html) => {
      // Make the dialog wider
      //html.closest(".dialog").css({ width: "800px" });
      // Implement search functionality
      const searchInput = html.find('#ring-search');
      searchInput.on('input', function () {
        const searchTerm = searchInput.val().toLowerCase();
        html.find('.ring-item').each(function () {
          const ringName = $(this).data('ring-name');
          const authorName = $(this).data('author-name');
          if (ringName.includes(searchTerm) || authorName.includes(searchTerm)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });
      html.find('.ring-item img').on('click', function() {
        const ringId = $(this).data('ring-id');
        console.log('Clicked ring ID:', ringId);
      });

      html.find('button[name="submit"]').click(async () => {
        const updatedMap = {};

        html.find('input[type="checkbox"]').each((_index, element) => {
          updatedMap[element.dataset.id] = element.checked;
          game.settings.set(MODULE_ID, element.dataset.id, element.checked);
        });

        console.log(updatedMap); // For now, logging the updated map. Replace this with the desired functionality.
        ui.notifications.notify(
          game.i18n.localize(MODULE_ID + ".notifications.ring-list-saved")
        );
        await askToReload();
        dialog.close();
      });
    },
  }).render(true, { width: 1000, height: 700, top: 50 });
  game.settings.set(
    MODULE_ID,
    "old-rings",
    RINGS.map((ring) => ring.id)
  );
}
