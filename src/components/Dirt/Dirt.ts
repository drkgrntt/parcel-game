import { Position } from "../../types";
import { getRandom } from "../../utils";
import { Tile, TILE_SELECTOR } from "../abstracts/Tile/Tile";
import { Biome } from "../abstracts/Biome/Biome";

export const DIRT_COLORS = [
  "#462e1a",
  "#503715",
  "#743e0c",
  "#552f12",
  "#46250a",
];
export const DIRT_ELEMENT_NAME = "g-dirt";

export class Dirt extends Tile {
  constructor(biome: Biome, position: Position) {
    super(biome, position, "dirt");
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.setColor();
  }

  setColor() {
    const color = getRandom(DIRT_COLORS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(TILE_SELECTOR)
      .style.setProperty("--color", color);
  }
}

customElements.get(DIRT_ELEMENT_NAME) ??
  customElements.define(DIRT_ELEMENT_NAME, Dirt);
