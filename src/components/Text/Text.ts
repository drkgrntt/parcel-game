import { BaseElement } from "../../abstracts/BaseElement/BaseElement";
import template from "./Text.html";

export const TEXT_ELEMENT_NAME = "g-text";
export const TEXT_CONTAINER_SELECTOR = ".text-container";

export class Text extends BaseElement {
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

  #disappear() {
    this.shadowRoot
      .querySelector<HTMLDivElement>(TEXT_CONTAINER_SELECTOR)
      ?.style.setProperty("--display", "none");
  }

  #appear() {
    this.shadowRoot
      .querySelector<HTMLDivElement>(TEXT_CONTAINER_SELECTOR)
      ?.style.setProperty("--display", "flex");
  }

  #updateText() {
    if (!this.#textSlot) {
      return;
    }
    this.#appear();

    const text = this.#textQueue.shift();
    this.#textSlot.textContent = "";

    if (!text) {
      this.#disappear();
      return;
    }

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

customElements.get(TEXT_ELEMENT_NAME) ??
  customElements.define(TEXT_ELEMENT_NAME, Text);
