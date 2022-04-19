import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
// import { Job__factory } from '../typechain';

// ------------------------------------------------------------------------------------------------
// Proxy Info

task(
  'proxy-info',
  'Get proxy information',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
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
    const { ethers } = hre;
    const jobProxyAddress = (taskArguments as any).jobproxy;
    const adminContractAddress = (taskArguments as any).admincontract;
    const method = (taskArguments as any).method;
    const arg1 = (taskArguments as any).arg1;
    const arg2 = (taskArguments as any).arg2;
    const show = (taskArguments as any).show;
    const asproxy = (taskArguments as any).asproxy;

    // build the proxy
    const ProxyAdmin = await ethers.getContractAt(
      'ProxyAdmin',
      adminContractAddress
    );

    // get the delay
    const minDelay = await ProxyAdmin.getMinDelay();
    const delay = minDelay;

    const args = [arg1];
    if (arg2 != null) {
      args.push(arg2);
    }

    // generate calldata
    const contractInterface = new ethers.utils.Interface(
      resolveJobInterfaceABI(asproxy)
    );
    const callData = contractInterface.encodeFunctionData(method, args);

    // predecessor and salt
    const predecessor = ethers.utils.formatBytes32String(''); // empty
    const salt =
      '0x' + Buffer.from(ethers.utils.randomBytes(32)).toString('hex');

    // schedule the call with the proxy admin
    if (show) {
      console.log(
        `
     contract address: ${adminContractAddress}

       address target: ${jobProxyAddress}
        uint256 value: ${0}
  bytes calldata data: ${callData}
  bytes32 predecessor: ${predecessor}
         bytes32 salt: ${salt}
        uint256 delay: ${delay}

        --calldata ${callData} --salt ${salt}
        `
      );
    } else {
      const transactionResult = await ProxyAdmin.schedule(
        jobProxyAddress,
        0,
        callData,
        predecessor,
        salt,
        delay
      );
      console.log(`Job scheduled with\n--calldata ${callData} --salt ${salt}`);
      console.log(`completed tx: ${transactionResult.hash}`);
    }
  }
)
  .addParam('admincontract', 'Admin contract address')
  .addParam('jobproxy', 'Job proxy contract address')
  .addParam('method', 'Method name')
  .addOptionalParam('arg1', 'Argument One')
  .addOptionalParam('arg2', 'Argument Two')
  .addFlag('asproxy', 'Schedule a proxy method')
  .addFlag('show', 'Show transaction data only');

// ------------------------------------------------------------------------------------------------
// Proxy Admin Execute

