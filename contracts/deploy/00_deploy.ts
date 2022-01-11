import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from "hardhat";
import { Contract } from "ethers";

let FirewallFactory: Contract;

const func: DeployFunction = async function(hre: HardhatRuntimeEnvironment) {
    const {
        getNamedAccounts,
        deployments,
        getChainId,
        getUnnamedAccounts,
    } = hre;

    const chainId = await getChainId();
    console.log("Chain ID", chainId);
    const { deployer } = await getNamedAccounts();

    const FirewallFactoryFactory = await ethers.getContractFactory("FirewallFactory");
    FirewallFactory = await FirewallFactoryFactory.deploy();
    await FirewallFactory.deployed();
    console.log("✓ <<FirewallFactory address>>", FirewallFactory.address);

    console.log("<<<<< GREAT SUCCESS ! >>>>>");
};
export default func;
