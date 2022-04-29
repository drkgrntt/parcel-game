import { log } from "../../utils/logger";
import { getRandom } from "../../utils";
import { BaseElement } from "../BaseElement";
import template from "./Tile.html";
import { sendEvent } from "../../utils/events";

const GREENS = ["#0c0", "#0e0", "#0d0"];

export class Tile extends BaseElement {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    super();
    this.template = template;
    this.x = x;
    this.y = y;
  }

  templateSetCallback(): void {
    this.setColor();
    this.setClickHandler();
  }

  setColor() {
    const color = getRandom(GREENS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(".tile")
      .style.setProperty("--color", color);
  }

  setClickHandler() {
    this.createEventListener("mouseup", this.handleClick.bind(this), this);
  }

  handleClick(event: MouseEvent) {
    sendEvent("tile-selected", this);
  }
}

customElements.get("game-tile") ?? customElements.define("game-tile", Tile);
