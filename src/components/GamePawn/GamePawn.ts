import { BaseElement } from "../BaseElement";
import template from "./GamePawn.html";
import { PawnSpeed, Position } from "../../types";

export class GamePawn extends BaseElement {
  #destination: Position = [];
  #position: Position = [10, 10];
  #speed: PawnSpeed = 8;
  #movementTimeout: number;

  constructor() {
    super();
    this.template = template;
  }

  get position(): Position {
    return this.#position;
  }

  set position([x, y]: Position) {
    this.#position = [x, y];
    const pawn = this.shadowRoot.querySelector<HTMLDivElement>(".pawn");
    pawn?.style.setProperty("--x", x.toString());
    pawn?.style.setProperty("--y", y.toString());
  }

  get speed(): PawnSpeed {
    return this.#speed;
  }

  set speed(s: PawnSpeed) {
    this.#speed = s;
    const pawn = this.shadowRoot.querySelector<HTMLDivElement>(".pawn");
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

    this.createEventListener(
      "tile-selected",
      this.handleTileSelection.bind(this)
    );
  }

  handleTileSelection(event: CustomEvent) {
    this.destination = [event.detail.x, event.detail.y];
  }

  #getNextTile(): Position {
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

    return [nextX, nextY];
  }

  move() {
    const [x, y] = this.#getNextTile();
    const [posX, posY] = this.position;
    if (x === posX && y === posY) {
      this.#destination = [];
      return;
    }

    this.position = [x, y];
    this.#movementTimeout = setTimeout(
      () => this.move(),
      100 * (10 - this.#speed)
    );
  }
}

customElements.get("game-pawn") ?? customElements.define("game-pawn", GamePawn);
