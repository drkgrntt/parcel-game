import { log } from "../../utils/logger";
import { BaseElement } from "../BaseElement";
import template from "./GameText.html";

export class GameText extends BaseElement {
  #textSlot: HTMLSlotElement;
  #textQueue: string[] = [];

  constructor() {
    super();
    this.template = template;
  }

  get text() {
    return this.#textSlot?.textContent;
  }

  set text(value: string) {
    if (value.length < 200) {
      this.#textQueue.push(value);
    } else {
      for (const sentense of value.split(". ")) {
        this.#textQueue.push(`${sentense}.`);
      }
    }
    this.#updateText();
  }

  #updateText() {
    if (!this.#textSlot) {
      return;
    }

    const text = this.#textQueue.shift();
    this.#textSlot.textContent = "";

    if (!text) return;
    log(text);

    this.#animateText(text ?? "");
  }

  async #animateText(text: string) {
    setTimeout(() => {
      if (!text) {
        setTimeout(() => this.#updateText(), 3000);
        return;
      }
      this.#textSlot.textContent += text[0];
      this.#animateText(text.substring(1));
    }, 50);
  }

  templateSetCallback(): void {
    this.#textSlot = this.shadowRoot.querySelector("slot");
    this.#updateText();
  }
}

customElements.get("game-text") ?? customElements.define("game-text", GameText);
