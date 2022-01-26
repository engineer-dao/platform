const hre = require('hardhat');
import { expect } from 'chai';
import { ethers } from 'hardhat';

import * as jobUtil from './lib/jobUtil';

// 1 ETH = 1000000000000000000 wei

const STATE_Available = 1;
const STATE_Started = 2;

describe('Create a new job', function () {
  it('A new job should have correct variables', async function () {
    // get the senders
    const [ownerSigner, supplierSigner, engineerSigner, otherSigner] =
      await ethers.getSigners();

    // deploy the contract
    const job = await jobUtil.deployJob();

    // start with jobId 0
    expect(await job.jobCount()).to.equal(0);

    const amountSent = jobUtil.ONE_ETH;
    await jobUtil.postSampleJob(job, amountSent);

    // job id is now one
    expect(await job.jobCount()).to.equal(1);

    // get the job
    const jobOne = await job.jobs(jobUtil.JOB_ID_1);

    // check postTime
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const blockTimestamp = blockBefore.timestamp;
    expect(jobOne.postTime).to.equal(blockTimestamp);

    // check supplier
    expect(jobOne.supplier).to.equal(supplierSigner.address);

    // check bounty
    expect(jobOne.bounty).to.equal(amountSent);

    // check state
    expect(jobOne.state).to.equal(STATE_Available);
  });

  it('A new job requires a payment', async function () {
    // get the senders
    const [ownerSigner, supplierSigner, engineerSigner, otherSigner] =
      await ethers.getSigners();

    // deploy the contract
    const job = await jobUtil.deployJob();

    // post the job from the supplier address with 0 payment
    // should revert
    const zeroAmount = '0'; // 0 ether
    await expect(jobUtil.postSampleJob(job, zeroAmount)).to.be.revertedWith(
      'Minimum payment not provided'
    );

    // post the job from the supplier address with 0.09 payment
    // should revert
    const lowAmount = '90000000000000000'; // .09 ether
    await expect(jobUtil.postSampleJob(job, lowAmount)).to.be.revertedWith(
      'Minimum payment not provided'
    );
  });

  it('daoEscrow increases', async function () {
    const bounty1Amount = '110000000000000000'; // .11 ether
    const bounty2Amount = '220000000000000000'; // .22 ether
    const totalExpectedEscrow = '330000000000000000'; // .33 ether

    const job = await jobUtil.deployAndPostJob(bounty1Amount);
    const escrowValue = await job.daoEscrow();
    expect(escrowValue).to.equal(bounty1Amount);

    await jobUtil.postSampleJob(job, bounty2Amount);
    const secondEscrowValue = await job.daoEscrow();
    expect(secondEscrowValue).to.equal(totalExpectedEscrow);
  });

  it('A new job can be loaded', async function () {
    const bountyAmount = '190000000000000000'; // .19 ether
    const job = await jobUtil.deployAndPostJob(bountyAmount);

    // load the job from the blockchain
    const [ownerSigner, supplierSigner, engineerSigner, otherSigner] =
      await ethers.getSigners();

    const jobData = await job.jobs(jobUtil.JOB_ID_1);
    expect(jobData.supplier).to.equal(supplierSigner.address);
    expect(jobData.bounty).to.equal(bountyAmount);
  });

  it('Emits JobPosted event', async function () {
    const job = await jobUtil.deployJob();

    await expect(jobUtil.postSampleJob(job))
      .to.emit(job, 'JobPosted')
      .withArgs(jobUtil.JOB_ID_1, JSON.stringify(jobUtil.defaultJobMetaData));
  });

  it('Emits JobSupplied event', async function () {
    const [ownerSigner, supplierSigner] = await ethers.getSigners();

    const job = await jobUtil.deployJob();

    await expect(jobUtil.postSampleJob(job))
      .to.emit(job, 'JobSupplied')
      .withArgs(supplierSigner.address, jobUtil.JOB_ID_1);
  });

  it('Multiple jobs can be posted', async function () {
    // get the senders
    const [
      ownerSigner,
      supplierSigner,
      engineerSigner,
      secondSigner,
      thirdSigner,
    ] = await ethers.getSigners();

    // deploy the contract
    const job = await jobUtil.deployJob();

    // post three jobs
    await jobUtil.postSampleJob(job);
    await jobUtil.postSampleJob(job, null, null, secondSigner);
    await jobUtil.postSampleJob(job, null, null, thirdSigner);

    // job id is now three
    expect(await job.jobCount()).to.equal(3);

    // get the jobs
    const jobOne = await job.jobs(jobUtil.JOB_ID_1);
    const jobTwo = await job.jobs(jobUtil.JOB_ID_2);
    const jobThree = await job.jobs(jobUtil.JOB_ID_3);

    expect(jobOne.supplier).to.equal(supplierSigner.address);
    expect(jobTwo.supplier).to.equal(secondSigner.address);
    expect(jobThree.supplier).to.equal(thirdSigner.address);
  });
});

describe('Accepting a job', function () {
  it('Job can be accepted', async function () {
    const [ownerSigner, supplierSigner, engineerSigner, otherSigner] =
      await ethers.getSigners();

    const job = await jobUtil.deployJob();
    await jobUtil.postSampleJob(job);

    await jobUtil.startJob(job, jobUtil.JOB_ID_1);

    // get jobData
    const jobData = await job.jobs(jobUtil.JOB_ID_1);

    // check engineer
    expect(jobData.engineer).to.equal(engineerSigner.address);

    // check buyIn
    expect(jobData.buyIn).to.equal(jobUtil.ONE_TENTH_ETH);

    // check startTime
    const blockTimestamp = (
      await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
    ).timestamp;
    expect(jobData.startTime).to.equal(blockTimestamp);

    // check state
    expect(jobData.state).to.equal(STATE_Started);
  });

  it('Job buy-in must be 10% of bounty', async function () {
    const [ownerSigner, supplierSigner, engineerSigner, otherSigner] =
      await ethers.getSigners();

    const job = await jobUtil.deployJob();
    await jobUtil.postSampleJob(job);

    await expect(
      jobUtil.startJob(job, jobUtil.JOB_ID_1, jobUtil.POINT_ZERO_NINE_ETH)
    ).to.be.revertedWith('Minimum payment not provided');

    await expect(
      jobUtil.startJob(job, jobUtil.JOB_ID_1, '0')
    ).to.be.revertedWith('Minimum payment not provided');
  });

  it('Job must be in Available state', async function () {
    const job = await jobUtil.deployJob();
    await jobUtil.postSampleJob(job);

    // start job once successfully
    await jobUtil.startJob(job, jobUtil.JOB_ID_1);

    // can't start again
    await expect(jobUtil.startJob(job, jobUtil.JOB_ID_1)).to.be.revertedWith(
      'Method not available for this job'
    );
  });

  it('engineer must not be supplier', async function () {
    const [ownerSigner, supplierSigner, engineerSigner, otherSigner] =
      await ethers.getSigners();

    const job = await jobUtil.deployJob();
    await jobUtil.postSampleJob(job);

    // supplier can't start job
    await expect(
      jobUtil.startJob(job, jobUtil.JOB_ID_1, null, supplierSigner)
    ).to.be.revertedWith('Address may not be job poster');
  });

  it('accepting job increases dao escrow', async function () {
    const job = await jobUtil.deployJob();
    await jobUtil.postSampleJob(job);
    await jobUtil.startJob(job, jobUtil.JOB_ID_1);

    const secondEscrowValue = await job.daoEscrow();
    expect(secondEscrowValue).to.equal(jobUtil.ONE_POINT_ONE_ETH);
  });
});
