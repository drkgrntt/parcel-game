import { Position } from "../../types";
import { Dirt } from "../../components/Dirt/Dirt";
import { Grass } from "../../components/Grass/Grass";
import { BaseElement } from "../BaseElement/BaseElement";
import { Tile, TileType } from "../Tile/Tile";
import template from "./Biome.html";

export const TILE_TYPE_MAP = {
  grass: Grass,
  dirt: Dirt,
};

export class Biome extends BaseElement {
  static height = 4;
  static width = 6;

  // Biome size
  #height = 4;
  #width = 6;
  type: TileType;

  position: Position;
  #tiles: Tile[] = [];

  constructor(position: Position, type: TileType) {
    super();
    this.template = template;
    this.position = position;
    this.type = type;
  }

  set height(value: number) {
    this.#height = value;
    const biome = this.shadowRoot.querySelector<HTMLDivElement>(".biome");
    biome?.style.setProperty("--height", value.toString());
  }

  set width(value: number) {
    this.#width = value;
    const biome = this.shadowRoot.querySelector<HTMLDivElement>(".biome");
    biome?.style.setProperty("--width", value.toString());
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;
    this.#setTiles();
  }

  #setTiles(): void {
    const [biomeX, biomeY] = this.position;
    const biome = this.shadowRoot.querySelector(".biome");
    for (let y = 0; y < this.#height; y++) {
      for (let x = 0; x < this.#width; x++) {
        const TileType = TILE_TYPE_MAP[this.type];
        const realX = Biome.width * biomeX + x;
        const realY = Biome.height * biomeY + y;
        const tile = new TileType([realX, realY]);
        this.#tiles.push(tile);
        biome.appendChild(tile);
      }
    }
  }
}

customElements.get("g-biome") ?? customElements.define("g-biome", Biome);
