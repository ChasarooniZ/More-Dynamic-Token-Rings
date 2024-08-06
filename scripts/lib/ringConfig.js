export class RingDialog extends ApplicationV2 {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Ring Activation",
      template: "path/to/your/template.hbs",
      width: 600,
      height: "auto",
      classes: ["ring-dialog"],
      resizable: true,
    });
  }

  constructor(ringData, authorData, ringMap) {
    super();
    this.ringData = ringData;
    this.authorData = authorData;
    this.ringMap = ringMap;
  }

  getData() {
    return {
      rings: this.ringData.map((ring) => ({
        ...ring,
        authorLink:
          this.authorData.find((author) => author.name === ring.author)?.link ||
          "#",
        isActive: this.ringMap[ring.id] || false,
      })),
    };
  }

  activateListeners(html) {
    super.activateListeners(html);
    html.find(".ring-checkbox").change(this._onCheckboxChange.bind(this));
    html.find(".reload-button").click(this._onReloadClick.bind(this));
  }

  _onCheckboxChange(event) {
    const ringId = event.currentTarget.dataset.ringId;
    this.ringMap[ringId] = event.currentTarget.checked;
  }

  _onReloadClick(event) {
    new Dialog({
      title: "Reload",
      content: "<p>Do you want to reload?</p>",
      buttons: {
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: "Yes",
          callback: () => window.location.reload(),
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: "No",
        },
      },
      default: "yes",
    }).render(true);
  }

  async _updateObject(event, formData) {
    return this.ringMap;
  }
}

// Example usage
const RINGS = [
  { label: "Ring", id: "ring.id", author: "Steve", preview: "ring-id.webp" },
];

const AUTHORS = [
  { name: "Steve", link: "https://www.rptools.net/toolbox/token-tool/" },
];

const ringMap = { "ring.id": true };

new RingDialog(RINGS, AUTHORS, ringMap).render(true);
