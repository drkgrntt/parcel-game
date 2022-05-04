import template from "./Screen.html";
import { BaseElement } from "../abstracts/BaseElement/BaseElement";
import { Text, TEXT_ELEMENT_NAME } from "../Text/Text";
import { WELCOME } from "../../constants/texts";
import { Map } from "../Map/Map";
import { Player } from "../Player/Player";
import { getRandom } from "../../utils";
import { sendEvent } from "../../utils/events";
import {
  GAME_READY_EVENT,
  SCREEN_ELEMENT_NAME,
  SCREEN_HEIGHT,
  SCREEN_SELECTOR,
  SCREEN_WIDTH,
} from "../../constants/screen";
import { BIOMES_SET_EVENT, MAP_ELEMENT_NAME } from "../../constants/map";
import { TILES_SET_EVENT } from "../../constants/biome";

export class Screen extends BaseElement {
  // Visible area
  #height = SCREEN_HEIGHT;
  #width = SCREEN_WIDTH;

  constructor() {
    super();
    this.template = template;
  }
  set height(value: number) {
    this.#height = value;
    const screen =
      this.shadowRoot.querySelector<HTMLDivElement>(SCREEN_SELECTOR);
    screen?.style.setProperty("--height", value.toString());
  }

  set width(value: number) {
    this.#width = value;
    const screen =
      this.shadowRoot.querySelector<HTMLDivElement>(SCREEN_SELECTOR);
    screen?.style.setProperty("--width", value.toString());
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;

    const text = this.shadowRoot.querySelector<Text>(TEXT_ELEMENT_NAME);
    text.text = WELCOME;

    this.#setPlayer();
  }

  #setPlayer(): void {
    const map = this.shadowRoot.querySelector<Map>(MAP_ELEMENT_NAME);
    this.createEventListener(
      BIOMES_SET_EVENT,
      () => {
        // TODO: This should be based on passibility
        const biome = getRandom(map.biomes, (biome) => biome.type !== "water");
        this.createEventListener(
          TILES_SET_EVENT,
          () => {
            const tile = getRandom(biome.tiles);
            const player = new Player(tile);
            map.appendChild(player);

            sendEvent(GAME_READY_EVENT);
          },
          biome
        );
      },
      map
    );
  }
}

customElements.get(SCREEN_ELEMENT_NAME) ??
  customElements.define(SCREEN_ELEMENT_NAME, Screen);
