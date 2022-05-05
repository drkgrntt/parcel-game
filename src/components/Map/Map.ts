import template from "./Map.html";
import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import { Biome } from "../abstracts/Biome/Biome";
import { weighArray } from "../../utils";
import { sendEvent } from "../../utils/events";
import {
  BIOMES_SET_EVENT,
  MAP_ELEMENT_NAME,
  MAP_HEIGHT,
  MAP_SEED_HASH,
  MAP_SELECTOR,
  MAP_WIDTH,
  STARTING_TIME,
  TIME_CHANGE_EVENT,
} from "../../constants/map";
import { BIOME_HEIGHT, BIOME_WIDTH } from "../../constants/biome";
import { TileType, TILE_TYPES } from "../../constants/tile";
import "./time";

export class Map extends BaseElement {
  // Full map size, this can be bigger than the visible area
  #height = MAP_HEIGHT;
  #width = MAP_WIDTH;
  #time = STARTING_TIME;
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

  set time(value: number) {
    this.#time = value;
    const map = this.shadowRoot.querySelector<HTMLDivElement>(MAP_SELECTOR);
    map?.style.setProperty(
      "--brightness",
      (12 - Math.abs(value - 12)).toString()
    );
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;
    this.time = this.#time;
    this.#setBiomes();
    this.#setTime();
  }

  #setTime() {
    this.createEventListener(TIME_CHANGE_EVENT, (event: CustomEvent) => {
      this.time = event.detail.time;
    });
  }

  #setBiomes(): void {
    const map = this.shadowRoot.querySelector(MAP_SELECTOR);
    for (let y = 0; y < Math.ceil(this.#height / BIOME_HEIGHT); y++) {
      for (let x = 0; x < Math.ceil(this.#width / BIOME_WIDTH); x++) {
        // const type = getRandom<TileType>(TILE_TYPES as unknown as TileType[]);
        const randomizer = Math.floor(
          (MAP_SEED_HASH / (x + 47)) * (MAP_SEED_HASH / (y + 13))
        );
        const weightedTypes = weighArray(
          TILE_TYPES as unknown as TileType[], // Allow for readonly type
          [30, 10, 10]
        );
        const type = weightedTypes[randomizer % weightedTypes.length];
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
