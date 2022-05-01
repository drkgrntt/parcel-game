import { Adjacents, Position, RelativePositionInfo } from "../../types";
import { Dirt } from "../../components/Dirt/Dirt";
import { Grass } from "../../components/Grass/Grass";
import { BaseElement } from "../BaseElement/BaseElement";
import { Tile, TileType } from "../Tile/Tile";
import template from "./Biome.html";
import { Water } from "../../components/Water/Water";
import { Map } from "../../components/Map/Map";
import { sendEvent } from "../../utils/events";

export const TILE_TYPE_MAP = {
  grass: Grass,
  dirt: Dirt,
  water: Water,
};

export class Biome extends BaseElement {
  static height = 4;
  static width = 6;

  // Biome size
  #height = 4;
  #width = 6;
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
    const biome = this.shadowRoot.querySelector<HTMLDivElement>(".biome");
    biome?.style.setProperty("--height", value.toString());
  }

  get width(): number {
    return this.#width;
  }

  set width(value: number) {
    this.#width = value;
    const biome = this.shadowRoot.querySelector<HTMLDivElement>(".biome");
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
    const biome = this.shadowRoot.querySelector(".biome");
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
    sendEvent("tiles-set", null, this);
  }

  #setRelativePositionInfo() {
    const [x, y] = this.position;

    this.realtivePositionInfo.index = Map.widthInBiomes * y + x;

    this.realtivePositionInfo.isWestEdge = x === 0;
    this.realtivePositionInfo.isEastEdge = x === Map.widthInBiomes - 1;
    this.realtivePositionInfo.isNorthEdge = y === 0;
    this.realtivePositionInfo.isSouthEdge = y === Map.heightInBiomes - 1;

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
      this.adjacentBiomes.n = this.map.biomes[index - Map.widthInBiomes];
    if (!isSouthEdge)
      this.adjacentBiomes.s = this.map.biomes[index + Map.widthInBiomes];

    if (!isWestEdge && !isNorthEdge)
      this.adjacentBiomes.nw = this.map.biomes[index - Map.widthInBiomes - 1];
    if (!isWestEdge && !isSouthEdge)
      this.adjacentBiomes.sw = this.map.biomes[index + Map.widthInBiomes - 1];
    if (!isEastEdge && !isNorthEdge)
      this.adjacentBiomes.ne = this.map.biomes[index - Map.widthInBiomes + 1];
    if (!isEastEdge && !isSouthEdge)
      this.adjacentBiomes.se = this.map.biomes[index + Map.widthInBiomes + 1];
  }
}

customElements.get("g-biome") ?? customElements.define("g-biome", Biome);
