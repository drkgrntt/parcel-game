import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import template from "./Pawn.html";
import { PawnSpeed, Position } from "../../types";
import { Tile } from "../abstracts/Tile/Tile";
import { sendEvent } from "../../utilities/events";
import {
  POSITION_ENTER_EVENT,
  POSITION_EXIT_EVENT,
} from "../../constants/tile";
import {
  PAWN_ACTIVITIES,
  PAWN_ELEMENT_NAME,
  PAWN_SELECTOR,
} from "../../constants/pawn";
import { AFTER_ZOOM_EVENT, BEFORE_ZOOM_EVENT } from "../../constants/controls";

export class Pawn extends BaseElement {
  name = "Pawn";

  inventory: Record<string, number> = {};
  #activity: (pawn: Pawn) => void;
  #destination: Position = [];
  #traveled: Position[] = [];
  #position: Position = [];
  #speed: PawnSpeed = 5;
  #movementTimeout: number;
  tile: Tile;

  constructor(tile?: Tile) {
    super();
    this.template = template;
    if (tile) {
      this.tile = tile;
      this.position = tile.position;
    }
  }

  get position(): Position {
    return this.#position;
  }

  set position([x, y]: Position) {
    this.#position = [x, y];
    this.#traveled.push(this.#position);
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
    this.#traveled.push(this.#position);
    this.move();
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.position = this.position; // Set the CSS
    this.speed = this.speed; // Set the CSS

    this.#handleZoomEvents();
    this.#listenForActivities();
  }

  #listenForActivities() {
    PAWN_ACTIVITIES.forEach((activity) => {
      this.createEventListener(
        activity,
        (event: CustomEvent<{ item: any; callback: (pawn: Pawn) => void }>) => {
          this.#activity = event.detail.callback;
          this.destination = event.detail.item.position;
        }
      );
    });
  }

  #handleZoomEvents() {
    this.createEventListener(BEFORE_ZOOM_EVENT, () => {
      this.shadowRoot
        .querySelector<HTMLDivElement>(PAWN_SELECTOR)
        .style.setProperty("--speed", "0s");
    });

    this.createEventListener(AFTER_ZOOM_EVENT, () => {
      setTimeout(() => (this.speed = this.speed), 100);
    });
  }

  handleTileSelection(event: CustomEvent<Tile>) {
    this.#activity = null;
    this.#traveled = [];
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
    const nextTile = Object.values(this.tile.adjacentTiles).find(
      ({ position: [x, y] }) => x === nextX && y === nextY
    );

    return nextTile ?? this.tile;
  }

  #hasTraveledTo([x, y]: Position): boolean {
    return this.#traveled.some(([tx, ty]) => x === tx && y === ty);
  }

  move() {
    let nextTile = this.#getNextTile();
    const [tx, ty] = nextTile.position;
    const [posX, posY] = this.position;

    if (tx === posX && ty === posY) {
      return this.stop();
    }

    // TODO: Varying levels of passibility
    // Attempt to not change the y or x.
    // This helps diagonal pathing
    if (!nextTile.isPassable || this.#hasTraveledTo(nextTile.position)) {
      const [dx, dy] = this.destination;
      if (tx === dx && ty === dy) {
        return this.stop();
      }

      // Adjust horizontally when walking diagonally
      let newNextTile = Object.values(this.tile.adjacentTiles).find(
        ({ position: [x, y] }) => {
          return x === tx - (tx - posX) && y === ty;
        }
      );

      if (
        !newNextTile?.isPassable ||
        this.#hasTraveledTo(newNextTile.position)
      ) {
        // Adjust vertically when walking diagonally
        newNextTile = Object.values(this.tile.adjacentTiles).find(
          ({ position: [x, y] }) => {
            return x === tx && y === ty - (ty - posY);
          }
        );

        if (
          !newNextTile?.isPassable ||
          this.#hasTraveledTo(newNextTile.position)
        ) {
          // Adjust diagonally south when walking horizontally
          newNextTile = Object.values(this.tile.adjacentTiles).find(
            ({ position: [x, y] }) => {
              return x === tx && y === ty + 1;
            }
          );

          if (
            !newNextTile?.isPassable ||
            this.#hasTraveledTo(newNextTile.position)
          ) {
            // Adjust diagonally north when walking horizontally
            newNextTile = Object.values(this.tile.adjacentTiles).find(
              ({ position: [x, y] }) => {
                return x === tx && y === ty - 1;
              }
            );

            if (
              !newNextTile?.isPassable ||
              this.#hasTraveledTo(newNextTile.position)
            ) {
              // Adjust diagonally east when walking vertically
              newNextTile = Object.values(this.tile.adjacentTiles).find(
                ({ position: [x, y] }) => {
                  return x === tx + 1 && y === ty;
                }
              );

              if (
                !newNextTile?.isPassable ||
                this.#hasTraveledTo(newNextTile.position)
              ) {
                // Adjust diagonally west when walking vertically
                newNextTile = Object.values(this.tile.adjacentTiles).find(
                  ({ position: [x, y] }) => {
                    return x === tx - 1 && y === ty;
                  }
                );

                if (
                  !newNextTile?.isPassable ||
                  this.#hasTraveledTo(newNextTile.position)
                ) {
                  // We're lost.
                  return this.stop();
                }
              }
            }
          }
        }
      }

      nextTile = newNextTile;
    }

    const [x, y] = nextTile.position;

    sendEvent(`${POSITION_ENTER_EVENT}-${x}-${y}`, this);
    sendEvent(`${POSITION_EXIT_EVENT}-${posX}-${posY}`, this);
    this.tile = nextTile;
    this.position = nextTile.position;
    this.#traveled.push(this.position);
    this.#movementTimeout = setTimeout(
      () => this.move(),
      100 * (10 - this.#speed)
    );
  }

  stop() {
    this.#destination = [];
    this.#traveled = [];
    if (this.#activity) {
      this.#activity(this);
    }
    this.#activity = null;
  }
}

customElements.get(PAWN_ELEMENT_NAME) ??
  customElements.define(PAWN_ELEMENT_NAME, Pawn);
