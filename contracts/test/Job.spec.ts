import { getBalanceOf, signers, ONE_TOKEN, BASE_PERCENT } from "./lib/testUtil";

const hre = require('hardhat');
import { expect } from 'chai';
import { ethers } from 'hardhat';

import * as testUtil from './lib/testUtil';
import { Signer } from "ethers";

describe('A test ERC20 token', function() {
    it('can be created', async function() {
        const testToken = await testUtil.deployERC20Token();

        const supply = await testToken.totalSupply();
        expect(supply).to.equal(testUtil.toBigNum(1000000));

        const ownerSigner = (await testUtil.signers()).owner;
        const ownerBalance = await testToken.balanceOf(ownerSigner.address);
        expect(ownerBalance).to.equal(testUtil.toBigNum(1000000));
    });
});

describe("JobContract ", function() {
///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A new job', function() {
        let owner, supplier, engineer, addr1, addr2, addr3: Signer
        before(async () => {
            [owner, supplier, engineer, addr1, addr2, addr3] =
                await hre.ethers.getSigners();
        })

        it('should have correct variables', async function() {
            // deploy the contract
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            // jobId 0
            expect(await JobContract.jobCount()).to.equal(0);

            const amountSent = testUtil.ONE_HUND_TOKENS;
            await testUtil.postSampleJob()(JobContract, TestToken, amountSent);

            // jobId 1
            expect(await JobContract.jobCount()).to.equal(1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check supplier
            const supplierSigner = (await testUtil.signers()).supplier;
            expect(jobOne.supplier).to.equal(supplierSigner.address);

            // check bounty
            expect(jobOne.bounty).to.equal(amountSent);

            // check bounty
            expect(jobOne.depositPct).to.equal(testUtil.DEFAULT_DEPOSIT_PCT);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_Available);
        });

        it('should have correct depositPct', async function() {
            // deploy the contract
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            // jobId 0
            expect(await JobContract.jobCount()).to.equal(0);

            const amountSent = testUtil.ONE_HUND_TOKENS;
            const depositPct = 4200;
            await testUtil.postSampleJob()(JobContract, TestToken, amountSent, depositPct);

            // jobId 1
            expect(await JobContract.jobCount()).to.equal(1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check bounty
            expect(jobOne.depositPct).to.equal(depositPct);
        });

        it('requires payment approval', async function() {
            // deploy the contracts
            const TestToken = await testUtil.deployERC20Token();
            const Job = await testUtil.deployJob(TestToken);

            // send balances
            const _signers = await testUtil.signers();
            await TestToken.transfer(
                _signers.supplier.address,
                testUtil.ONE_THOUS_TOKENS
            );

            // should revert with no approval
            await expect(testUtil.postSampleJob()(Job, TestToken)).to.be.revertedWith(
                'Spending approval is required'
            );
        });

        it('requires a payment', async function() {
            // deploy the contract
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            // post the job from the supplier address with 0 payment
            // should revert
            const zeroAmount = '0'; // 0 ether
            await expect(testUtil.postSampleJob()(JobContract, TestToken, zeroAmount)).to.be.revertedWith(
                'Minimum bounty not provided'
            );

            // post the job from the supplier address with 0.09 payment
            // should revert
            const lowAmount = testUtil.TEN_TOKENS; // $10
            await expect(testUtil.postSampleJob()(JobContract, TestToken, lowAmount)).to.be.revertedWith(
                'Minimum bounty not provided'
            );
        });

        it('inreases daoEscrow', async function() {
            const bounty1Amount = testUtil.toBigNum(110); // $110
            const bounty2Amount = testUtil.toBigNum(220); // $220
            const totalExpectedEscrow = testUtil.toBigNum(330); // $330

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            await testUtil.postSampleJob()(JobContract, TestToken, bounty1Amount);
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(bounty1Amount);

            await testUtil.postSampleJob()(JobContract, TestToken, bounty2Amount);
            const secondEscrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(secondEscrowValue).to.equal(totalExpectedEscrow);
        });

        it('can be loaded', async function() {
            const bountyAmount = testUtil.toBigNum(190); // $190
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken, bountyAmount);

            // load the job from the blockchain
            const supplierSigner = (await testUtil.signers()).supplier;
            const jobData = await JobContract.jobs(testUtil.JOB_ID_1);
            expect(jobData.supplier).to.equal(supplierSigner.address);
            expect(jobData.bounty).to.equal(bountyAmount);
        });

        it('emits JobPosted event when posted', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            await expect(testUtil.postSampleJob()(JobContract, TestToken))
                .to.emit(JobContract, 'JobPosted')
                .withArgs(testUtil.JOB_ID_1, JSON.stringify(testUtil.defaultJobMetaData));
        });

        it('emits JobSupplied event when posted', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            const supplierSigner = (await testUtil.signers()).supplier;
            await expect(testUtil.postSampleJob()(JobContract, TestToken))
                .to.emit(JobContract, 'JobSupplied')
                .withArgs(supplierSigner.address, testUtil.JOB_ID_1);
        });

        it('can be posted multiple times', async function() {
            // get the senders
            const _signers = await testUtil.signers();

            // deploy the contract
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            // post three jobs
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.postSampleJob(_signers.addr2)(JobContract, TestToken);
            await testUtil.postSampleJob(_signers.addr3)(JobContract, TestToken);

            // job id is now three
            expect(await JobContract.jobCount()).to.equal(3);

            // get the jobs
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);
            const jobTwo = await JobContract.jobs(testUtil.JOB_ID_2);
            const jobThree = await JobContract.jobs(testUtil.JOB_ID_3);

            expect(jobOne.supplier).to.equal(_signers.supplier.address);
            expect(jobTwo.supplier).to.equal(_signers.addr2.address);
            expect(jobThree.supplier).to.equal(_signers.addr3.address);
        });

        it('can be posted multiple times by same signer', async function() {
            // get the senders
            const _signers = await testUtil.signers();

            // deploy the contract
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            // post three jobs
            await testUtil.postSampleJob(_signers.addr1)(JobContract, TestToken);
            await testUtil.postSampleJob(_signers.addr1)(JobContract, TestToken);
            await testUtil.postSampleJob(_signers.addr1)(JobContract, TestToken);

            // job id is now three
            expect(await JobContract.jobCount()).to.equal(3);

            // get the jobs
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);
            const jobTwo = await JobContract.jobs(testUtil.JOB_ID_2);
            const jobThree = await JobContract.jobs(testUtil.JOB_ID_3);

            expect(jobOne.supplier).to.equal(_signers.addr1.address);
            expect(jobTwo.supplier).to.equal(_signers.addr1.address);
            expect(jobThree.supplier).to.equal(_signers.addr1.address);
        });

        it('should revert if posting with more than min deposit percent', async function() {
            // deploy the contract
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();

            // jobId 0
            expect(await JobContract.jobCount()).to.equal(0);

            const amountSent = testUtil.ONE_HUND_THOUS_TOKENS;

            await expect(
                testUtil.postSampleJob()(JobContract, TestToken, amountSent, BASE_PERCENT + 1)
            ).to.be.revertedWith('Deposit percent is too high');
        });

        it('should revert if jobMetaData is not a valid ipfs hash', async function() {
            // TODO:
        });

    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A job to be accepted', function() {
        it('can be accepted', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            // get jobData
            const jobData = await JobContract.jobs(testUtil.JOB_ID_1);

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

        it('must have a 10% deposit', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, testUtil.ONE_TOKEN)
            ).to.be.revertedWith('Minimum payment not provided');

            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, '0')
            ).to.be.revertedWith('Minimum payment not provided');
        });

        it('must be in Available state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            // start job once successfully
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            // can't start again
            await expect(testUtil.startJob(JobContract, testUtil.JOB_ID_1)).to.be.revertedWith(
                'Method not available for job state'
            );
        });

        it('must have an engineer that is not the supplier', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            // supplier can't start job
            const supplierSigner = (await testUtil.signers()).supplier;
            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, null, supplierSigner)
            ).to.be.revertedWith('Address may not be job poster');
        });

        it('increases dao escrow when accepting the job', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            const secondEscrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(secondEscrowValue).to.equal(testUtil.toBigNum(110));
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A cancellable job', function() {
        it('may be canceled', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.cancelJob(JobContract, testUtil.JOB_ID_1);

            // dao escrow is now zero
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // dao balance is now zero
            expect(await TestToken.balanceOf(JobContract.address)).to.equal(0);

            // supplier was refunded
            expect(await TestToken.balanceOf(_signers.supplier.address)).to.equal(
                testUtil.ONE_THOUS_TOKENS
            );

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_FinalCanceledBySupplier);
        });

        it('may only be canceled when in the available state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            // trying to cancel an accepted job reverts
            await expect(testUtil.cancelJob(JobContract, testUtil.JOB_ID_1)).to.be.revertedWith(
                'Method not available for job state'
            );
        });

        it('may only be canceled by the supplier', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            // trying to cancel by other address reverts
            const otherSigner = (await testUtil.signers()).addr1;
            await expect(
                testUtil.cancelJob(JobContract, testUtil.JOB_ID_1, otherSigner)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobCanceled event when canceled', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(testUtil.cancelJob(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobCanceled')
                .withArgs(testUtil.JOB_ID_1);
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A completable job', function() {
        it('may be completed', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_Completed);
        });

        it('requires started state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.completeJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by engineer', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.completeJob(JobContract, testUtil.JOB_ID_1, _signers.supplier)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.completeJob(JobContract, testUtil.JOB_ID_1, _signers.addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobCompleted event when completed', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.completeJob(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobCompleted')
                .withArgs(testUtil.JOB_ID_1);
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('An approvable job', function() {
        it('may be approved', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_FinalApproved);

            // updates escrow
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // updates funds
            const fundsValue = await getBalanceOf(TestToken, JobContract.address);
            expect(fundsValue).to.equal(testUtil.TEN_TOKENS);
        });

        it('requires completed state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.approveJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by supplier', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.approveJob(JobContract, testUtil.JOB_ID_1, _signers.engineer)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.approveJob(JobContract, testUtil.JOB_ID_1, _signers.addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobApproved event when approved', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // $100 - $10 + $10 = $100
            const expectedPayoutAmount = testUtil.ONE_HUND_TOKENS;

            await expect(testUtil.approveJob(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobApproved')
                .withArgs(testUtil.JOB_ID_1, expectedPayoutAmount);
        });

        it('sends bounty and deposit to engineer', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);

            const engineerBalance = await TestToken.balanceOf(
                _signers.engineer.address
            );
            expect(engineerBalance).to.equal(testUtil.toBigNum(1090));

            const supplierBalance = await TestToken.balanceOf(
                _signers.supplier.address
            );
            expect(supplierBalance).to.equal(testUtil.toBigNum(900));
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A closeable job', function() {
        it('may be closed', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_FinalMutualClose);

            // updates escrow
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // updates funds
            const fundsValue = await getBalanceOf(TestToken, JobContract.address);
            expect(fundsValue).to.equal(0);
        });

        it('requires started state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await expect(
                testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by engineer or supplier', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.closeJob(JobContract, testUtil.JOB_ID_1, _signers.addr1)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.closeJob(JobContract, testUtil.JOB_ID_1, _signers.addr2)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('may only be called by supplier once', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Close request already received');
        });

        it('may only be called by engineer once', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Close request already received');
        });

        it('emits JobClosed event when closed by engineer', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobClosed')
                .withArgs(testUtil.JOB_ID_1);
        });

        it('emits JobClosedBySupplier and JobClosedByEngineer events when closed', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobClosedBySupplier')
                .withArgs(testUtil.JOB_ID_1);

            await expect(testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobClosedByEngineer')
                .withArgs(testUtil.JOB_ID_1);
        });

        it('emits JobClosed event when closed by supplier', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobClosed')
                .withArgs(testUtil.JOB_ID_1);
        });

        it('refunds bounty and deposit when closed', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            const startingSupplierBalance = await TestToken.balanceOf(
                _signers.supplier.address
            );
            expect(startingSupplierBalance).to.equal(testUtil.toBigNum(900));

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            const startingEngineerBalance = await TestToken.balanceOf(
                _signers.engineer.address
            );
            expect(startingEngineerBalance).to.equal(testUtil.toBigNum(990));

            await testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1);

            const engineerBalance = await TestToken.balanceOf(
                _signers.engineer.address
            );
            expect(engineerBalance).to.equal(testUtil.ONE_THOUS_TOKENS);

            const supplierBalance = await TestToken.balanceOf(
                _signers.supplier.address
            );
            expect(supplierBalance).to.equal(testUtil.ONE_THOUS_TOKENS);
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A timed-out job', function() {
        it('may be finalized', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            await hre.timeAndMine.setTimeIncrease(432001);

            await testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_FinalNoResponse);

            // updates escrow
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // updates funds
            const fundsValue = await getBalanceOf(TestToken, JobContract.address);
            expect(fundsValue).to.equal(testUtil.TEN_TOKENS);
        });

        it('requires completed state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('requires time to pass', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Job still in approval time window');
        });

        it('may only be called by engineer', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            await hre.timeAndMine.setTimeIncrease(432001);

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1, _signers.supplier)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1, _signers.addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobTimeoutPayout event when timed out', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            await hre.timeAndMine.setTimeIncrease(432001);

            const expectedPayoutAmount = testUtil.ONE_HUND_TOKENS;
            await expect(testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobTimeoutPayout')
                .withArgs(testUtil.JOB_ID_1, expectedPayoutAmount);
        });

        it('sends bounty and deposit to engineer', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            await hre.timeAndMine.setTimeIncrease(432001);

            await testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1);

            const engineerBalance = await TestToken.balanceOf(
                _signers.engineer.address
            );
            expect(engineerBalance).to.equal(testUtil.toBigNum(1090));

            const supplierBalance = await TestToken.balanceOf(
                _signers.supplier.address
            );
            expect(supplierBalance).to.equal(testUtil.toBigNum(900));
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A disputable job', function() {
        it('may be disputed when started', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_Disputed);
        });

        it('may be disputed when completed', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_Disputed);
        });

        it('requires started or completed state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.disputeJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.disputeJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by supplier', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.disputeJob(JobContract, testUtil.JOB_ID_1, _signers.engineer)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.disputeJob(JobContract, testUtil.JOB_ID_1, _signers.addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobDisputed event when disputed', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.disputeJob(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobDisputed')
                .withArgs(testUtil.JOB_ID_1);
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A disputed job that will be resolved for the supplier', function() {
        it('may be resolved for supplier', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(
                testUtil.STATE_FinalDisputeResolvedForSupplier
            );
        });

        it('requires disputed state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by owner', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForSupplier(
                    JobContract,
                    testUtil.JOB_ID_1,
                    _signers.supplier
                )
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.resolveDisputeForSupplier(
                    JobContract,
                    testUtil.JOB_ID_1,
                    _signers.engineer
                )
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1, _signers.addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobDisputeResolved event when resolved', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobDisputeResolved')
                .withArgs(
                    testUtil.JOB_ID_1,
                    testUtil.STATE_FinalDisputeResolvedForSupplier
                );
        });

        it('sends funds and updates balances when resolved', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1);

            // updates escrow
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // updates funds
            const fundsValue = await getBalanceOf(TestToken, JobContract.address);
            expect(fundsValue).to.equal(testUtil.toBigNum(6.6));

            // sends funds to supplier
            expect(await TestToken.balanceOf(_signers.supplier.address)).to.equal(
                testUtil.toBigNum(1000 + 103.4 - 100)
            );

            // check engineer funds
            expect(await TestToken.balanceOf(_signers.engineer.address)).to.equal(
                testUtil.toBigNum(1000 - 10)
            );
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

    describe('A disputed job that will be resolved for the engineer', function() {
        it('may be resolved for engineer', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(
                testUtil.STATE_FinalDisputeResolvedForEngineer
            );
        });

        it('requires disputed state', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by owner', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForEngineer(
                    JobContract,
                    testUtil.JOB_ID_1,
                    _signers.supplier
                )
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.resolveDisputeForEngineer(
                    JobContract,
                    testUtil.JOB_ID_1,
                    _signers.engineer
                )
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1, _signers.addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobDisputeResolved event when resolved', async function() {
            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobDisputeResolved')
                .withArgs(
                    testUtil.JOB_ID_1,
                    testUtil.STATE_FinalDisputeResolvedForEngineer
                );
        });

        it('sends funds and updates balances when resolved', async function() {
            const _signers = await testUtil.signers();

            const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1);

            // updates escrow
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // updates funds
            const fundsValue = await getBalanceOf(TestToken, JobContract.address);
            expect(fundsValue).to.equal(testUtil.toBigNum(6.6));

            // sends funds to engineer
            expect(await TestToken.balanceOf(_signers.engineer.address)).to.equal(
                testUtil.toBigNum(1000 - 10 + 103.4)
            );

            // check supplier funds
            expect(await TestToken.balanceOf(_signers.supplier.address)).to.equal(
                testUtil.toBigNum(1000 - 100)
            );
        });
    });

