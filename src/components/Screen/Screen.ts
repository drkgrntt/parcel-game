import template from "./Screen.html";
import { BaseElement } from "../../abstracts/BaseElement/BaseElement";
import { Text } from "../Text/Text";
import { WELCOME } from "../../utils/texts";

export class Screen extends BaseElement {
  // Visible area
  #height = 40;
  #width = 60;

  constructor() {
    super();
    this.template = template;
  }
  set height(value: number) {
    this.#height = value;
    const screen = this.shadowRoot.querySelector<HTMLDivElement>(".screen");
    screen?.style.setProperty("--height", value.toString());
  }

  set width(value: number) {
    this.#width = value;
    const screen = this.shadowRoot.querySelector<HTMLDivElement>(".screen");
    screen?.style.setProperty("--width", value.toString());
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;
    const text = this.shadowRoot.querySelector<Text>("g-text");
    text.text = WELCOME;
  }
}

customElements.get("g-screen") ?? customElements.define("g-screen", Screen);
