import { Position } from "../../types";
import { getBySeed, getRandom, range } from "../../utilities";
import { Tile } from "../abstracts/Tile/Tile";
import { Biome } from "../abstracts/Biome/Biome";
import { Tree } from "../Tree/Tree";
import { TILE_SELECTOR } from "../../constants/tile";
import { GRASS_COLORS, GRASS_ELEMENT_NAME } from "../../constants/grass";
import { MATURITY_LIMIT } from "../../constants/plant";

export class Grass extends Tile {
  constructor(biome: Biome, position: Position) {
    super(biome, position, "grass");
  }

  templateSetCallback(): void {
    super.templateSetCallback();
    this.#setColor();
    this.#setVegitation();
  }

  #setColor() {
    const color = getRandom(GRASS_COLORS);
    this.shadowRoot
      .querySelector<HTMLDivElement>(TILE_SELECTOR)
      .style.setProperty("--color", color);
  }

  #setVegitation() {
    const [x, y] = this.position;
    const hasTree = getBySeed(range(100)) === (x * y) % 100;

    if (hasTree) {
      const tree = new Tree(this.position, MATURITY_LIMIT / 2);
      this.holding.push(tree);
      this.shadowRoot
        .querySelector<HTMLDivElement>(TILE_SELECTOR)
        .appendChild(tree);
      this.isPassable = false;
    }
  }
}

customElements.get(GRASS_ELEMENT_NAME) ??
  customElements.define(GRASS_ELEMENT_NAME, Grass);
