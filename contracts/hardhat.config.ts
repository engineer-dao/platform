import * as dotenv from 'dotenv';

import fs from 'fs-extra';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@atixlabs/hardhat-time-n-mine';
import 'hardhat-deploy';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task(
  'copy-compiled',
  'Adds compiled typechain factories to the frontend code',
  async (taskArguments, hre) => {
    try {
      await fs.copy('./typechain', '../frontend/src/contracts-typechain');
      console.log('Copy completed!');
    } catch (err) {
      console.log('An error occurred while copying the folder.');
      return console.error(err);
    }
  }
);

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: '0.8.4',
  namedAccounts: {
    deployer: 0,
  },
  networks: {
    localhost: {
      live: false,
    },
    hardhat: {
      chainId: 1337,
      live: false,
    },
    rinkeby: {
      url: process.env.TESTNET_URL || '',
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
