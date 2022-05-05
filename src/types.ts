export type PawnSpeed = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type GrowthRate = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Position = [x?: number, y?: number];
export type RelativePositionInfo = {
  index: number;
  isNorthEdge: boolean;
  isEastEdge: boolean;
  isSouthEdge: boolean;
  isWestEdge: boolean;
  isNorthWestCorner: boolean;
  isNorthEastCorner: boolean;
  isSouthEastCorner: boolean;
  isSouthWestCorner: boolean;
};
export type Adjacents<T> = {
  n?: T;
  ne?: T;
  e?: T;
  se?: T;
  s?: T;
  sw?: T;
  w?: T;
  nw?: T;
};
