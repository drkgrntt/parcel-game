import { BaseElement } from "../BaseElement";
import template from "./Tile.html";
import { sendEvent } from "../../utils/events";
import { Position } from "../../types";

export type TileType = "grass";

export class Tile extends BaseElement {
  position: Position;
  type: TileType;

  constructor(position: Position, type: TileType) {
    super();
    this.template = template;
    this.position = position;
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
