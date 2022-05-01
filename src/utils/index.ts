export const getRandom = <T>(
  arr: T[],
  isAcceptable?: (found: T) => boolean
): T => {
  const len = arr.length;
  const randomNumber = Math.random() * len;
  const index = Math.floor(randomNumber);
  const item = arr[index];
  if (isAcceptable) {
    return isAcceptable(item) ? item : getRandom(arr, isAcceptable);
  }
  return item;
};
