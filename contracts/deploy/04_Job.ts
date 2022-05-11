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
    const testENGIDeployment = await deployments.get('TestENGI');
    engiAddress = testENGIDeployment.address;
    const testUSDCeployment = await deployments.get('TestUSDC');
    usdcAddress = testUSDCeployment.address;
  } else {
    throw new Error(`Unable to deploy to network ${network.name}`);
  }

  // get the proxy admin
  const proxyAdmin = await deployments.get('ProxyAdmin');
  const daoTreasury = await deployments.get('DaoTreasury');

  const isLocalTestNetwork = (network.name == 'hardhat' || network.name == 'localhost');
  const ownerAddress = isLocalTestNetwork ? deployer : proxyAdmin.address;

  await catchUnknownSigner(
    deploy('Job', {
      from: deployer,
      args: [],
      log: true,
      autoMine: true,
      proxy: {
        owner: ownerAddress,
        execute: {
          init: {
            methodName: 'initialize',
            args: [engiAddress, daoTreasury.address, disputeResolver],
          },
        },
      },
    })
  );


  if (isLocalTestNetwork) {
    // add USDC token
    const jobProxyAddress = (await deployments.get('Job')).address;
    const jobProxy = await hre.ethers.getContractAt(
      'Job',
      jobProxyAddress
    );

    jobProxy.updatePaymentTokens(usdcAddress, true);
  }
};

export default func;
func.id = 'deploy_job'; // id required to prevent reexecution
func.tags = ['Job'];
