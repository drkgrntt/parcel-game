import { Dirt } from "../components/Dirt/Dirt";
import { Grass } from "../components/Grass/Grass";
import { Water } from "../components/Water/Water";
import { MAP_HEIGHT, MAP_WIDTH } from "./map";

export const BIOME_HEIGHT = MAP_HEIGHT / 10;
export const BIOME_WIDTH = MAP_WIDTH / 10;
export const BIOME_ELEMENT_NAME = "g-biome";
export const BIOME_SELECTOR = ".biome";
export const TILES_SET_EVENT = "tiles-set";

export const MAP_HEIGHT_IN_BIOMES = MAP_HEIGHT / BIOME_HEIGHT;
export const MAP_WIDTH_IN_BIOMES = MAP_WIDTH / BIOME_WIDTH;

export const TILE_TYPE_MAP = {
  grass: Grass,
  dirt: Dirt,
  water: Water,
};
