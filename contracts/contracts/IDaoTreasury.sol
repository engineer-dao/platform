// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IJob.sol";
import "./IRouter.sol";

interface IDaoTreasury {
    function swapAllToStable(uint256 slippage) external;

    function swapToStable(
        IERC20 token,
        uint256 tokenAmount,
        uint256 slip
    ) external;

    function transfer(
        IERC20 token,
        uint256 tokenAmount,
        address to
    ) external;

    function setJobContract(IJob addr) external;

    function setStableCoin(IERC20 tokenAddr) external;

    function setRouter(IRouter routerAddr) external;
}

