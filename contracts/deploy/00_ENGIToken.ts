import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  await deploy('ENGIToken', {
    from: deployer,
    args: [],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_engi_erc20'; // id required to prevent reexecution
func.tags = ['ENGIToken'];
func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const { network } = hre;
  if (network.live) {
    return false;
  }
  // skip deployment of the test ERC20 token on test networks
  return true;
};
