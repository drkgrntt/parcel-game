import { getRandom } from "../../utils";
import { BaseElement } from "../BaseElement";
import template from "./GameTile.html";

const GREENS = ["#0c0", "#0e0", "#0d0"];

export class GameTile extends BaseElement {
  constructor() {
    super();
    this.template = template;
  }

  templateSetCallback(): void {
    this.setColor();
  }

  setColor() {
    const color = getRandom(GREENS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(".tile")
      .style.setProperty("--color", color);
  }
}

customElements.get("game-tile") ?? customElements.define("game-tile", GameTile);
