import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, catchUnknownSigner } = deployments;
  const { deployer, disputeResolver } = await getNamedAccounts();

  let erc20ContractAddress: string;
  if (network.live === false) {
    // use the test erc 20 token for testing on test networks
    const testERC20Deployment = await deployments.get('TestERC20');
    erc20ContractAddress = testERC20Deployment.address;
  } else {
    const engiToken = await deployments.get('ENGIToken');
    erc20ContractAddress = engiToken.address;
  }

  // get the proxy admin
  const proxyAdmin = await deployments.get('ProxyAdmin');
  const daoTreasury = await deployments.get('DaoTreasury');

  await catchUnknownSigner(
    deploy('Job', {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
      proxy: {
        owner: proxyAdmin.address,
        execute: {
          init: {
            methodName: 'initialize',
            args: [erc20ContractAddress, daoTreasury.address, disputeResolver],
          },
        },
      },
    })
  );
};

export default func;
func.id = 'deploy_job'; // id required to prevent reexecution
func.tags = ['Job'];
