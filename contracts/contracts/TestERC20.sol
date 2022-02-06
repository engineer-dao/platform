//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestERC20 is ERC20 {
    constructor() ERC20("Test ERC20 Token", "TestERC20") {
        _mint(msg.sender, 1000000 * (10**uint256(decimals())));
    }
}
