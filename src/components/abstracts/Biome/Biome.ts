import { Adjacents, Position, RelativePositionInfo } from "../../../types";
import { BaseElement } from "../BaseElement/BaseElement";
import { Tile } from "../Tile/Tile";
import template from "./Biome.html";
import { Map } from "../../Map/Map";
import { sendEvent } from "../../../utils/events";
import {
  BIOME_ELEMENT_NAME,
  BIOME_HEIGHT,
  BIOME_SELECTOR,
  BIOME_WIDTH,
  TILES_SET_EVENT,
  TILE_TYPE_MAP,
  MAP_HEIGHT_IN_BIOMES,
  MAP_WIDTH_IN_BIOMES,
} from "../../../constants/biome";
import { TileType } from "../../../constants/tile";

export class Biome extends BaseElement {
  // Biome size
  #height = BIOME_HEIGHT;
  #width = BIOME_WIDTH;
  type: TileType;

  map: Map;
  position: Position;

  tiles: Tile[] = [];
  adjacentBiomes: Adjacents<Biome> = {};
  realtivePositionInfo: RelativePositionInfo = {} as RelativePositionInfo;

  constructor(map: Map, position: Position, type: TileType) {
    super();
    this.template = template;
    this.map = map;
    this.position = position;
    this.type = type;
  }

  get height(): number {
    return this.#height;
  }

  set height(value: number) {
    this.#height = value;
    const biome = this.shadowRoot.querySelector<HTMLDivElement>(BIOME_SELECTOR);
    biome?.style.setProperty("--height", value.toString());
  }

  get width(): number {
    return this.#width;
  }

  set width(value: number) {
    this.#width = value;
    const biome = this.shadowRoot.querySelector<HTMLDivElement>(BIOME_SELECTOR);
    biome?.style.setProperty("--width", value.toString());
  }

  templateSetCallback(): void {
    this.height = this.#height;
    this.width = this.#width;
    this.#setRelativePositionInfo();
    this.#setAdjacentBiomes();
    this.#setTiles();
  }

  #setTiles(): void {
    const [biomeX, biomeY] = this.position;
    const biome = this.shadowRoot.querySelector(BIOME_SELECTOR);
    for (let y = 0; y < this.#height; y++) {
      for (let x = 0; x < this.#width; x++) {
        const TileType = TILE_TYPE_MAP[this.type];
        const realX = this.#width * biomeX + x;
        const realY = this.#height * biomeY + y;
        const tile = new TileType(this, [realX, realY]);
        this.tiles.push(tile);
        biome.appendChild(tile);
      }
    }
    sendEvent(TILES_SET_EVENT, null, this);
  }

  #setRelativePositionInfo() {
    const [x, y] = this.position;

    this.realtivePositionInfo.index = MAP_WIDTH_IN_BIOMES * y + x;

    this.realtivePositionInfo.isWestEdge = x === 0;
    this.realtivePositionInfo.isEastEdge = x === MAP_WIDTH_IN_BIOMES - 1;
    this.realtivePositionInfo.isNorthEdge = y === 0;
    this.realtivePositionInfo.isSouthEdge = y === MAP_HEIGHT_IN_BIOMES - 1;

    this.realtivePositionInfo.isNorthEastCorner =
      this.realtivePositionInfo.isEastEdge &&
      this.realtivePositionInfo.isNorthEdge;

    this.realtivePositionInfo.isNorthWestCorner =
      this.realtivePositionInfo.isWestEdge &&
      this.realtivePositionInfo.isNorthEdge;

    this.realtivePositionInfo.isSouthEastCorner =
      this.realtivePositionInfo.isEastEdge &&
      this.realtivePositionInfo.isSouthEdge;

    this.realtivePositionInfo.isSouthWestCorner =
      this.realtivePositionInfo.isWestEdge &&
      this.realtivePositionInfo.isSouthEdge;
  }

  #setAdjacentBiomes() {
    const { index, isWestEdge, isEastEdge, isNorthEdge, isSouthEdge } =
      this.realtivePositionInfo;

    if (!isWestEdge) this.adjacentBiomes.w = this.map.biomes[index - 1];
    if (!isEastEdge) this.adjacentBiomes.e = this.map.biomes[index + 1];

    if (!isNorthEdge)
      this.adjacentBiomes.n = this.map.biomes[index - MAP_WIDTH_IN_BIOMES];
    if (!isSouthEdge)
      this.adjacentBiomes.s = this.map.biomes[index + MAP_WIDTH_IN_BIOMES];

    if (!isWestEdge && !isNorthEdge)
      this.adjacentBiomes.nw = this.map.biomes[index - MAP_WIDTH_IN_BIOMES - 1];
    if (!isWestEdge && !isSouthEdge)
      this.adjacentBiomes.sw = this.map.biomes[index + MAP_WIDTH_IN_BIOMES - 1];
    if (!isEastEdge && !isNorthEdge)
      this.adjacentBiomes.ne = this.map.biomes[index - MAP_WIDTH_IN_BIOMES + 1];
    if (!isEastEdge && !isSouthEdge)
      this.adjacentBiomes.se = this.map.biomes[index + MAP_WIDTH_IN_BIOMES + 1];
  }
}

customElements.get(BIOME_ELEMENT_NAME) ??
  customElements.define(BIOME_ELEMENT_NAME, Biome);
