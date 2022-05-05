import {
  CONTROLS_ELEMENT,
  ZOOM_IN_EVENT,
  ZOOM_OUT_EVENT,
} from "../../constants/controls";
import {
  TEXT_CONTAINER_SELECTOR,
  TEXT_ELEMENT_NAME,
} from "../../constants/text";
import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import { Controls } from "../Controls/Controls";
import template from "./Text.html";

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
      for (const line of value.split("\n")) {
        for (const sentense of line.split(". ")) {
          this.#textQueue.push(`${sentense}.`.replace("..", "."));
        }
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
    super.templateSetCallback();
    this.#textSlot = this.shadowRoot.querySelector("slot");
    this.#updateText();
    this.#handleZoomEvents();
  }

  #handleZoomEvents() {
    const controls = document.querySelector<Controls>(CONTROLS_ELEMENT);
    this.createEventListener(
      ZOOM_IN_EVENT,
      this.#setPosition.bind(this),
      controls
    );
    this.createEventListener(
      ZOOM_OUT_EVENT,
      this.#setPosition.bind(this),
      controls
    );
  }

  #setPosition() {
    const controls = document.querySelector<Controls>(CONTROLS_ELEMENT);
    const textBox = this.shadowRoot.querySelector<HTMLDivElement>(
      TEXT_CONTAINER_SELECTOR
    );
    if (controls.scale > 1) {
      textBox.style.setProperty("--position", "sticky");
    } else {
      textBox.style.setProperty("--position", "absolute");
    }
  }
}

customElements.get(TEXT_ELEMENT_NAME) ??
  customElements.define(TEXT_ELEMENT_NAME, Text);
