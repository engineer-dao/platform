const hre = require('hardhat');
import { expect } from 'chai';
import { ethers } from 'hardhat';

import * as testUtil from './lib/testUtil';

describe('A test ERC20 token', function () {
  it('can be created', async function () {
    const testToken = await testUtil.deployERC20Token();

    const supply = await testToken.totalSupply();
    expect(supply).to.equal('1000000000000000000000000');

    const ownerSigner = (await testUtil.signers()).owner;
    const ownerBalance = await testToken.balanceOf(ownerSigner.address);
    expect(ownerBalance).to.equal('1000000000000000000000000');
  });
});

describe('A new job', function () {
  it('should have correct variables', async function () {
    // deploy the contract
    const { job } = await testUtil.setupJobAndTokenBalances();

    // start with jobId 0
    expect(await job.jobCount()).to.equal(0);

    const amountSent = testUtil.ONE_HUND_TOKENS;
    await testUtil.postSampleJob(job, amountSent);

    // job id is now one
    expect(await job.jobCount()).to.equal(1);

    // get the job
    const jobOne = await job.jobs(testUtil.JOB_ID_1);

    // check supplier
    const supplierSigner = (await testUtil.signers()).supplier;
    expect(jobOne.supplier).to.equal(supplierSigner.address);

    // check bounty
    expect(jobOne.bounty).to.equal(amountSent);

    // check state
    expect(jobOne.state).to.equal(testUtil.STATE_Available);
  });

  it('requires payment approval', async function () {
    // deploy the contracts
    const testToken = await testUtil.deployERC20Token();
    const job = await testUtil.deployJob(testToken);

    // send balances
    const _signers = await testUtil.signers();
    await testToken.transfer(
      _signers.supplier.address,
      testUtil.ONE_THOUS_TOKENS
    );

    // should revert with no approval
    await expect(testUtil.postSampleJob(job)).to.be.revertedWith(
      'Spending approval is required'
    );
  });

  it('requires a payment', async function () {
    // deploy the contract
    const { job } = await testUtil.setupJobAndTokenBalances();

    // post the job from the supplier address with 0 payment
    // should revert
    const zeroAmount = '0'; // 0 ether
    await expect(testUtil.postSampleJob(job, zeroAmount)).to.be.revertedWith(
      'Minimum payment not provided'
    );

    // post the job from the supplier address with 0.09 payment
    // should revert
    const lowAmount = testUtil.TEN_TOKENS; // $10
    await expect(testUtil.postSampleJob(job, lowAmount)).to.be.revertedWith(
      'Minimum payment not provided'
    );
  });

  it('inreases daoEscrow', async function () {
    const bounty1Amount = '110000000000000000000'; // $110
    const bounty2Amount = '220000000000000000000'; // $220
    const totalExpectedEscrow = '330000000000000000000'; // $330

    const { job } = await testUtil.setupJobAndTokenBalances();

    await testUtil.postSampleJob(job, bounty1Amount);
    const escrowValue = await job.daoEscrow();
    expect(escrowValue).to.equal(bounty1Amount);

    await testUtil.postSampleJob(job, bounty2Amount);
    const secondEscrowValue = await job.daoEscrow();
    expect(secondEscrowValue).to.equal(totalExpectedEscrow);
  });

  it('can be loaded', async function () {
    const bountyAmount = '190000000000000000000'; // $190
    const { job } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job, bountyAmount);

    // load the job from the blockchain
    const supplierSigner = (await testUtil.signers()).supplier;
    const jobData = await job.jobs(testUtil.JOB_ID_1);
    expect(jobData.supplier).to.equal(supplierSigner.address);
    expect(jobData.bounty).to.equal(bountyAmount);
  });

  it('emits JobPosted event', async function () {
    const { job } = await testUtil.setupJobAndTokenBalances();

    await expect(testUtil.postSampleJob(job))
      .to.emit(job, 'JobPosted')
      .withArgs(testUtil.JOB_ID_1, JSON.stringify(testUtil.defaultJobMetaData));
  });

  it('emits JobSupplied event', async function () {
    const { job } = await testUtil.setupJobAndTokenBalances();

    const supplierSigner = (await testUtil.signers()).supplier;
    await expect(testUtil.postSampleJob(job))
      .to.emit(job, 'JobSupplied')
      .withArgs(supplierSigner.address, testUtil.JOB_ID_1);
  });

  it('can be posted multiple times', async function () {
    // get the senders
    const _signers = await testUtil.signers();

    // deploy the contract
    const { job } = await testUtil.setupJobAndTokenBalances();

    // post three jobs
    await testUtil.postSampleJob(job);
    await testUtil.postSampleJob(job, null, null, _signers.other2);
    await testUtil.postSampleJob(job, null, null, _signers.other3);

    // job id is now three
    expect(await job.jobCount()).to.equal(3);

    // get the jobs
    const jobOne = await job.jobs(testUtil.JOB_ID_1);
    const jobTwo = await job.jobs(testUtil.JOB_ID_2);
    const jobThree = await job.jobs(testUtil.JOB_ID_3);

    expect(jobOne.supplier).to.equal(_signers.supplier.address);
    expect(jobTwo.supplier).to.equal(_signers.other2.address);
    expect(jobThree.supplier).to.equal(_signers.other3.address);
  });
});

