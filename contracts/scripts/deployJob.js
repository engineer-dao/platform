async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  console.log('Account balance:', (await deployer.getBalance()).toString());

  const JobContract = await ethers.getContractFactory('Job');
  const token = await JobContract.deploy(
    '0xD1fB3b55b835C16998EB931b55350703fE9087bB'
  );

  console.log('Job contract address:', token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
