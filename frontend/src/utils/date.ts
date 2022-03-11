export const formatDateTime = (date: Date) => {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};
