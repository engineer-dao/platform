// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./Administratable.sol";
import "./IJob.sol";
import "./IDaoTreasury.sol";
import "./IRouter.sol";

contract DaoTreasury is IDaoTreasury, Initializable, Administratable {
    using SafeERC20 for IERC20;

    IJob public JobContract;
    IERC20 public stableCoin;

    IRouter public Router;

    function initialize(address _routerAddr) public initializer {
        Router = IRouter(_routerAddr);

        // default the admin to the deployer
        initializeAdmin(msg.sender);
    }

    function swapAllToStable(uint256 slippage) external onlyAdmin {
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
    ) public onlyAdmin {
        address[] memory path = new address[](2);
        path[0] = address(token);
        path[1] = address(stableCoin);

        uint256[] memory amounts = Router.getAmountsOut(tokenAmount, path);
        uint256 amountOut = amounts[amounts.length - 1];

        uint256 minAmountOut = amountOut - ((amountOut * slip) / 10000);

        // approve spending of our token from the router
        token.approve(address(Router), tokenAmount);

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
    ) external onlyAdmin {
        token.safeTransfer(to, tokenAmount);
    }

    function setJobContract(IJob addr) external onlyAdmin {
        JobContract = IJob(addr);
    }

    function setStableCoin(IERC20 tokenAddr) external onlyAdmin {
        stableCoin = tokenAddr;
    }

    function setRouter(IRouter routerAddr) external onlyAdmin {
        Router = IRouter(routerAddr);
    }


    receive() external payable {
        revert("Don't lock your MATIC !");
    }
}
