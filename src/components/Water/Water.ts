import { Position } from "../../types";
import { getRandom } from "../../utils";
import { Tile } from "../abstracts/Tile/Tile";
import { Biome } from "../abstracts/Biome/Biome";
import { WATER_COLORS, WATER_ELEMENT_NAME } from "../../constants/water";
import { TILE_SELECTOR } from "../../constants/tile";

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
