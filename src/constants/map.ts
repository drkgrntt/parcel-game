import { hashStringToNumber } from "../utilities";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./screen";

export const MAP_HEIGHT = SCREEN_HEIGHT;
export const MAP_WIDTH = SCREEN_WIDTH;

export const MAP_ELEMENT_NAME = "g-map";
export const MAP_SELECTOR = ".map";
export const BIOMES_SET_EVENT = "biomes-set";
export const TIME_CHANGE_EVENT = "time-change";
export const STARTING_TIME = 9;

const params = new URLSearchParams(window.location.search);
export const MAP_SEED = params.get("seed") ?? "default";