describe('A job to be accepted', function () {
  it('can be accepted', async function () {
    const _signers = await testUtil.signers();

    const { job } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    await testUtil.startJob(job, testUtil.JOB_ID_1);

    // get jobData
    const jobData = await job.jobs(testUtil.JOB_ID_1);

    // check engineer
    expect(jobData.engineer).to.equal(_signers.engineer.address);

    // check deposit
    expect(jobData.deposit).to.equal(testUtil.TEN_TOKENS);

    // check startTime
    const blockTimestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    expect(jobData.startTime).to.equal(blockTimestamp);

    // check state
    expect(jobData.state).to.equal(testUtil.STATE_Started);
  });

  it('must have a 10% deposit', async function () {
    const { job } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    await expect(
      testUtil.startJob(job, testUtil.JOB_ID_1, testUtil.ONE_TOKEN)
    ).to.be.revertedWith('Minimum payment not provided');

    await expect(
      testUtil.startJob(job, testUtil.JOB_ID_1, '0')
    ).to.be.revertedWith('Minimum payment not provided');
  });

  it('must be in Available state', async function () {
    const { job } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    // start job once successfully
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    // can't start again
    await expect(testUtil.startJob(job, testUtil.JOB_ID_1)).to.be.revertedWith(
      'Method not available for job state'
    );
  });

  it('must have an engineer that is not the supplier', async function () {
    const { job } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    // supplier can't start job
    const supplierSigner = (await testUtil.signers()).supplier;
    await expect(
      testUtil.startJob(job, testUtil.JOB_ID_1, null, supplierSigner)
    ).to.be.revertedWith('Address may not be job poster');
  });

  it('increases dao escrow when accepting the job', async function () {
    const { job } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    const secondEscrowValue = await job.daoEscrow();
    expect(secondEscrowValue).to.equal(testUtil.ONE_HUND_TEN_TOKENS);
  });
});

describe('A cancellable job', function () {
  it('may be cancelled', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.cancelJob(job, testUtil.JOB_ID_1);

    // dao escrow is now zero
    const escrowValue = await job.daoEscrow();
    expect(escrowValue).to.equal(0);

    // dao balance is now zero
    expect(await testToken.balanceOf(job.address)).to.equal(0);

    // supplier was refunded
    expect(await testToken.balanceOf(_signers.supplier.address)).to.equal(
      testUtil.ONE_THOUS_TOKENS
    );

    // get the job
    const jobOne = await job.jobs(testUtil.JOB_ID_1);

    // check state
    expect(jobOne.state).to.equal(testUtil.STATE_FinalCanceledBySupplier);
  });

  it('may only be cancelled when in the available state', async function () {
    const { job } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    await testUtil.startJob(job, testUtil.JOB_ID_1);

    // trying to cancel an accepted job reverts
    await expect(testUtil.cancelJob(job, testUtil.JOB_ID_1)).to.be.revertedWith(
      'Method not available for job state'
    );
  });

  it('may only be cancelled by the supplier', async function () {
    const { job } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    // trying to cancel by other address reverts
    const otherSigner = (await testUtil.signers()).other;
    await expect(
      testUtil.cancelJob(job, testUtil.JOB_ID_1, otherSigner)
    ).to.be.revertedWith('Method not available for this caller');
  });

  it('emits JobCanceled event', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    await expect(testUtil.cancelJob(job, testUtil.JOB_ID_1))
      .to.emit(job, 'JobCanceled')
      .withArgs(testUtil.JOB_ID_1);
  });
});

