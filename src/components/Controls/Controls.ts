import { BaseElement } from "../../abstracts/BaseElement/BaseElement";
import template from "./Controls.html";

class Controls extends BaseElement {
  #scales = [0.4, 0.6, 0.8, 1, 1.5, 2, 3, 4];
  #scaleIndex = this.#scales.indexOf(1);

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
    if (this.#scaleIndex >= this.#scales.length - 1) return;
    this.#scaleIndex++;
    document.documentElement.style.setProperty(
      "--scale",
      this.#scales[this.#scaleIndex].toString()
    );
  }

  #zoomOut(event: MouseEvent) {
    if (this.#scaleIndex <= 0) return;
    this.#scaleIndex--;
    document.documentElement.style.setProperty(
      "--scale",
      this.#scales[this.#scaleIndex].toString()
    );
  }
}

customElements.get("g-controls") ??
  customElements.define("g-controls", Controls);