///////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

// describe('DAO Funds', function() {
//     it('may be withdrawn', async function() {
//         const _signers = await testUtil.signers();
//
//         const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
//         await testUtil.postSampleJob()(JobContract, TestToken);
//         await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);
//
//         await testUtil.withdrawDaoFunds(
//             JobContract,
//             _signers.other.address,
//             testUtil.toBigNum(10)
//         );
//
//         // check other address balance
//         expect(await TestToken.balanceOf(_signers.other.address)).to.equal(
//             testUtil.toBigNum(1000 + 10)
//         );
//     });
//     it('may only by be withdrawn by owner', async function() {
//         const _signers = await testUtil.signers();
//
//         const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
//         await testUtil.postSampleJob()(JobContract, TestToken);
//         await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);
//
//         await expect(
//             testUtil.withdrawDaoFunds(
//                 JobContract,
//                 _signers.other.address,
//                 testUtil.toBigNum(10),
//                 _signers.other
//             )
//         ).to.be.revertedWith('Method not available for this caller');
//
//         await expect(
//             testUtil.withdrawDaoFunds(
//                 JobContract,
//                 _signers.other.address,
//                 testUtil.toBigNum(10),
//                 _signers.supplier
//             )
//         ).to.be.revertedWith('Method not available for this caller');
//     });
//     it('may not overdraw', async function() {
//         const _signers = await testUtil.signers();
//
//         const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
//         await testUtil.postSampleJob()(JobContract, TestToken);
//         await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);
//
//         await expect(
//             testUtil.withdrawDaoFunds(
//                 JobContract,
//                 _signers.other.address,
//                 testUtil.toBigNum(11)
//             )
//         ).to.be.revertedWith('Insufficient funds');
//     });
//     it('updates balance when withdrawn', async function() {
//         const _signers = await testUtil.signers();
//
//         const { JobContract, TestToken } = await testUtil.setupJobAndTokenBalances();
//         await testUtil.postSampleJob()(JobContract, TestToken);
//         await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);
//         await testUtil.withdrawDaoFunds(
//             JobContract,
//             _signers.other.address,
//             testUtil.toBigNum(8)
//         );
//         const fundsValue = await getBalanceOf(TestToken, JobContract.address);
//         expect(fundsValue).to.equal(testUtil.toBigNum(2));
//     });
// });

})
