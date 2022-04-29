import { log } from "../../utils/logger";
import { getRandom } from "../../utils";
import { BaseElement } from "../BaseElement";
import template from "./GameTile.html";
import { sendEvent } from "../../utils/events";

const GREENS = ["#0c0", "#0e0", "#0d0"];

export class GameTile extends BaseElement {
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
    log("clicked!", event);
    sendEvent("tile-selected", this);
  }
}

customElements.get("game-tile") ?? customElements.define("game-tile", GameTile);
