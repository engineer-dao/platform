import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Job__factory } from '../typechain';

// ------------------------------------------------------------------------------------------------
// Proxy Info

task(
  'proxy-info',
  'Get proxy information',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers, getNamedAccounts } = hre;
    const [deployer] = await ethers.getSigners();
    const contractAddress = (taskArguments as any).proxycontract;

    // build the proxy
    const JobProxy = await ethers.getContractAt('JobProxy', contractAddress);
    const owner = await JobProxy.owner();
    const implementationBigNum = ethers.BigNumber.from(
      await ethers.provider.getStorageAt(
        contractAddress,
        '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
      )
    );
    const implementationAddress = ethers.utils.getAddress(
      implementationBigNum.toHexString()
    );

    const info = `
----------------------------------------------------------
Job Proxy
----------------------------------------------------------
         owner: ${owner}
implementation: ${implementationAddress}
  `;
    console.log(info);
  }
).addParam('proxycontract', 'Contract address');

// ------------------------------------------------------------------------------------------------
// Proxy Admin Schedule

task(
  'proxy-admin-schedule',
  'Schedule a call using the job admin contract',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers, getNamedAccounts } = hre;
    const [deployer] = await ethers.getSigners();
    const jobProxyAddress = (taskArguments as any).jobproxy;
    const adminContractAddress = (taskArguments as any).admincontract;
    const method = (taskArguments as any).method;
    const arg1 = (taskArguments as any).arg1;
    const arg2 = (taskArguments as any).arg2;
    const show = (taskArguments as any).show;

    // build the proxy
    const ProxyAdmin = await ethers.getContractAt(
      'ProxyAdmin',
      adminContractAddress
    );

    // get the delay
    const minDelay = await ProxyAdmin.getMinDelay();
    const delay = minDelay;

    // generate calldata
    const JobABI = Job__factory.abi;
    const jobInterface = new ethers.utils.Interface(JobABI);
    const args = [arg1];
    if (arg2 != null) {
      args.push(arg2);
    }

    const callData = jobInterface.encodeFunctionData(method, args);

    // predecessor and salt
    const predecessor = ethers.utils.formatBytes32String(''); // empty
    const salt =
      '0x' + Buffer.from(ethers.utils.randomBytes(32)).toString('hex');

    // schedule the call with the proxy admin
    if (show) {
      console.log(
        `
     address target: ${jobProxyAddress}
      uint256 value: ${0}
bytes calldata data: ${callData}
bytes32 predecessor: ${predecessor}
       bytes32 salt: ${salt}
      uint256 delay: ${delay}
        `
      )
    } else {
      await ProxyAdmin.schedule(
        jobProxyAddress,
        0,
        callData,
        predecessor,
        salt,
        delay
      );
      console.log(
        `Job scheduled with\n--calldata ${callData} --salt ${salt}`
      );
    }
  }
)
  .addParam('admincontract', 'Admin contract address')
  .addParam('jobproxy', 'Job proxy contract address')
  .addParam('method', 'Method name')
  .addOptionalParam('arg1', 'Argument One')
  .addOptionalParam('arg2', 'Argument Two')
  .addFlag("show", "Show transaction data only")

// ------------------------------------------------------------------------------------------------
// Proxy Admin Execute

task(
  'proxy-admin-execute',
  'Execute a call using the job admin contract',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers, getNamedAccounts } = hre;
    const [deployer] = await ethers.getSigners();
    const jobProxyAddress = (taskArguments as any).jobproxy;
    const adminContractAddress = (taskArguments as any).admincontract;
    const calldata = (taskArguments as any).calldata;
    const salt = (taskArguments as any).salt;
    const show = (taskArguments as any).show;

    // build the proxy
    const ProxyAdmin = await ethers.getContractAt(
      'ProxyAdmin',
      adminContractAddress
    );

    const predecessor = ethers.utils.formatBytes32String(''); // empty

    if (show) {
          console.log(
            `
     address target: ${jobProxyAddress}
bytes calldata data: ${calldata}
bytes32 predecessor: ${predecessor}
       bytes32 salt: ${salt}
            `
          )
    } else {
      await ProxyAdmin.execute(jobProxyAddress, 0, calldata, predecessor, salt);
      console.log('executed call');

    }


  }
)
  .addParam('admincontract', 'Admin contract address')
  .addParam('jobproxy', 'Job proxy contract address')
  .addParam('calldata', 'Call data')
  .addParam('salt', 'Salt')
  .addFlag("show", "Show transaction data only")


// ------------------------------------------------------------------------------------------------
// Proxy Show Scheduled

task(
  'proxy-admin-show-scheduled',
  'Show Scheduled calls in the job admin contract',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers, getNamedAccounts } = hre;
    const [deployer] = await ethers.getSigners();
    const adminContractAddress = (taskArguments as any).admincontract;

    // build the proxy
    const ProxyAdmin = await ethers.getContractAt(
      'ProxyAdmin',
      adminContractAddress
    );

    // get all events
    const filter = ProxyAdmin.filters.CallScheduled();
    const results = await ProxyAdmin.queryFilter(filter);

    const JobABI = Job__factory.abi;
    const jobInterface = new ethers.utils.Interface(JobABI);

    let resultTexts: string[] = [];
    for (const result of results) {
      const transactionDescription = jobInterface.parseTransaction({
        data: result.args.data,
        value: result.args.value,
      });

      const operationId = result.args.id;
      const timestamp = await ProxyAdmin.getTimestamp(operationId);
      const readyDate = timestamp.toNumber() > 1 ? new Date(timestamp.toNumber() * 1000) : '[none]';

      const isReady = await ProxyAdmin.isOperationReady(operationId);
      const isPending = await ProxyAdmin.isOperationPending(operationId);
      const isDone = await ProxyAdmin.isOperationDone(operationId);

      const resultText = `
            id: ${result.args.id}
        target: ${result.args.target}
      function: ${transactionDescription.name}
          args: ${transactionDescription.args.toString()}
         delay: ${result.args.delay}
       readyOn: ${readyDate}
     isPending: ${isPending}
       isReady: ${isReady}
        isDone: ${isDone}
      `;
      console.log(resultText);
    }
  }
).addParam('admincontract', 'Admin contract address');
