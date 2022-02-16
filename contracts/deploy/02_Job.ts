import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  let erc20ContractAddress: string;
  if (network.live === false) {
    // use the test erc 20 token for testing on test networks
    const testERC20Deployment = await deployments.get('TestERC20');
    erc20ContractAddress = testERC20Deployment.address;
  } else {
    throw new Error(`Unable to deploy to network ${network.name}`);
  }

  const treasury = '0x70997970c51812dc3a010c7d01b50e0d17dc79c8';
  const resolver = '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc';

  await deploy('Job', {
    from: deployer,
    args: [erc20ContractAddress, treasury, resolver],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_job'; // id required to prevent reexecution
func.tags = ['Job'];
