import { BaseElement } from "../BaseElement/BaseElement";
import template from "./Tile.html";
import { sendEvent } from "../../utils/events";
import { Adjacents, Position, RelativePositionInfo } from "../../types";
import { Biome } from "../Biome/Biome";

export type TileType = "grass" | "dirt" | "water";
export const TILE_TYPES: TileType[] = ["grass", "dirt", "water"];

export class Tile extends BaseElement {
  biome: Biome;
  position: Position;
  relativePosition: Position;
  type: TileType;
  isPassable: boolean = true;
  holding: BaseElement[] = [];
  adjacentTiles: Adjacents<Tile> = {};
  realtivePositionInfo: RelativePositionInfo = {} as RelativePositionInfo;

  constructor(biome: Biome, position: Position, type: TileType) {
    super();
    this.template = template;
    this.biome = biome;
    this.position = position;
    this.type = type;
  }

  get index(): number {
    const [x, y] = this.position;
    return this.biome.width * y + x;
  }

  connectedCallback() {
    const [x, y] = this.position;
    this.createEventListener(
      `entering-position-${x}-${y}`,
      (event: CustomEvent) => {
        this.holding.push(event.detail);
      }
    );
    this.createEventListener(
      `exiting-position-${x}-${y}`,
      (event: CustomEvent) => {
        this.holding.splice(this.holding.indexOf(event.detail));
      }
    );
  }

  templateSetCallback(): void {
    this.setClickHandler();
    this.#setRelativePositionInfo();
    this.#setAdjacentTiles();
  }

  #setRelativePositionInfo() {
    const [x, y] = this.position;
    const [bx, by] = this.biome.position;
    const firstX = bx * this.biome.width;
    const firstY = by * this.biome.height;
    const relativeX = x - firstX;
    const relativeY = y - firstY;

    this.relativePosition = [relativeX, relativeY];

    this.realtivePositionInfo.index = this.biome.width * relativeY + relativeX;

    this.realtivePositionInfo.isWestEdge = relativeX === 0;
    this.realtivePositionInfo.isEastEdge = relativeX === this.biome.width - 1;
    this.realtivePositionInfo.isNorthEdge = relativeY === 0;
    this.realtivePositionInfo.isSouthEdge = relativeY === this.biome.height - 1;

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

  #setAdjacentTiles() {
    const {
      index,
      isWestEdge,
      isEastEdge,
      isNorthEdge,
      isSouthEdge,
      isNorthWestCorner,
      isNorthEastCorner,
      isSouthEastCorner,
      isSouthWestCorner,
    } = this.realtivePositionInfo;
    const {
      w: westBiome,
      e: eastBiome,
      n: northBiome,
      s: southBiome,
      nw: northWestBiome,
      ne: northEastBiome,
      sw: southWestBiome,
      se: southEastBiome,
    } = this.biome.adjacentBiomes;

    // West tile
    if (!isWestEdge) {
      this.adjacentTiles.w = this.biome.tiles[index - 1];
    } else if (isWestEdge && westBiome) {
      this.adjacentTiles.w = westBiome.tiles[index + westBiome.width - 1];
    }

    // East tile
    if (!isEastEdge) {
      this.adjacentTiles.e = this.biome.tiles[index + 1];
    } else if (isEastEdge && eastBiome) {
      this.adjacentTiles.e = eastBiome.tiles[index - eastBiome.width + 1];
    }

    // North tile
    if (!isNorthEdge) {
      this.adjacentTiles.n = this.biome.tiles[index - this.biome.width];
    } else if (isNorthEdge && northBiome) {
      this.adjacentTiles.n =
        northBiome.tiles[index + (northBiome.height - 1) * northBiome.width];
    }

    // South tile
    if (!isSouthEdge) {
      this.adjacentTiles.s = this.biome.tiles[index + this.biome.width];
    } else if (isSouthEdge && southBiome) {
      this.adjacentTiles.s =
        southBiome.tiles[index - (southBiome.height - 1) * southBiome.width];
    }

    // Northwest tile
    if (!isWestEdge && !isNorthEdge) {
      this.adjacentTiles.nw = this.biome.tiles[index - this.biome.width - 1];
    } else if (isWestEdge && !isNorthEdge && westBiome) {
      this.adjacentTiles.nw = westBiome.tiles[index - 1];
    } else if (isNorthEdge && !isWestEdge && northBiome) {
      this.adjacentTiles.nw =
        northBiome.tiles[
          index + (northBiome.height - 1) * northBiome.width - 1
        ];
    } else if (isNorthWestCorner && northWestBiome) {
      this.adjacentTiles.nw =
        northWestBiome.tiles[northWestBiome.tiles.length - 1];
    }

    // Southwest tile
    if (!isWestEdge && !isSouthEdge) {
      this.adjacentTiles.sw = this.biome.tiles[index + this.biome.width - 1];
    } else if (isWestEdge && !isSouthEdge && westBiome) {
      this.adjacentTiles.sw = westBiome.tiles[index + westBiome.width * 2 - 1];
    } else if (isSouthEdge && !isWestEdge && southBiome) {
      this.adjacentTiles.sw =
        southBiome.tiles[
          index - (southBiome.height - 1) * southBiome.width - 1
        ];
    } else if (isSouthWestCorner && southWestBiome) {
      this.adjacentTiles.sw = southWestBiome.tiles[southWestBiome.width - 1];
    }

    // Northeast tile
    if (!isEastEdge && !isNorthEdge) {
      this.adjacentTiles.ne = this.biome.tiles[index - this.biome.width + 1];
    } else if (isEastEdge && !isNorthEdge && eastBiome) {
      this.adjacentTiles.ne = eastBiome.tiles[index - eastBiome.width * 2 + 1];
    } else if (isNorthEdge && !isEastEdge && northBiome) {
      this.adjacentTiles.ne =
        northBiome.tiles[
          northBiome.tiles.length - (northBiome.width - 1 - index)
        ];
    } else if (isNorthEastCorner && northEastBiome) {
      this.adjacentTiles.ne =
        northEastBiome.tiles[
          northEastBiome.tiles.length - northEastBiome.width
        ];
    }

    // Southeast tile
    if (!isEastEdge && !isSouthEdge) {
      this.adjacentTiles.se = this.biome.tiles[index + this.biome.width + 1];
    } else if (isEastEdge && !isSouthEdge && eastBiome) {
      this.adjacentTiles.se = eastBiome.tiles[index + 1];
    } else if (isSouthEdge && !isEastEdge && southBiome) {
      this.adjacentTiles.se =
        southBiome.tiles[
          index - (southBiome.height - 1) * southBiome.width + 1
        ];
    } else if (isSouthEastCorner && southEastBiome) {
      this.adjacentTiles.se = southEastBiome.tiles[0];
    }
  }

  setClickHandler() {
    this.createEventListener("click", this.handleClick.bind(this), this);
  }

  handleClick(event: MouseEvent) {
    sendEvent("tile-selected", this);
  }
}