describe('A completable job', function () {
  it('may be completed', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.completeJob(job, testUtil.JOB_ID_1);

    // get the job
    const jobOne = await job.jobs(testUtil.JOB_ID_1);

    // check state
    expect(jobOne.state).to.equal(testUtil.STATE_Completed);
  });

  it('requires started state', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    await expect(
      testUtil.completeJob(job, testUtil.JOB_ID_1)
    ).to.be.revertedWith('Method not available for job state');
  });

  it('may only be called by engineer', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    await expect(
      testUtil.completeJob(job, testUtil.JOB_ID_1, _signers.supplier)
    ).to.be.revertedWith('Method not available for this caller');

    await expect(
      testUtil.completeJob(job, testUtil.JOB_ID_1, _signers.other)
    ).to.be.revertedWith('Method not available for this caller');
  });

  it('emits JobCompleted event', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    await expect(testUtil.completeJob(job, testUtil.JOB_ID_1))
      .to.emit(job, 'JobCompleted')
      .withArgs(testUtil.JOB_ID_1);
  });
});

describe('An approvable job', function () {
  it('may be approved', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.completeJob(job, testUtil.JOB_ID_1);
    await testUtil.approveJob(job, testUtil.JOB_ID_1);

    // get the job
    const jobOne = await job.jobs(testUtil.JOB_ID_1);

    // check state
    expect(jobOne.state).to.equal(testUtil.STATE_FinalApproved);

    // updates escrow
    const escrowValue = await job.daoEscrow();
    expect(escrowValue).to.equal(0);

    // updates funds
    const fundsValue = await job.daoFunds();
    expect(fundsValue).to.equal(testUtil.TEN_TOKENS);
  });

  it('requires completed state', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    await expect(
      testUtil.approveJob(job, testUtil.JOB_ID_1)
    ).to.be.revertedWith('Method not available for job state');
  });

  it('may only be called by supplier', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.completeJob(job, testUtil.JOB_ID_1);

    await expect(
      testUtil.approveJob(job, testUtil.JOB_ID_1, _signers.engineer)
    ).to.be.revertedWith('Method not available for this caller');

    await expect(
      testUtil.approveJob(job, testUtil.JOB_ID_1, _signers.other)
    ).to.be.revertedWith('Method not available for this caller');
  });

  it('emits JobApproved event', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.completeJob(job, testUtil.JOB_ID_1);

    // $100 - $10 + $10 = $100
    const expectedPayoutAmount = testUtil.ONE_HUND_TOKENS;

    await expect(testUtil.approveJob(job, testUtil.JOB_ID_1))
      .to.emit(job, 'JobApproved')
      .withArgs(testUtil.JOB_ID_1, expectedPayoutAmount);
  });

  it('sends bounty to engineer', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.completeJob(job, testUtil.JOB_ID_1);
    await testUtil.approveJob(job, testUtil.JOB_ID_1);

    const engineerBalance = await testToken.balanceOf(
      _signers.engineer.address
    );
    expect(engineerBalance).to.equal(testUtil.ONE_THOUS_NINETY_TOKENS);

    const supplierBalance = await testToken.balanceOf(
      _signers.supplier.address
    );
    expect(supplierBalance).to.equal('900000000000000000000');
  });
});

