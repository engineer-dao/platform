import * as dotenv from 'dotenv'
import 'solidity-coverage'
import { HardhatUserConfig } from "hardhat/types";
// @ts-ignore
import { DEFAULT_ACCOUNTS_HARDHAT } from "./test/helpers/constants";


// Hardhat plugins
import "@nomiclabs/hardhat-etherscan";
import "hardhat-typechain";
import "@nomiclabs/hardhat-waffle";
import "hardhat-gas-reporter";
import 'hardhat-deploy';
import "@nomiclabs/hardhat-ethers";
import '@primitivefi/hardhat-dodoc'
import 'hardhat-output-validator'

// Load environment variables from .env
dotenv.config()

const enableGasReport = !!process.env.ENABLE_GAS_REPORT
const privateKey = process.env.PRIVATE_KEY || '0x' + '11'.repeat(32) // this is to avoid hardhat error
const RPC_URL = process.env.RPC_URL;

// const privateKey = new Buffer(privateey "hex");
const hardhatConfig: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        mainnet: {
            url: RPC_URL,
            chainId: 56,
            gasPrice: 5e9,
            accounts: [privateKey],
        },
        testnet: {
            url: process.env.RPC_URL_TEST,
            gasPrice: 1000000000,
            accounts: [privateKey]
        },
        localhost: {
            url: "http://127.0.0.1:8545"
        },
        hardhat: {
            forking: {
                url: RPC_URL,
                blockNumber: 13612646,
            },
            gasPrice: 5e9,
            accounts: [
                {
                    privateKey: privateKey, balance: "100000000000000000000000000",
                },
                ...DEFAULT_ACCOUNTS_HARDHAT
            ],
            throwOnTransactionFailures: true,
            throwOnCallFailures: true,
            loggingEnabled: true,
        }
    },
    namedAccounts: {
        deployer: {
            default: 0,
            "testnet": 0,
            "mainnet": 0
        },
    },
    solidity: {
        version: "0.8.10",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    typechain: {
        outDir: 'dist/types',
        target: 'ethers-v5',
    },
    paths: {
        deploy: './deploy',
        deployments: './deployments',
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: enableGasReport,
        currency: 'USD',
        gasPrice: 100,
        showTimeSpent: true,
        outputFile: process.env.CI ? 'gas-report.txt' : undefined,
    },
    dodoc: {
        runOnCompile: false,
    },
    outputValidator: {
        runOnCompile: false,
        errorMode: true,
        checks: {
            events: false,
            compilationWarnings: false,
            variables: false,
        },
    },
};

export default hardhatConfig
