export const randomChars = (chars: number, source?: string) => {
  if (source) {
    const length = source.length >= chars ? source.length - chars : 0;
    return source.substring(length);
  }

  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substring(chars + 1);
};
