import template from "./Map.html";
import { BaseElement } from "../../abstracts/BaseElement/BaseElement";
import { Tile, TILE_TYPES } from "../../abstracts/Tile/Tile";
import { Biome } from "../../abstracts/Biome/Biome";
import { getRandom } from "../../utils";

export class Map extends BaseElement {
  // Full map size, this can be bigger than the visible area
  #height = 40;
  #width = 60;
  tiles: Tile[] = [];
  biomes: Biome[] = [];

  constructor() {
    super();
    this.template = template;
  }

  set height(value: number) {
    this.#height = value;
    const map = this.shadowRoot.querySelector<HTMLDivElement>(".map");
    map?.style.setProperty("--height", value.toString());
  }

  set width(value: number) {
    this.#width = value;
    const map = this.shadowRoot.querySelector<HTMLDivElement>(".map");
    map?.style.setProperty("--width", value.toString());
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;
    this.#setBiomes();
  }

  #setBiomes(): void {
    const map = this.shadowRoot.querySelector(".map");
    for (let y = 0; y < Math.ceil(this.#height / Biome.height); y++) {
      for (let x = 0; x < Math.ceil(this.#width / Biome.width); x++) {
        const type = getRandom(TILE_TYPES);
        const biome = new Biome([x, y], type);
        this.biomes.push(biome);
        map.appendChild(biome);
      }
    }
  }
}

customElements.get("game-map") ?? customElements.define("game-map", Map);
