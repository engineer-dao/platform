import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task(
  'add-token-to-job-contract',
  'Whitelist a new token',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const privatekey = (taskArguments as any).privatekey;
    const jobContractAddress = (taskArguments as any).jobcontract;
    const newTokenAddress = (taskArguments as any).newtoken;

    // build the proxy
    const JobContract = await ethers.getContractAt('Job', jobContractAddress);

    // get the wallet
    const wallet = new ethers.Wallet(privatekey, ethers.provider);

    const transactionResult = await JobContract.connect(
      wallet
    ).updatePaymentTokens(newTokenAddress, true);
    console.log(`Finished with tx: ${transactionResult.hash}`);
  }
)
  .addParam('privatekey', 'The signing private key')
  .addParam('jobcontract', 'Job contract address')
  .addParam('newtoken', 'token address to add');
