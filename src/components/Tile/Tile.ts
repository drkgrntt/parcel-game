import { BaseElement } from "../BaseElement";
import template from "./Tile.html";
import { sendEvent } from "../../utils/events";

export type TileType = "grass";

export class Tile extends BaseElement {
  x: number;
  y: number;
  type: TileType;

  constructor(x: number, y: number, type: TileType) {
    super();
    this.template = template;
    this.x = x;
    this.y = y;
    this.type = type;
  }

  templateSetCallback(): void {
    this.setClickHandler();
  }

  setClickHandler() {
    this.createEventListener("mouseup", this.handleClick.bind(this), this);
  }

  handleClick(event: MouseEvent) {
    sendEvent("tile-selected", this);
  }
}

customElements.get("game-tile") ?? customElements.define("game-tile", Tile);
