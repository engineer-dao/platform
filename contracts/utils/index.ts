import BigNumber from "bignumber.js";

export type Numberish = BigNumber | string | number;

/**
 * Convert a token unit amount to weis. E.g., 10.1 ETH -> 10100000000000000000.
 */
export function fromTokenUnitAmount(units: Numberish, decimals: number = 18): BigNumber {
    return new BigNumber(units).times(new BigNumber(10).pow(decimals)).integerValue();
}

/**
 * Convert a wei amount to token units. E.g., 10100000000000000000 -> 10.1 ETH.
 */
export function toTokenUnitAmount(weis: Numberish, decimals: number = 18): BigNumber {
    return new BigNumber(weis).div(new BigNumber(10).pow(decimals));
}

export const deadlineAfterNMinutes = (n: number): number => {
    const date = new Date(Date.now());
    date.setMinutes(date.getMinutes() + n);

    return date.getTime();
}

export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
