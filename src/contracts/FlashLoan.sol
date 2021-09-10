pragma solidity ^0.6.6;
import "./FlashLoanReceiverBase.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./ILendingPool.sol";


interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
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
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}   
   


contract FlashloanV1 is FlashLoanReceiverBaseV1 {
    
    
    event FlashLoanEmitted(
        address a,
        address b,
        uint256 repayAmount
    );
    
    address constant uniswapAddress    = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
    address constant sushiswapAddress  = 0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F;
    IUniswapV2Router02 uniswap         = IUniswapV2Router02(uniswapAddress);
    IUniswapV2Router02 sushiswap       = IUniswapV2Router02(sushiswapAddress);
    address dexa;
    address weth = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
    
    constructor(address _addressProvider) FlashLoanReceiverBaseV1(_addressProvider) public{}
    bool direction;
 /**
        Flash loan 1000000000000000000 wei (1 ether) worth of `_asset`
     */
     
     
     
 function flashloan(address _asset, uint256 _amount, bool _direction) public onlyOwner {
        
        bytes memory data = "";
        uint amount  = _amount * 1 ether;
        
        ILendingPoolV1 lendingPool = ILendingPoolV1(addressesProvider.getLendingPool());
        dexa = _asset;
        lendingPool.flashLoan(address(this), weth, amount, data);
        direction = _direction;
    }



    /**
  This function is called after your contract has received the flash loaned amount
     */
    function executeOperation(
        address _reserve,
        uint256 _amount,
        uint256 _fee,
        bytes calldata _params
    )
        external
        override
    {
        require(_amount <= getBalanceInternal(address(this), _reserve), "Invalid balance, was the flashLoan successful?");
       //
        // Your logic goes here.
        // !! Ensure that *this contract* has enough of `_reserve` funds to payback the `_fee` !!
        

            
            address[] memory path1 = new address[](2);
            uint256 amountIna = IERC20(dexa).balanceOf(address(this));
            
            
            if (direction = true){
                IERC20(weth).approve(address(uniswap), amountIna);
                path1[0] = address(weth);
                path1[1] = address(dexa);
                uniswap.swapExactTokensForTokens(amountIna, 0, path1, address(this), block.timestamp);
        
                uint256 amountInweth = IERC20(address(dexa)).balanceOf(address(this));
                IERC20(dexa).approve(address(sushiswap), amountInweth);
                path1[0] = address(dexa);
                path1[1] = address(weth);
                sushiswap.swapExactTokensForTokens(amountInweth, 0, path1, address(this), block.timestamp);
            } else if( direction = false){
                IERC20(weth).approve(address(sushiswap), amountIna);
                path1[0] = address(weth);
                path1[1] = address(dexa);
                sushiswap.swapExactTokensForTokens(amountIna, 0, path1, address(this), block.timestamp);
        
                uint256 amountInweth = IERC20(address(dexa)).balanceOf(address(this));
                IERC20(dexa).approve(address(uniswap), amountInweth);
                path1[0] = address(dexa);
                path1[1] = address(weth);
                uniswap.swapExactTokensForTokens(amountInweth, 0, path1, address(this), block.timestamp);
            } 
            
            uint totalDebt = _amount.add(_fee);
            uint256 profit = IERC20(dexa).balanceOf(address(this)) - totalDebt;
            // Note that you can ignore the line below
            // if your dydx account (this contract in this case)
            // has deposited at least ~2 Wei of assets into the account
            // to balance out the collaterization ratio
            require(
                profit > 0,
                "Not enough funds to repay dydx loan!"
            );
    
            // transfer the profit to the owner address
            IERC20(dexa).transfer(msg.sender, profit);
    
            // TODO: Encode your logic here
            // E.g. arbitrage, liquidate accounts, etc
            // revert("Hello, you haven't encoded your logic");
            emit FlashLoanEmitted(dexa, weth, totalDebt);
            transferFundsBackToPoolInternal(_reserve, totalDebt);
    }

}