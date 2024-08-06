export class RingDialog extends Dialog {
  constructor(rings, authors, ringActivationMap, ...args) {
    super(...args);

    this.rings = rings;
    this.authors = authors;
    this.ringActivationMap = ringActivationMap;
    this.render();
  }

  activateListeners(html) {
    super.activateListeners(html);

    // Handle form submission
    html.find('button[name="submit"]').click(() => this._onSubmit(html));
  }

  _onSubmit(html) {
    const updatedMap = {};

    html.find('input[type="checkbox"]').each((index, element) => {
      updatedMap[element.dataset.id] = element.checked;
    });

    new Dialog({
      title: "Reload?",
      content: "<p>Do you want to reload?</p>",
      buttons: {
        yes: {
          label: "Yes",
          callback: () => location.reload(),
        },
        no: {
          label: "No",
        },
      },
    }).render(true);

    console.log(updatedMap); // For now, logging the updated map. Replace this with the desired functionality.
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: "Ring Activation",
      template: "modules/more-dynamic-token-rings/templates/ring-config.hbs", // You need to create a Handlebars template.
      width: 800,
      height: "auto",
      classes: ["ring-dialog"],
    });
  }

  getData() {
    const rings = this.rings.map((ring) => {
      const author = this.authors.find((author) => author.name === ring.author);
      return {
        ...ring,
        authorLink: author ? author.link : "#",
        isActive: this.ringActivationMap[ring.id] || false,
      };
    });
    console.log({ rings });
    return {
      rings,
    };
  }
}
