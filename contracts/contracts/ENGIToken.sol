//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ENGIToken is ERC20 {

    constructor() ERC20("EngineerDAO", "ENGI") {
        _mint(msg.sender, 100_000_000 * (10**uint256(decimals())));
    }

}
