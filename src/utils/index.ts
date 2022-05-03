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

export const getRandomNumber = (
  lessThan: number,
  greaterThan: number = 0
): number => {
  return Math.floor(Math.random() * (lessThan - greaterThan) + greaterThan);
};
