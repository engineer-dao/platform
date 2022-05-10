import {
  getBalanceOf,
  signers,
  ONE_TOKEN,
  BASE_PERCENT,
  getJobPayouts,
  ONE_HUND_TOKENS,
  resolveDisputeWithCustomSplit,
  STATE_FinalDisputeResolvedWithSplit,
  STATE_DoesntExist,
  deployERC20Token,
  deployDaoTreasury,
  deployJob,
  updatePaymentTokens,
  getAllowedTokens,
} from './lib/testUtil';

const hre = require('hardhat');
import { expect } from 'chai';
import { ethers } from 'hardhat';

import * as testUtil from './lib/testUtil';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { Job, ERC20, DaoTreasury } from '../typechain';

describe('DaoTreasury ', function () {
  let owner: SignerWithAddress,
    resolver: SignerWithAddress,
    supplier: SignerWithAddress,
    engineer: SignerWithAddress,
    reporter: SignerWithAddress,
    addr1: SignerWithAddress,
    addr2: SignerWithAddress;

  let JobContract: Job;
  let TestToken: ERC20;
  let DaoTreasury: DaoTreasury;

  before(async () => {
    await testUtil.setup();

    [owner, resolver, supplier, engineer, reporter, addr1, addr2] =
      await hre.ethers.getSigners();
  });

  beforeEach(async () => {
    // deploy the contract
    const contracts = await testUtil.setupJobAndTokenBalances();

    JobContract = contracts.JobContract;
    TestToken = contracts.TestToken;
    DaoTreasury = contracts.DaoTreasury;
  });

  ///////////////////////////////////////////////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////////////

  describe('An empty DaoTreasury contract', function () {
    it('can set properties', async function () {
      const DaoTreasury = await testUtil.deployDaoTreasury();

      expect(await DaoTreasury.JobContract()).to.equal(
        ethers.constants.AddressZero
      );
      await (await DaoTreasury.setJobContract(JobContract.address)).wait();
      expect(await DaoTreasury.JobContract()).to.equal(JobContract.address);

      expect(await DaoTreasury.stableCoin()).to.equal(
        ethers.constants.AddressZero
      );
      await (await DaoTreasury.setStableCoin(testUtil.USDC_ADDRESS)).wait();
      expect((await DaoTreasury.stableCoin()).toLowerCase()).to.equal(
        testUtil.USDC_ADDRESS
      );

      expect(await DaoTreasury.Router()).to.equal(
        testUtil.QUICK_SWAP_POLY_ADDRESS
      );
      await (await DaoTreasury.setRouter(addr2.address)).wait();
      expect(await DaoTreasury.Router()).to.equal(addr2.address);

      // setters from non-owner should fail
      await expect(
        DaoTreasury.connect(addr2).setJobContract(addr2.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
      await expect(
        DaoTreasury.connect(addr2).setStableCoin(addr2.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
      await expect(
        DaoTreasury.connect(addr2).setRouter(addr2.address)
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    it("can't receive native token", async function () {
      const DaoTreasury = await testUtil.deployDaoTreasury();

      await expect(
        owner.sendTransaction({
          to: DaoTreasury.address,
          value: ethers.utils.parseEther('1.0'),
        })
      ).to.be.revertedWith("Don't lock your MATIC !");
    });
  });

  describe('An DaoTreasury contract with tokens', function () {
    it('can transfer stable coin', async function () {
      const DaoTreasury = await testUtil.deployDaoTreasury();

      // start with TestToken
      await TestToken.transfer(DaoTreasury.address, testUtil.ONE_THOUS_TOKENS);

      // starting balance
      const startingBalance = await getBalanceOf(TestToken, addr1.address);
      expect(startingBalance).to.equal(ethers.utils.parseUnits('1000'));

      // transfer from non-owner should fail
      await expect(
        DaoTreasury.connect(addr2).transfer(
          TestToken.address,
          ethers.utils.parseUnits('500'),
          addr1.address
        )
      ).to.be.revertedWith('Ownable: caller is not the owner');

      // transfer
      await (
        await DaoTreasury.transfer(
          TestToken.address,
          ethers.utils.parseUnits('1000'),
          addr1.address
        )
      ).wait();

      // new balance
      const transferedBalance = await getBalanceOf(TestToken, addr1.address);
      expect(transferedBalance).to.equal(ethers.utils.parseUnits('2000'));

      // transfer again should fail
      await expect(
        DaoTreasury.transfer(
          TestToken.address,
          ethers.utils.parseUnits('1000'),
          addr1.address
        )
      ).to.be.revertedWith('ERC20: transfer amount exceeds balance');
    });
  });

  describe('An DaoTreasury contract with swappable tokens', function () {
    it('can swap to stable coin', async function () {
      const DaoTreasury = await testUtil.deployDaoTreasury();

      // create some stable coins
      const ercTokenDAI = await testUtil.deployERC20Token();
      const ercTokenUSDC = await testUtil.deployERC20Token();

      // create the test router
      const TestRouter = await testUtil.deployTestRouter();
      await (await DaoTreasury.setRouter(TestRouter.address)).wait();
      await ercTokenUSDC.transfer(
        TestRouter.address,
        testUtil.ONE_THOUS_TOKENS
      );

      // start with test DAI in the treasury
      await ercTokenDAI.transfer(
        DaoTreasury.address,
        testUtil.ONE_THOUS_TOKENS
      );

      // set the desired stable coin in the treasury
      await (await DaoTreasury.setStableCoin(ercTokenUSDC.address)).wait();

      // swap
      await DaoTreasury.swapToStable(
        ercTokenDAI.address,
        testUtil.ONE_THOUS_TOKENS,
        '0'
      );

      // check swapped balance of the treasury swapped from DAI to USDC
      const finalDAIBalance = await getBalanceOf(
        ercTokenDAI.address,
        DaoTreasury.address
      );
      expect(finalDAIBalance).to.equal('0');
      const finalUSDCBalance = await getBalanceOf(
        ercTokenUSDC.address,
        DaoTreasury.address
      );

      expect(finalUSDCBalance).to.equal(ethers.utils.parseUnits('1000'));
    });

    it('can swap multiple coins to stable coin', async function () {
      // setup
      const ercTokenDAI = await testUtil.deployERC20Token();
      const ercTokenUSDT = await testUtil.deployERC20Token();
      const ercTokenEMPTY = await testUtil.deployERC20Token();
      const ercTokenUSDC = await testUtil.deployERC20Token();
      const DaoTreasury = await deployDaoTreasury();
      const JobContract = await deployJob(
        ercTokenDAI,
        DaoTreasury,
        resolver.address
      );
      await (await DaoTreasury.setJobContract(JobContract.address)).wait();

      // add another payment tokens
      await JobContract.updatePaymentTokens(ercTokenUSDT.address, true);
      await JobContract.updatePaymentTokens(ercTokenEMPTY.address, true);

      // create the test router
      const TestRouter = await testUtil.deployTestRouter();
      await (await DaoTreasury.setRouter(TestRouter.address)).wait();
      await ercTokenUSDC.transfer(
        TestRouter.address,
        ethers.utils.parseUnits('5000')
      );

      // start with test DAI and USDT in the treasury
      await ercTokenDAI.transfer(
        DaoTreasury.address,
        ethers.utils.parseUnits('1000')
      );
      await ercTokenUSDT.transfer(
        DaoTreasury.address,
        ethers.utils.parseUnits('2000')
      );
      expect(
        await getBalanceOf(ercTokenEMPTY.address, DaoTreasury.address)
      ).to.equal(ethers.utils.parseUnits('0'));
      expect(
        await getBalanceOf(ercTokenDAI.address, DaoTreasury.address)
      ).to.equal(ethers.utils.parseUnits('1000'));
      expect(
        await getBalanceOf(ercTokenUSDT.address, DaoTreasury.address)
      ).to.equal(ethers.utils.parseUnits('2000'));

      // set the desired stable coin
      await (await DaoTreasury.setStableCoin(ercTokenUSDC.address)).wait();

      // swap multiple
      await DaoTreasury.swapAllToStable('0');

      // check swapped balance of the treasury swapped from DAI to USDC
      const finalDAIBalance = await getBalanceOf(
        ercTokenDAI.address,
        DaoTreasury.address
      );
      expect(finalDAIBalance).to.equal('0');
      const finalUSDTBalance = await getBalanceOf(
        ercTokenUSDT.address,
        DaoTreasury.address
      );
      expect(finalUSDTBalance).to.equal('0');
      const finalUSDCBalance = await getBalanceOf(
        ercTokenUSDC.address,
        DaoTreasury.address
      );
      expect(finalUSDCBalance).to.equal(ethers.utils.parseUnits('3000'));
    });
  });
});
