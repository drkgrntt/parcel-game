export const getRandom = <T>(arr: T[]): T => {
  const len = arr.length;
  const randomNumber = Math.random() * len;
  const index = Math.floor(randomNumber);
  return arr[index];
};