task(
  'proxy-admin-execute',
  'Execute a call using the job admin contract',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
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
     contract address: ${adminContractAddress}

       address target: ${jobProxyAddress}
  bytes calldata data: ${calldata}
  bytes32 predecessor: ${predecessor}
         bytes32 salt: ${salt}
            `
      );
    } else {
      const transactionResult = await ProxyAdmin.execute(
        jobProxyAddress,
        0,
        calldata,
        predecessor,
        salt
      );
      console.log('executed call');
      console.log(`Finished with tx: ${transactionResult.hash}`);
    }
  }
)
  .addParam('admincontract', 'Admin contract address')
  .addParam('jobproxy', 'Job proxy contract address')
  .addParam('calldata', 'Call data')
  .addParam('salt', 'Salt')
  .addFlag('show', 'Show transaction data only');

// ------------------------------------------------------------------------------------------------
// Proxy Show Scheduled

task(
  'proxy-admin-show-scheduled',
  'Show Scheduled calls in the job admin contract',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const adminContractAddress = (taskArguments as any).admincontract;
    const asproxy = (taskArguments as any).asproxy;

    // build the proxy
    const ProxyAdmin = await ethers.getContractAt(
      'ProxyAdmin',
      adminContractAddress
    );

    // get all events
    const filter = ProxyAdmin.filters.CallScheduled();
    const results = await ProxyAdmin.queryFilter(filter);

    const contractInterface = new ethers.utils.Interface(
      resolveJobInterfaceABI(asproxy)
    );

    let resultTexts: string[] = [];
    for (const result of results) {
      const transactionDescription = contractInterface.parseTransaction({
        data: result?.args?.data,
        value: result?.args?.value,
      });

      const operationId = result?.args?.id;
      const timestamp = await ProxyAdmin.getTimestamp(operationId);
      const readyDate =
        timestamp.toNumber() > 1
          ? new Date(timestamp.toNumber() * 1000)
          : '[none]';

      const isReady = await ProxyAdmin.isOperationReady(operationId);
      const isPending = await ProxyAdmin.isOperationPending(operationId);
      const isDone = await ProxyAdmin.isOperationDone(operationId);

      const resultText = `
            id: ${result?.args?.id}
        target: ${result?.args?.target}
      function: ${transactionDescription.name}
          args: ${transactionDescription.args.toString()}
         delay: ${result?.args?.delay}
       readyOn: ${readyDate}
     isPending: ${isPending}
       isReady: ${isReady}
        isDone: ${isDone}
      `;
      console.log(resultText);
    }
  }
)
  .addParam('admincontract', 'Admin contract address')
  .addFlag(
    'asproxy',
    'Show a proxy method and not a job implementation method'
  );

// ------------------------------------------------------------------------------------------------
// Proxy Admin Decode Calldata

task(
  'proxy-admin-decode-calldata',
  'Decode calldata from the job admin contract',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const calldata = (taskArguments as any).calldata;
    const asproxy = (taskArguments as any).asproxy;

    // get the contract interface
    const contractInterface = new ethers.utils.Interface(
      resolveJobInterfaceABI(asproxy)
    );

    // decode the contract call
    const transactionDescription = contractInterface.parseTransaction({
      data: calldata,
      value: 0,
    });

    const resultText = `
----------------------------------------------------------
Decoded calldata
----------------------------------------------------------
function: ${transactionDescription.name}
    args: ${transactionDescription.args.toString()}
    `;
    console.log(resultText);
  }
)
  .addParam('calldata', 'Call data')
  .addFlag(
    'asproxy',
    'Decode a proxy method and not a job implementation method'
  );

// ------------------------------------------------------------------------------------------------
// Transfer Proxy Ownership

task(
  'transfer-ownership',
  'Transfer Ownership to a new address',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const privatekey = (taskArguments as any).privatekey;
    const contractAddress = (taskArguments as any).contractaddress;
    const newOwnerAddress = (taskArguments as any).newowner;

    // build the contract as a JobProxy (but will work for any Ownable contract)
    const Ownable = await ethers.getContractAt('JobProxy', contractAddress);

    // get the wallet
    const wallet = new ethers.Wallet(privatekey, ethers.provider);

    // transfer ownership
    console.log(`Transfering ownership to ${newOwnerAddress}`);
    const transactionResult = await Ownable.connect(wallet).transferOwnership(
      newOwnerAddress
    );
    console.log(`Finished with tx: ${transactionResult.hash}`);
  }
)
  .addParam('privatekey', 'The signing private key')
  .addParam('contractaddress', 'Contract address')
  .addParam('newowner', 'New owner address');

// ------------------------------------------------------------------------------------------------
// Renounce admin role

task(
  'proxy-admin-renounce-admin-role',
  'Renounce role ownership of the admin proxy',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const privatekey = (taskArguments as any).privatekey;
    const adminContractAddress = (taskArguments as any).admincontract;
    const role = (taskArguments as any).role;

    // build the proxy
    const ProxyAdmin = await ethers.getContractAt(
      'ProxyAdmin',
      adminContractAddress
    );

    // get the wallet
    const wallet = new ethers.Wallet(privatekey, ethers.provider);

    // get the role name
    const encodedRole = await getEncodedRoleAdmin(ProxyAdmin, role);

    console.log(`renouncing role ${role} from address ${wallet.address}`);
    const transactionResult = await ProxyAdmin.connect(wallet).renounceRole(
      encodedRole,
      wallet.address
    );
    console.log(`Finished with tx: ${transactionResult.hash}`);
  }
)
  .addParam('privatekey', 'The signing private key')
  .addParam('admincontract', 'Admin contract address')
  .addParam(
    'role',
    'Role name: TIMELOCK_ADMIN_ROLE | PROPOSER_ROLE | EXECUTOR_ROLE'
  );

// ------------------------------------------------------------------------------------------------
// check role

task(
  'proxy-admin-check-role',
  'Renounce role ownership of the admin proxy',
  async (taskArguments, hre: HardhatRuntimeEnvironment) => {
    const { ethers } = hre;
    const adminContractAddress = (taskArguments as any).admincontract;
    const address = (taskArguments as any).address;
    const role = (taskArguments as any).role;

    // build the proxy
    const ProxyAdmin = await ethers.getContractAt(
      'ProxyAdmin',
      adminContractAddress
    );

    // get the role name
    const encodedRole = await getEncodedRoleAdmin(ProxyAdmin, role);

    const hasRole = await ProxyAdmin.hasRole(encodedRole, address);
    console.log(
      `address ${address} has role ${role}: ${JSON.stringify(hasRole)}`
    );
  }
)
  .addParam('admincontract', 'Admin contract address')
  .addParam('address', 'The address to check')
  .addParam(
    'role',
    'Role name: TIMELOCK_ADMIN_ROLE | PROPOSER_ROLE | EXECUTOR_ROLE'
  );

// ------------------------------------------------------------------------------------------------
// support functions

async function getEncodedRoleAdmin(ProxyAdmin: any, role: string) {
  let encodedRole = '';
  switch (role) {
    case 'TIMELOCK_ADMIN_ROLE':
      encodedRole = await ProxyAdmin.TIMELOCK_ADMIN_ROLE();
      break;
    case 'PROPOSER_ROLE':
      encodedRole = await ProxyAdmin.PROPOSER_ROLE();
      break;
    case 'EXECUTOR_ROLE':
      encodedRole = await ProxyAdmin.EXECUTOR_ROLE();
      break;

    default:
      throw `Unknown role: ${role}`;
  }

  return encodedRole;
}

function resolveJobInterfaceABI(asproxy: boolean) {
  if (asproxy) {
    const JobProxy__factory = require('../typechain').JobProxy__factory;
    return JobProxy__factory.abi;
  }

  const Job__factory = require('../typechain').Job__factory;
  return Job__factory.abi;
}
