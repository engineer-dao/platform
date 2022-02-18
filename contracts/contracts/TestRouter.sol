pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IRouter.sol";

/// @notice Used for automatic swaps in the DaoTreasury.sol
contract TestRouter is IRouter {
    using SafeERC20 for IERC20;

    function getAmountsOut(uint256 amountIn, address[] memory path) external view returns (uint256[] memory) {
        uint256[] memory amounts = new uint256[](2);

        amounts[0] = amountIn;
        amounts[1] = amountIn;

        return amounts;
    }

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {
        // 1 to 1 swap
        IERC20 tokenFrom = IERC20(path[0]);
        IERC20 tokenTo = IERC20(path[1]);
        tokenFrom.safeTransferFrom(msg.sender, address(this), amountIn);
        tokenTo.safeTransfer(to, amountIn);
    }

    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external {
        // not implemented
    }

    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external payable {
        // not implemented
    }
}