describe('A closeable job', function () {
  it('may be closed', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.closeBySupplier(job, testUtil.JOB_ID_1);
    await testUtil.closeByEngineer(job, testUtil.JOB_ID_1);

    // get the job
    const jobOne = await job.jobs(testUtil.JOB_ID_1);

    // check state
    expect(jobOne.state).to.equal(testUtil.STATE_FinalMutualClose);

    // updates escrow
    const escrowValue = await job.daoEscrow();
    expect(escrowValue).to.equal(0);

    // updates funds
    const fundsValue = await job.daoFunds();
    expect(fundsValue).to.equal(0);
  });

  it('requires started state', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    await expect(
      testUtil.closeBySupplier(job, testUtil.JOB_ID_1)
    ).to.be.revertedWith('Method not available for job state');

    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.completeJob(job, testUtil.JOB_ID_1);

    await expect(
      testUtil.closeBySupplier(job, testUtil.JOB_ID_1)
    ).to.be.revertedWith('Method not available for job state');

    await expect(
      testUtil.closeByEngineer(job, testUtil.JOB_ID_1)
    ).to.be.revertedWith('Method not available for job state');
  });

  it('may only be called by engineer or supplier', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    await expect(
      testUtil.closeJob(job, testUtil.JOB_ID_1, _signers.other)
    ).to.be.revertedWith('Method not available for this caller');

    await expect(
      testUtil.closeJob(job, testUtil.JOB_ID_1, _signers.other2)
    ).to.be.revertedWith('Method not available for this caller');
  });

  it('may only be called by supplier once', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.closeBySupplier(job, testUtil.JOB_ID_1);

    await expect(
      testUtil.closeBySupplier(job, testUtil.JOB_ID_1)
    ).to.be.revertedWith('Close request already received');
  });

  it('may only be called by engineer once', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);
    await testUtil.closeByEngineer(job, testUtil.JOB_ID_1);

    await expect(
      testUtil.closeByEngineer(job, testUtil.JOB_ID_1)
    ).to.be.revertedWith('Close request already received');
  });

  it('emits JobClosed event when closed by engineer', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    await testUtil.closeBySupplier(job, testUtil.JOB_ID_1);

    await expect(testUtil.closeByEngineer(job, testUtil.JOB_ID_1))
      .to.emit(job, 'JobClosed')
      .withArgs(testUtil.JOB_ID_1);
  });

  it('emits JobClosedBySupplier and JobClosedByEngineer events when closed', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    await expect(testUtil.closeBySupplier(job, testUtil.JOB_ID_1))
      .to.emit(job, 'JobClosedBySupplier')
      .withArgs(testUtil.JOB_ID_1);

    await expect(testUtil.closeByEngineer(job, testUtil.JOB_ID_1))
      .to.emit(job, 'JobClosedByEngineer')
      .withArgs(testUtil.JOB_ID_1);
  });

  it('emits JobClosed event when closed by supplier', async function () {
    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);
    await testUtil.startJob(job, testUtil.JOB_ID_1);

    await testUtil.closeByEngineer(job, testUtil.JOB_ID_1);

    await expect(testUtil.closeBySupplier(job, testUtil.JOB_ID_1))
      .to.emit(job, 'JobClosed')
      .withArgs(testUtil.JOB_ID_1);
  });

  it('refunds bounty and deposit when closed', async function () {
    const _signers = await testUtil.signers();

    const { job, testToken } = await testUtil.setupJobAndTokenBalances();
    await testUtil.postSampleJob(job);

    const startingSupplierBalance = await testToken.balanceOf(
      _signers.supplier.address
    );
    expect(startingSupplierBalance).to.equal('900000000000000000000');

    await testUtil.startJob(job, testUtil.JOB_ID_1);

    const startingEngineerBalance = await testToken.balanceOf(
      _signers.engineer.address
    );
    expect(startingEngineerBalance).to.equal('990000000000000000000');

    await testUtil.closeBySupplier(job, testUtil.JOB_ID_1);
    await testUtil.closeByEngineer(job, testUtil.JOB_ID_1);

    const engineerBalance = await testToken.balanceOf(
      _signers.engineer.address
    );
    expect(engineerBalance).to.equal(testUtil.ONE_THOUS_TOKENS);

    const supplierBalance = await testToken.balanceOf(
      _signers.supplier.address
    );
    expect(supplierBalance).to.equal(testUtil.ONE_THOUS_TOKENS);
  });
});
