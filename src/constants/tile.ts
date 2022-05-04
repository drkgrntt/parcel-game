export const TILE_TYPES = ["grass", "dirt", "water"] as const;
export const POSITION_ENTER_EVENT = "entering-position";
export const POSITION_EXIT_EVENT = "exiting-position";
export const TILE_SELECTED_EVENT = "tile-selected";
export const TILE_SELECTOR = ".tile";
export type TileType = typeof TILE_TYPES[number];
