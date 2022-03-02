import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { parseEther } from 'ethers/lib/utils';

const func: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment,
) {
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

  await deploy('TestERC20Faucet', {
    from: deployer,
    args: [erc20ContractAddress],
    log: true,
    autoMine: true,
  });
};

export default func;
func.id = 'deploy_test_erc20_faucet'; // id required to prevent reexecution
func.tags = ['TestERC20Faucet'];
func.skip = async (hre: HardhatRuntimeEnvironment) => {
  const { network } = hre;
  // skip deployment of the test ERC20 token faucet on live networks
  if (network.live) {
    return true;
  }
  return false;
};
