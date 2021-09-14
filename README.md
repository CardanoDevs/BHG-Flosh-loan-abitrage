# BHG-Flosh-loan-abitrage

Aave, previously known as ETHLender, has catapulted to the forefront of the DeFi space. Aave was the first in the space to come up with the idea of a Flash Loan. Before flash loans, you would have to stake an over-collateralized asset to loan another asset. For example, if I wanted to borrow one DAI I would have to deposit another cryptocurrency that exceeded that value. In other words, you had to have money to borrow money. Flash Loans demolished this idea. And they opened up doors for a new loaning system. They did this by allowing users to borrow without putting up anything as collateral. In this tutorial you will learn how this is possible and how you can do it yourself!

https://www.quicknode.com/guides/defi/how-to-make-a-flash-loan-using-aave

# Remix Setup

https://remix.ethereum.org/
This is a browser-based IDE. Also known as an Integrated Development Environment.
Remix comes with the ability to write, debug, deploy, and otherwise manipulate Ethereum Smart Contracts.

# Remix Setup

Smart contracts allow us to read and write data to the blockchain by executing deterministic programs. When coding a smart contract for use on Ethereum, we use a programming language called Solidity. Solidity files end in the .sol extension.

You will want to create several files:
1.FlashLoan.sol
2.FlashLoanReceiverBase.sol
3.ILendingPoolAddressesProvider.sol
4.IFlashLoanReceiver.sol
5.ILendingPool.sol
6.Withdrawable.sol

pragma solidity ^0.6.6;
import "./FlashLoanReceiverBase.sol";
import "./ILendingPoolAddressesProvider.sol";
import "./ILendingPool.sol";

contract FlashloanV1 is FlashLoanReceiverBaseV1 {

    constructor(address _addressProvider) FlashLoanReceiverBaseV1(_addressProvider) public{}

 /**
        Flash loan 1000000000000000000 wei (1 ether) worth of `_asset`
     */
 function flashloan(address _asset) public onlyOwner {
        bytes memory data = "";
        uint amount = 1 ether;

        ILendingPoolV1 lendingPool = ILendingPoolV1(addressesProvider.getLendingPool());
        lendingPool.flashLoan(address(this), _asset, amount, data);
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
        //

        uint totalDebt = _amount.add(_fee);
        transferFundsBackToPoolInternal(_reserve, totalDebt);
    }

}


1.First, we have to define the solidity compiler version. In this case, it's 0.6.6.
     2-4. Importing dependencies for the smart contract
      6. The FlashLoanV1 contract is inheriting from the FlashLoanReceiverBaseV1 contract.
      8. We passed the address of one of the Lending Pool Providers of Aave. In this case, we are providing the address of DAI Lending Pool. 
     13. We have defined a function called flashLoan. It takes the address of the asset we want to flash loan. In this case the asset is DAI.
14. We don't have any need of data for the flash loan, so we are passing an empty string.
15. We are defining the number of DAI(in terms of wei which is 10^18) we want to loan.
16. We initialize the LendingPool interface which is ILendingPoolV1 provided by Aave so that we can call the flashLoan function.
17. Finally, we call our flashLoan function. The function takes 4 main parameters. First we pass the address which will receive the loan. In our case, it's our own contract. Second, we pass the address of the asset. In our case, it's the address of DAI in the Kovan network. Third, we pass the amount of assets, and in our case it's 1 “ether” amount of units(or 10^18 in “wei” units). Last but not least, we pass the data value which in our case is an empty string.
24-31 Next, we define the second function which is executeOperation. It’s where we utilize the flash loan. It’s called internally after the flashLoan function is successfully executed. It takes 4 main parameter which are -
        1. The address of reserve to which we will have to pay back the loan.
        2. The amount of asset
        3. The fee that is charged by the protocol
        4. Additional parameter which is used internally by the function.
33. It checks if we received the appropriate amount of loan or else it will throw an error message.
34. At this point, this is where you would implement logic for any arbitrary use case.
40. We add the fee along with the loan amount by using add function provided by SafeMaths library.
41.At last we pay back the total debt or loan amount back to the lending pool.

Usage
======================

1. first have to deploy smart contract (flashloan.sol) to mainnet(if deploy to test net  please check provider address and token address)
2. install Dapp's enviroments(node_module) 
```
$ npm install
```
3. run dapp
```
$ npm run start

```

This Dapp for mainnet, So if you want test on testnet please modifiy some variables.


```
const web3    = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"));
const uniswap_address = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'
const sushi_address = '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F'
const Eth_address   = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
```

next step run Dapp and input your token address to be listed.

4. input your wallet address and private key.
5. input deployed contract address and press excute auto trade button.
6. in modal input interval and loanamount, slippage and profit limit. and start.
7. in log channel you can check about transaction's detail informations