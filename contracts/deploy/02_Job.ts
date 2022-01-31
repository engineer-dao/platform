import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let erc20ContractAddress: string;
  if (network.name == 'localhost' || network.name == 'hardhat') {
    // use the test erc 20 token for testing on localhost
    const testERC20Deployment = await deployments.get('TestERC20');
    erc20ContractAddress = testERC20Deployment.address;
  } else {
    throw new Error(`Unable to deploy to network ${network.name}`);
  }

  await deploy('Job', {
    from: deployer,
    args: [erc20ContractAddress],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_job'; // id required to prevent reexecution
func.tags = ['Job'];