//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TestERC20Faucet {
    using SafeERC20 for IERC20;

    uint256 constant DECIMALS = 10**18;
    uint256 constant public tokenAmount = 5_000 * DECIMALS;
    uint256 constant public waitTime = 30 minutes;

    IERC20 public tokenInstance;
    
    mapping(address => uint256) lastAccessTime;

    constructor(address _tokenInstance) public {
        require(_tokenInstance != address(0));
        tokenInstance = IERC20(_tokenInstance);
    }

    function requestTokens() public {
        require(allowedToWithdraw(msg.sender));
        tokenInstance.safeTransfer(msg.sender, tokenAmount);
        lastAccessTime[msg.sender] = block.timestamp + waitTime;
    }

    function allowedToWithdraw(address _address) public view returns (bool) {
        if(lastAccessTime[_address] == 0) {
            return true;
        } else if(block.timestamp >= lastAccessTime[_address]) {
            return true;
        }
        return false;
    }
}