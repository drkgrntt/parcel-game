import { BaseElement } from "../BaseElement/BaseElement";
import template from "./Tile.html";
import { sendEvent } from "../../utils/events";
import { Position } from "../../types";

export type TileType = "grass" | "dirt";

export class Tile extends BaseElement {
  position: Position;
  type: TileType;
  holding: BaseElement[] = [];

  constructor(position: Position, type: TileType) {
    super();
    this.template = template;
    this.position = position;
    this.type = type;
  }

  connectedCallback() {
    const [x, y] = this.position;
    this.createEventListener(
      `entering-position-${x}-${y}`,
      (event: CustomEvent) => {
        this.holding.push(event.detail);
      }
    );
    this.createEventListener(
      `exiting-position-${x}-${y}`,
      (event: CustomEvent) => {
        this.holding.splice(this.holding.indexOf(event.detail));
      }
    );
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
