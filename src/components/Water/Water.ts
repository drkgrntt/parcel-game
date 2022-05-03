import { Position } from "../../types";
import { getRandom } from "../../utils";
import { Tile, TILE_SELECTOR } from "../abstracts/Tile/Tile";
import { Biome } from "../abstracts/Biome/Biome";

export const WATER_COLORS = ["#00f", "#03d", "#30d"];
export const WATER_ELEMENT_NAME = "g-water";

export class Water extends Tile {
  constructor(biome: Biome, position: Position) {
    super(biome, position, "water");
    this.isPassable = false;
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.setColor();
  }

  setColor() {
    const color = getRandom(WATER_COLORS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(TILE_SELECTOR)
      .style.setProperty("--color", color);
  }
}

customElements.get(WATER_ELEMENT_NAME) ??
  customElements.define(WATER_ELEMENT_NAME, Water);
