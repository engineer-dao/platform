import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer, daoTreasury, disputeResolver } = await getNamedAccounts();

  const minDelay = process.env.PROXY_ADMIN_TIMELOCK_DELAY || 604800; // 7 days
  const proposers = [process.env.PROXY_ADMIN_OWNER || deployer];
  const executors = [process.env.PROXY_ADMIN_OWNER || deployer];

  await deploy('ProxyAdmin', {
    from: deployer,
    args: [minDelay, proposers, executors],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_proxyadmin'; // id required to prevent reexecution
func.tags = ['ProxyAdmin'];
