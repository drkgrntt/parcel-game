import { MAP_SEED_HASH } from "../constants/map";

export const getRandom = <T>(
  arr: T[],
  isAcceptable?: (found: T) => boolean
): T => {
  const len = arr.length;
  const randomNumber = getRandomNumber(len);
  const index = Math.floor(randomNumber);
  const item = arr[index];
  if (isAcceptable) {
    return isAcceptable(item) ? item : getRandom(arr, isAcceptable);
  }
  return item;
};

export const getBySeed = <T>(
  arr: T[],
  isAcceptable?: (found: T) => boolean,
  modifier: number = 0
): T => {
  if (modifier >= arr.length) modifier = 0;
  const item = arr[(MAP_SEED_HASH % arr.length) + modifier];
  if (isAcceptable) {
    return isAcceptable(item)
      ? item
      : getBySeed(arr, isAcceptable, modifier + 1);
  }
  return item;
};

export const getRandomNumber = (
  lessThan: number,
  greaterThan: number = 0
): number => {
  return Math.floor(Math.random() * (lessThan - greaterThan) + greaterThan);
};

export const hashStringToNumber = (input: string): number => {
  var hash = 0,
    len = input.length;
  for (var i = 0; i < len; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0; // to 32bit integer
  }
  return hash;
};

export const weighArray = <T>(arr: T[], weights: number[]): T[] => {
  return arr.reduce<T[]>((newArr, item, index) => {
    let weight = weights[index];
    if (typeof weight === "undefined") weight = 1;
    for (let i = 1; i <= weight; i++) {
      newArr.push(item);
    }
    return newArr;
  }, []);
};
