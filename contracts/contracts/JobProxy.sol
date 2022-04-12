//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "hardhat-deploy/solc_0.7/proxy/EIP173Proxy.sol";

// note: this contract is not deployed directly
//  this contract is used by hardhat to generate a typechain contract factory 
contract JobProxy is EIP173Proxy {
    constructor(
        address implementationAddress,
        address ownerAddress,
        bytes memory data
    ) EIP173Proxy(implementationAddress, ownerAddress, data) {}
}
