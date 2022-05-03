import template from "./Map.html";
import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import { TileType, TILE_TYPES } from "../abstracts/Tile/Tile";
import { Biome, BIOME_HEIGHT, BIOME_WIDTH } from "../abstracts/Biome/Biome";
import { getRandom } from "../../utils";
import { sendEvent } from "../../utils/events";

export const MAP_HEIGHT = 40;
export const MAP_WIDTH = 60;
export const MAP_HEIGHT_IN_BIOMES = MAP_HEIGHT / BIOME_HEIGHT;
export const MAP_WIDTH_IN_BIOMES = MAP_WIDTH / BIOME_WIDTH;
export const MAP_ELEMENT_NAME = "g-map";
export const MAP_SELECTOR = ".map";
export const BIOMES_SET_EVENT = "biomes-set";

export class Map extends BaseElement {
  // Full map size, this can be bigger than the visible area
  #height = MAP_HEIGHT;
  #width = MAP_WIDTH;
  biomes: Biome[] = [];

  constructor() {
    super();
    this.template = template;
  }

  set height(value: number) {
    this.#height = value;
    const map = this.shadowRoot.querySelector<HTMLDivElement>(MAP_SELECTOR);
    map?.style.setProperty("--height", value.toString());
  }

  set width(value: number) {
    this.#width = value;
    const map = this.shadowRoot.querySelector<HTMLDivElement>(MAP_SELECTOR);
    map?.style.setProperty("--width", value.toString());
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;
    this.#setBiomes();
  }

  #setBiomes(): void {
    const map = this.shadowRoot.querySelector(MAP_SELECTOR);
    for (let y = 0; y < Math.ceil(this.#height / BIOME_HEIGHT); y++) {
      for (let x = 0; x < Math.ceil(this.#width / BIOME_WIDTH); x++) {
        const type = getRandom<TileType>(TILE_TYPES as unknown as TileType[]);
        const biome = new Biome(this, [x, y], type);
        this.biomes.push(biome);
        map.appendChild(biome);
      }
    }
    sendEvent(BIOMES_SET_EVENT, null, this);
  }
}

customElements.get(MAP_ELEMENT_NAME) ??
  customElements.define(MAP_ELEMENT_NAME, Map);
