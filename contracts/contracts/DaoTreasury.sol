pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IJob.sol";

interface IRouter {
    function getAmountsOut(uint256 amountIn, address[] memory path) external view returns (uint256[] memory amounts);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
}

contract DaoTreasury is Ownable {
    using SafeERC20 for IERC20;

    IJob public JobContract;
    IERC20 public stableCoin;

    // mainnet
    IRouter public Router = IRouter(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);

    constructor () {
    }

    function swapAllToStable(uint slippage) external onlyOwner {
        IERC20[] memory tokens = JobContract.getAllPaymentTokens();
        for (uint i = 0; i < tokens.length; i++) {
            swapToStable(tokens[i], tokens[i].balanceOf(address(this)), slippage);
        }
    }

    function swapToStable(IERC20 token, uint tokenAmount, uint slip) public onlyOwner {
        address[] memory path = new address[](2);
        path[0] = address(token);
        path[0] = address(stableCoin);

        uint256[] memory amounts = Router.getAmountsOut(tokenAmount, path);
        uint amountOut = amounts[amounts.length - 1];

        uint minAmountOut = amountOut - (amountOut * slip / 10000);

        Router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            minAmountOut,
            path,
            address(this),
            block.timestamp
        );
    }

    function transfer(IERC20 token, uint tokenAmount, address to) external onlyOwner {
        token.safeTransfer(to, tokenAmount);
    }

    function setJobContract(IJob addr) external onlyOwner {
        JobContract = IJob(addr);
    }

    function setStableCoin(IERC20 tokenAddr) external onlyOwner {
        stableCoin = tokenAddr;
    }

    function setRouter(IRouter routerAddr) external onlyOwner {
        Router = IRouter(routerAddr);
    }
}
