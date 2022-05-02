import { BaseElement } from "../../abstracts/BaseElement/BaseElement";
import template from "./Pawn.html";
import { PawnSpeed, Position } from "../../types";
import {
  POSITION_ENTER_EVENT,
  POSITION_EXIT_EVENT,
  Tile,
} from "../../abstracts/Tile/Tile";
import { sendEvent } from "../../utils/events";

export const PAWN_ELEMENT_NAME = "g-pawn";
export const PAWN_SELECTOR = ".pawn";

export class Pawn extends BaseElement {
  #destination: Position = [];
  #position: Position = [];
  #speed: PawnSpeed = 5;
  #movementTimeout: number;
  #tile: Tile;

  constructor(tile?: Tile) {
    super();
    this.template = template;
    if (tile) {
      this.#tile = tile;
      this.position = tile.position;
    }
  }

  get position(): Position {
    return this.#position;
  }

  set position([x, y]: Position) {
    this.#position = [x, y];
    const pawn = this.shadowRoot.querySelector<HTMLDivElement>(PAWN_SELECTOR);
    pawn?.style.setProperty("--x", x.toString());
    pawn?.style.setProperty("--y", y.toString());
  }

  get speed(): PawnSpeed {
    return this.#speed;
  }

  set speed(s: PawnSpeed) {
    this.#speed = s;
    const pawn = this.shadowRoot.querySelector<HTMLDivElement>(PAWN_SELECTOR);
    pawn?.style.setProperty("--speed", `${10 - s}s`);
  }

  get destination(): Position {
    return this.#destination;
  }

  set destination(d: Position) {
    clearTimeout(this.#movementTimeout);
    this.#destination = d;
    this.move();
  }

  templateSetCallback(): void {
    this.position = this.position; // Set the CSS
    this.speed = this.speed; // Set the CSS
  }

  handleTileSelection(event: CustomEvent<Tile>) {
    this.destination = event.detail.position;
  }

  #getNextTile(): Tile {
    const [posX, posY] = this.position;
    const [destX, destY] = this.#destination;
    let nextX = posX;
    let nextY = posY;

    if (posX < destX) {
      nextX++;
    } else if (posX > destX) {
      nextX--;
    }

    if (posY < destY) {
      nextY++;
    } else if (posY > destY) {
      nextY--;
    }

    // TODO: This could _possibly_ be improved
    const nextTile = Object.values(this.#tile.adjacentTiles).find(
      ({ position: [x, y] }) => x === nextX && y === nextY
    );

    return nextTile ?? this.#tile;
  }

  move() {
    const tile = this.#getNextTile();
    const [x, y] = tile.position;
    const [posX, posY] = this.position;

    if (x === posX && y === posY) {
      return this.stop();
    }

    // TODO: Varying levels of passibility
    if (!tile.isPassable) {
      return this.stop();
    }

    sendEvent(`${POSITION_ENTER_EVENT}-${x}-${y}`, this);
    sendEvent(`${POSITION_EXIT_EVENT}-${posX}-${posY}`, this);
    this.#tile = tile;
    this.position = tile.position;
    this.#movementTimeout = setTimeout(
      () => this.move(),
      100 * (10 - this.#speed)
    );
  }

  stop() {
    this.#destination = [];
  }
}

customElements.get(PAWN_ELEMENT_NAME) ??
  customElements.define(PAWN_ELEMENT_NAME, Pawn);
