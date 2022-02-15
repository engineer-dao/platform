pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IJob.sol";
import "./IDaoTreasury.sol";
import "./IRouter.sol";

contract DaoTreasury is IDaoTreasury, Ownable {
    using SafeERC20 for IERC20;

    IJob public JobContract;
    IERC20 public stableCoin;

    // mainnet
    IRouter public Router = IRouter(0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff);

    constructor() {}

    function swapAllToStable(uint256 slippage) external onlyOwner {
        IERC20[] memory tokens = JobContract.getAllPaymentTokens();
        uint256 balance;
        for (uint256 i = 0; i < tokens.length; i++) {
            balance = tokens[i].balanceOf(address(this));
            if (balance > 0) {
                tokens[i].approve(msg.sender, balance);
                swapToStable(tokens[i], balance, slippage);
            }
        }
    }

    function swapToStable(
        IERC20 token,
        uint256 tokenAmount,
        uint256 slip
    ) public onlyOwner {
        address[] memory path = new address[](2);
        path[0] = address(token);
        path[0] = address(stableCoin);

        uint256[] memory amounts = Router.getAmountsOut(tokenAmount, path);
        uint256 amountOut = amounts[amounts.length - 1];

        uint256 minAmountOut = amountOut - ((amountOut * slip) / 10000);

        Router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            tokenAmount,
            minAmountOut,
            path,
            address(this),
            block.timestamp
        );
    }

    function transfer(
        IERC20 token,
        uint256 tokenAmount,
        address to
    ) external onlyOwner {
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

    receive() external payable {
        revert("Don't lock your MATIC !");
    }
}
