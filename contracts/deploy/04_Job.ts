import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, catchUnknownSigner } = deployments;
  const { deployer, disputeResolver } = await getNamedAccounts();

  let engiAddress: string;
  let usdcAddress: string;
  if (network.live === false) {
    // use the test erc 20 token for testing on test networks
    const engiDeployment = await deployments.get('TestENGI');
    const usdcDeployment = await deployments.get('TestUSDC');
    engiAddress = engiDeployment.address;
    usdcAddress = usdcDeployment.address;
  } else {
    throw new Error(`Unable to deploy to network ${network.name}`);
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
            args: [
              [engiAddress, usdcAddress],
              daoTreasury.address,
              disputeResolver,
            ],
          },
        },
      },
    })
  );
};

export default func;
func.id = 'deploy_job'; // id required to prevent reexecution
func.tags = ['Job'];
