import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { daoTreasury } = await getNamedAccounts();

  await deploy('DaoTreasury', {
    from: daoTreasury,
    args: [
      process.env.TREASURE_ROUTER_CONTRACT_ADDRESS ||
        ethers.constants.AddressZero,
    ],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_dao_treasury'; // id required to prevent reexecution
func.tags = ['DaoTreasury'];
