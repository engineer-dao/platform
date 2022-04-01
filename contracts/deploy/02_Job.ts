import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer, daoTreasury, disputeResolver } = await getNamedAccounts();

  let erc20ContractAddress: string;
  if (network.live === false) {
    // use the test erc 20 token for testing on test networks
    const testERC20Deployment = await deployments.get('TestERC20');
    erc20ContractAddress = testERC20Deployment.address;
  } else {
    throw new Error(`Unable to deploy to network ${network.name}`);
  }

  await deploy('Job', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
    proxy: {
      execute: {
        init: {
          methodName: 'initialize',
          args: [erc20ContractAddress, daoTreasury, disputeResolver],
        },
      },
    },
  });
};

export default func;
func.id = 'deploy_job'; // id required to prevent reexecution
func.tags = ['Job'];
