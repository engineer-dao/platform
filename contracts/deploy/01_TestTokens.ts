import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('TestENGI', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });

  await deploy('TestUSDC', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_test_tokens'; // id required to prevent reexecution
func.tags = ['ENGI', 'USDC'];
func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const { network } = hre;
  // skip deployment of the test ERC20 token on live networks
  return !!network?.live;
};
