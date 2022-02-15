/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IJob, IJobInterface } from "../IJob";

const _abi = [
  {
    inputs: [],
    name: "getAllPaymentTokens",
    outputs: [
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    name: "paymentTokens",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IJob__factory {
  static readonly abi = _abi;
  static createInterface(): IJobInterface {
    return new utils.Interface(_abi) as IJobInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IJob {
    return new Contract(address, _abi, signerOrProvider) as IJob;
  }
}