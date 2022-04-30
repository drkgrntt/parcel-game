import { BaseElement } from "../../abstracts/BaseElement/BaseElement";
import template from "./Controls.html";

class Controls extends BaseElement {
  #minScale = 0.5;
  #maxScale = 5;
  #scale = 1;

  constructor() {
    super();
    this.template = template;
  }

  templateSetCallback(): void {
    console.log("controls template set");
    this.#addButtonControls();
  }

  #addButtonControls() {
    this.createEventListener(
      "click",
      this.#zoomIn.bind(this),
      this.shadowRoot.querySelector(".zoom.in")
    );

    this.createEventListener(
      "click",
      this.#zoomOut.bind(this),
      this.shadowRoot.querySelector(".zoom.out")
    );
  }

  #zoomIn(event: MouseEvent) {
    if (this.#scale >= this.#maxScale) return;
    this.#scale *= 1.2;
    document.documentElement.style.setProperty(
      "--scale",
      this.#scale.toString()
    );
  }

  #zoomOut(event: MouseEvent) {
    if (this.#scale <= this.#minScale) return;
    this.#scale *= 0.8;
    document.documentElement.style.setProperty(
      "--scale",
      this.#scale.toString()
    );
  }
}

customElements.get("g-controls") ??
  customElements.define("g-controls", Controls);
