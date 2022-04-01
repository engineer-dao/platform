// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IJob {
    /**********
     * Events *
     **********/

    /***********
     * Structs *
     ***********/

    /*******************************
     * Authorized Setter Functions *
     *******************************/

    /********************
     * Public Functions *
     ********************/

    function paymentTokens(IERC20) external view returns (bool);

    function getAllPaymentTokens() external view returns (IERC20[] memory tokens);
}
