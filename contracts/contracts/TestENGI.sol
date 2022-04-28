//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestENGI is ERC20 {
    constructor() ERC20("Test ENGI Token", "ENGI") {
        _mint(msg.sender, 1_000_000 * (10**uint256(decimals())));
    }

    uint256 constant DECIMALS = 10**18;
    uint256 public constant mintAmount = 10_000 * DECIMALS;
    uint256 public constant waitTime = 5 minutes;

    mapping(address => uint256) public lockTime;

    function requestTokens() public {
        require(allowedToWithdraw(msg.sender));
        _mint(msg.sender, mintAmount);
        lockTime[msg.sender] = block.timestamp + waitTime;
    }

    function allowedToWithdraw(address _address) public view returns (bool) {
        if (lockTime[_address] == 0) {
            return true;
        } else if (block.timestamp >= lockTime[_address]) {
            return true;
        }
        return false;
    }
}
