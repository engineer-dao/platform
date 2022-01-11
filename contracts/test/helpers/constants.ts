import { defaultAccounts } from 'ethereum-waffle'

export const WETH_ADDRESS_RINKEBY = "0xc778417E063141139Fce010982780140Aa0cD5Ab";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const NON_ZERO_ADDRESS = '0x1111111111111111111111111111111111111111'
export const DEFAULT_ACCOUNTS = defaultAccounts
export const DEFAULT_ACCOUNTS_HARDHAT = defaultAccounts.map((account) => {
    return {
        balance: account.balance,
        privateKey: account.secretKey,
    }
})
