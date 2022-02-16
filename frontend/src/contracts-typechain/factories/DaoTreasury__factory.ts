/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { DaoTreasury, DaoTreasuryInterface } from "../DaoTreasury";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [],
    name: "JobContract",
    outputs: [
      {
        internalType: "contract IJob",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "Router",
    outputs: [
      {
        internalType: "contract IRouter",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IJob",
        name: "addr",
        type: "address",
      },
    ],
    name: "setJobContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IRouter",
        name: "routerAddr",
        type: "address",
      },
    ],
    name: "setRouter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "tokenAddr",
        type: "address",
      },
    ],
    name: "setStableCoin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "stableCoin",
    outputs: [
      {
        internalType: "contract IERC20",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "slippage",
        type: "uint256",
      },
    ],
    name: "swapAllToStable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "slip",
        type: "uint256",
      },
    ],
    name: "swapToStable",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "contract IERC20",
        name: "token",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenAmount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "transfer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];

const _bytecode =
  "0x6080604052600380546001600160a01b03191673a5e0829caced8ffdd4de3c43696c57f7d7a678ff17905534801561003657600080fd5b5061004033610045565b610095565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6112aa806100a46000396000f3fe6080604052600436106100cb5760003560e01c8063992642e511610074578063f2fde38b1161004e578063f2fde38b14610253578063f6d7eade14610273578063fad58b211461029357600080fd5b8063992642e5146101f3578063c0d7865514610213578063dbba0f011461023357600080fd5b8063462b9683116100a5578063462b968314610184578063715018a6146101c05780638da5cb5b146101d557600080fd5b806318ad64471461012257806322e756771461014457806323af4e171461016457600080fd5b3661011d5760405162461bcd60e51b815260206004820152601760248201527f446f6e2774206c6f636b20796f7572204d41544943202100000000000000000060448201526064015b60405180910390fd5b600080fd5b34801561012e57600080fd5b5061014261013d366004610e54565b6102b3565b005b34801561015057600080fd5b5061014261015f366004610e89565b610501565b34801561017057600080fd5b5061014261017f366004610ea2565b6107ad565b34801561019057600080fd5b506001546101a4906001600160a01b031681565b6040516001600160a01b03909116815260200160405180910390f35b3480156101cc57600080fd5b50610142610836565b3480156101e157600080fd5b506000546001600160a01b03166101a4565b3480156101ff57600080fd5b506002546101a4906001600160a01b031681565b34801561021f57600080fd5b5061014261022e366004610ea2565b61089c565b34801561023f57600080fd5b5061014261024e366004610ebf565b610925565b34801561025f57600080fd5b5061014261026e366004610ea2565b610998565b34801561027f57600080fd5b506003546101a4906001600160a01b031681565b34801561029f57600080fd5b506101426102ae366004610ea2565b610a7a565b6000546001600160a01b0316331461030d5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610114565b604080516002808252606082018352600092602083019080368337019050509050838160008151811061034257610342610f17565b6001600160a01b0392831660209182029290920101526002548251911690829060009061037157610371610f17565b6001600160a01b0392831660209182029290920101526003546040517fd06ca61f000000000000000000000000000000000000000000000000000000008152600092919091169063d06ca61f906103ce9087908690600401610f71565b60006040518083038186803b1580156103e657600080fd5b505afa1580156103fa573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526104229190810190610fdf565b9050600081600183516104359190611080565b8151811061044557610445610f17565b60200260200101519050600061271085836104609190611097565b61046a91906110b6565b6104749083611080565b6003546040517f5c11d7950000000000000000000000000000000000000000000000000000000081529192506001600160a01b031690635c11d795906104c690899085908990309042906004016110d8565b600060405180830381600087803b1580156104e057600080fd5b505af11580156104f4573d6000803e3d6000fd5b5050505050505050505050565b6000546001600160a01b0316331461055b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610114565b600154604080517f47d0316200000000000000000000000000000000000000000000000000000000815290516000926001600160a01b0316916347d031629160048083019286929190829003018186803b1580156105b857600080fd5b505afa1580156105cc573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526105f49190810190611114565b90506000805b82518110156107a75782818151811061061557610615610f17565b60209081029190910101516040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b03909116906370a082319060240160206040518083038186803b15801561067957600080fd5b505afa15801561068d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106b191906111a3565b91508115610795578281815181106106cb576106cb610f17565b60209081029190910101516040517f095ea7b3000000000000000000000000000000000000000000000000000000008152336004820152602481018490526001600160a01b039091169063095ea7b390604401602060405180830381600087803b15801561073857600080fd5b505af115801561074c573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061077091906111bc565b5061079583828151811061078657610786610f17565b602002602001015183866102b3565b8061079f816111de565b9150506105fa565b50505050565b6000546001600160a01b031633146108075760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610114565b6002805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6000546001600160a01b031633146108905760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610114565b61089a6000610b03565b565b6000546001600160a01b031633146108f65760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610114565b6003805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6000546001600160a01b0316331461097f5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610114565b6109936001600160a01b0384168284610b60565b505050565b6000546001600160a01b031633146109f25760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610114565b6001600160a01b038116610a6e5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610114565b610a7781610b03565b50565b6000546001600160a01b03163314610ad45760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610114565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b600080546001600160a01b0383811673ffffffffffffffffffffffffffffffffffffffff19831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b604080516001600160a01b03848116602483015260448083018590528351808403909101815260649092018352602080830180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fa9059cbb0000000000000000000000000000000000000000000000000000000017905283518085019094528084527f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c65649084015261099392869291600091610c1e918516908490610cae565b8051909150156109935780806020019051810190610c3c91906111bc565b6109935760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610114565b6060610cbd8484600085610cc7565b90505b9392505050565b606082471015610d3f5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610114565b843b610d8d5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610114565b600080866001600160a01b03168587604051610da99190611225565b60006040518083038185875af1925050503d8060008114610de6576040519150601f19603f3d011682016040523d82523d6000602084013e610deb565b606091505b5091509150610dfb828286610e06565b979650505050505050565b60608315610e15575081610cc0565b825115610e255782518084602001fd5b8160405162461bcd60e51b81526004016101149190611241565b6001600160a01b0381168114610a7757600080fd5b600080600060608486031215610e6957600080fd5b8335610e7481610e3f565b95602085013595506040909401359392505050565b600060208284031215610e9b57600080fd5b5035919050565b600060208284031215610eb457600080fd5b8135610cc081610e3f565b600080600060608486031215610ed457600080fd5b8335610edf81610e3f565b9250602084013591506040840135610ef681610e3f565b809150509250925092565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600081518084526020808501945080840160005b83811015610f665781516001600160a01b031687529582019590820190600101610f41565b509495945050505050565b828152604060208201526000610cbd6040830184610f2d565b604051601f8201601f1916810167ffffffffffffffff81118282101715610fb357610fb3610f01565b604052919050565b600067ffffffffffffffff821115610fd557610fd5610f01565b5060051b60200190565b60006020808385031215610ff257600080fd5b825167ffffffffffffffff81111561100957600080fd5b8301601f8101851361101a57600080fd5b805161102d61102882610fbb565b610f8a565b81815260059190911b8201830190838101908783111561104c57600080fd5b928401925b82841015610dfb57835182529284019290840190611051565b634e487b7160e01b600052601160045260246000fd5b6000828210156110925761109261106a565b500390565b60008160001904831182151516156110b1576110b161106a565b500290565b6000826110d357634e487b7160e01b600052601260045260246000fd5b500490565b85815284602082015260a0604082015260006110f760a0830186610f2d565b6001600160a01b0394909416606083015250608001529392505050565b6000602080838503121561112757600080fd5b825167ffffffffffffffff81111561113e57600080fd5b8301601f8101851361114f57600080fd5b805161115d61102882610fbb565b81815260059190911b8201830190838101908783111561117c57600080fd5b928401925b82841015610dfb57835161119481610e3f565b82529284019290840190611181565b6000602082840312156111b557600080fd5b5051919050565b6000602082840312156111ce57600080fd5b81518015158114610cc057600080fd5b60006000198214156111f2576111f261106a565b5060010190565b60005b838110156112145781810151838201526020016111fc565b838111156107a75750506000910152565b600082516112378184602087016111f9565b9190910192915050565b60208152600082518060208401526112608160408501602087016111f9565b601f01601f1916919091016040019291505056fea2646970667358221220a4672b09bdef5bbc5127a237912d3d72f7afb35f6ef293f4d81834a8e31a5e2564736f6c63430008090033";

export class DaoTreasury__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<DaoTreasury> {
    return super.deploy(overrides || {}) as Promise<DaoTreasury>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): DaoTreasury {
    return super.attach(address) as DaoTreasury;
  }
  connect(signer: Signer): DaoTreasury__factory {
    return super.connect(signer) as DaoTreasury__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): DaoTreasuryInterface {
    return new utils.Interface(_abi) as DaoTreasuryInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DaoTreasury {
    return new Contract(address, _abi, signerOrProvider) as DaoTreasury;
  }
}
