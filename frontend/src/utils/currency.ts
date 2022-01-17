export const currencyFormatter = (
  value: number,
  decimalPlaces: number = 2,
  currency: string = 'USD'
) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,

    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });

  return formatter.format(value);
};
