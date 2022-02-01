export const randomChars = (chars: number) => {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(chars + 1);
};
