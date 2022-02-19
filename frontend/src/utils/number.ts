import { BigNumber, BigNumberish } from 'ethers';

// percentages are calculated using integer math in the smart contract
//  50% is 5,000, 100% is 10,000
export const BASE_PERCENT = 10000;

// returns an integer between 0 and 10,000 that represents a percentage
export const buildIntegerPercentage = (
  numerator: BigNumberish,
  denominator: BigNumberish
): BigNumber => {
  return BigNumber.from(numerator).mul(BASE_PERCENT).div(denominator);
};

// formats an integer percentage
//  converts 5,000 to '50'
export const formatIntegerPercentage = (integerPct: BigNumberish): string => {
  const num = (BigNumber.from(integerPct).toNumber() * 100) / BASE_PERCENT;
  return num.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  });
};
