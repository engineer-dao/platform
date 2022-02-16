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
    deployDaoTreasury, deployJob, updatePaymentTokens, getAllowedTokens
} from "./lib/testUtil";

const hre = require('hardhat');
import { expect } from 'chai';
import { ethers } from 'hardhat';

import * as testUtil from './lib/testUtil';
import { BigNumber } from "ethers";
import { SignerWithAddress } from "hardhat-deploy-ethers/signers";
import { Job, TestERC20, DaoTreasury } from "../typechain";

describe('A test ERC20 token', function() {
    it('can be created', async function() {
        const TestToken = await testUtil.deployERC20Token();

        const supply = await TestToken.totalSupply();
        expect(supply).to.equal(testUtil.toBigNum(1000000));

        const ownerSigner = (await testUtil.signers()).owner;
        const ownerBalance = await getBalanceOf(TestToken, ownerSigner.address);
        expect(ownerBalance).to.equal(testUtil.toBigNum(1000000));
    });
});

describe("JobContract ", function() {
    let owner: SignerWithAddress,
        resolver: SignerWithAddress,
        supplier: SignerWithAddress,
        engineer: SignerWithAddress,
        reporter: SignerWithAddress,
        addr1: SignerWithAddress,
        addr2: SignerWithAddress;

    let JobContract: Job;
    let TestToken: TestERC20;
    let DaoTreasury: DaoTreasury;

    before(async () => {
        await testUtil.setup();

        [owner, resolver, supplier, engineer, reporter, addr1, addr2] =
            await hre.ethers.getSigners();
    })

    beforeEach(async () => {
        // deploy the contract
        const contracts = await testUtil.setupJobAndTokenBalances();

        JobContract = contracts.JobContract;
        TestToken = contracts.TestToken;
        DaoTreasury = contracts.DaoTreasury;
    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A new job', function() {
        it('should have correct variables', async function() {

            // jobId 0
            expect(await JobContract.jobCount()).to.equal(0);

            const amountSent = testUtil.ONE_HUND_TOKENS;
            await testUtil.postSampleJob()(JobContract, TestToken, amountSent);

            // jobId 1
            expect(await JobContract.jobCount()).to.equal(1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check supplier
            expect(jobOne.supplier).to.equal(supplier.address);

            // check bounty
            expect(jobOne.bounty).to.equal(amountSent);

            // check bounty
            expect(jobOne.depositPct).to.equal(testUtil.DEFAULT_DEPOSIT_PCT);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_Available);
        });

        it('should have correct depositPct', async function() {

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
            TestToken = await deployERC20Token();
            DaoTreasury = await deployDaoTreasury();

            JobContract = await deployJob(TestToken, DaoTreasury, resolver.address);

            // send balances
            await TestToken.transfer(
                supplier.address,
                testUtil.ONE_THOUS_TOKENS
            );

            // should revert with no approval
            await expect(testUtil.postSampleJob()(JobContract, TestToken)).to.be.revertedWith(
                'Spending approval is required'
            );
        });

        it('requires a payment', async function() {

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


            await testUtil.postSampleJob()(JobContract, TestToken, bounty1Amount);
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(bounty1Amount);

            await testUtil.postSampleJob()(JobContract, TestToken, bounty2Amount);
            const secondEscrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(secondEscrowValue).to.equal(totalExpectedEscrow);
        });

        it('can be loaded', async function() {
            const bountyAmount = testUtil.toBigNum(190); // $190
            await testUtil.postSampleJob()(JobContract, TestToken, bountyAmount);

            // load the job from the blockchain
            const jobData = await JobContract.jobs(testUtil.JOB_ID_1);
            expect(jobData.supplier).to.equal(supplier.address);
            expect(jobData.bounty).to.equal(bountyAmount);
        });

        it('emits JobPosted event when posted', async function() {

            await expect(testUtil.postSampleJob()(JobContract, TestToken))
                .to.emit(JobContract, 'JobPosted')
                .withArgs(testUtil.JOB_ID_1, JSON.stringify(testUtil.defaultJobMetaData));
        });

        it('emits JobSupplied event when posted', async function() {

            await expect(testUtil.postSampleJob()(JobContract, TestToken))
                .to.emit(JobContract, 'JobSupplied')
                .withArgs(supplier.address, testUtil.JOB_ID_1);
        });

        it('can be posted multiple times', async function() {
            // post three jobs
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.postSampleJob(addr1)(JobContract, TestToken);
            await testUtil.postSampleJob(addr2)(JobContract, TestToken);

            // job id is now three
            expect(await JobContract.jobCount()).to.equal(3);

            // get the jobs
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);
            const jobTwo = await JobContract.jobs(testUtil.JOB_ID_2);
            const jobThree = await JobContract.jobs(testUtil.JOB_ID_3);

            expect(jobOne.supplier).to.equal(supplier.address);
            expect(jobTwo.supplier).to.equal(addr1.address);
            expect(jobThree.supplier).to.equal(addr2.address);
        });

        it('can be posted multiple times by same signer', async function() {
            // post three jobs
            await testUtil.postSampleJob(addr1)(JobContract, TestToken);
            await testUtil.postSampleJob(addr1)(JobContract, TestToken);
            await testUtil.postSampleJob(addr1)(JobContract, TestToken);

            // job id is now three
            expect(await JobContract.jobCount()).to.equal(3);

            // get the jobs
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);
            const jobTwo = await JobContract.jobs(testUtil.JOB_ID_2);
            const jobThree = await JobContract.jobs(testUtil.JOB_ID_3);

            expect(jobOne.supplier).to.equal(addr1.address);
            expect(jobTwo.supplier).to.equal(addr1.address);
            expect(jobThree.supplier).to.equal(addr1.address);
        });

        it('should revert if posting with invalid deposit percent', async function() {
            // jobId 0
            expect(await JobContract.jobCount()).to.equal(0);

            const amountSent = testUtil.ONE_HUND_THOUS_TOKENS;

            await expect(
                testUtil.postSampleJob()(JobContract, TestToken, amountSent, BASE_PERCENT + 1)
            ).to.be.revertedWith('Deposit percent invalid');

            await expect(
                testUtil.postSampleJob()(JobContract, TestToken, amountSent, 0)
            ).to.be.revertedWith('Deposit percent invalid');
        });

        it('should revert if jobMetaData is not a valid ipfs hash', async function() {
            // TODO:
        });

    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A job to be started', function() {
        it('can be started with correct variables', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            // get jobData
            const jobData = await JobContract.jobs(testUtil.JOB_ID_1);

            // check engineer
            expect(jobData.engineer).to.equal(engineer.address);

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

        it('emits JobStarted event when started', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(testUtil.startJob(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobStarted')
                .withArgs(engineer.address, testUtil.JOB_ID_1);
        });

        it('can be started when given correct deposit', async function() {
            const amount = testUtil.ONE_HUND_TOKENS;
            const depositPct = 5000;

            await testUtil.postSampleJob()(JobContract, TestToken, amount, depositPct);

            const exactlyMinDeposit = BigNumber.from(amount).div(2).toString();
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1, exactlyMinDeposit);

            // get jobData
            const jobData = await JobContract.jobs(testUtil.JOB_ID_1);

            // check engineer
            expect(jobData.engineer).to.equal(engineer.address);

            // check deposit
            expect(jobData.deposit).to.equal(exactlyMinDeposit);

            // check startTime
            const blockTimestamp = (
                await ethers.provider.getBlock(await ethers.provider.getBlockNumber())
            ).timestamp;
            expect(jobData.startTime).to.equal(blockTimestamp);

            // check state
            expect(jobData.state).to.equal(testUtil.STATE_Started);
        });


        it('requires more than Default deposit', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, testUtil.ONE_TOKEN)
            ).to.be.revertedWith('Minimum payment not provided');

            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, '0')
            ).to.be.revertedWith('Minimum payment not provided');
        });

        it('requires more than min deposit', async function() {

            const amount = testUtil.ONE_HUND_TOKENS;
            const depositPct = 5000;

            await testUtil.postSampleJob()(JobContract, TestToken, amount, depositPct);

            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, testUtil.ONE_TOKEN)
            ).to.be.revertedWith('Minimum payment not provided');

            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, '0')
            ).to.be.revertedWith('Minimum payment not provided');

            const oneLessThanExpected = BigNumber.from(amount).div(2).sub(1).toString();

            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, oneLessThanExpected)
            ).to.be.revertedWith('Minimum payment not provided');
        });

        it('must be in Available state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            // start job once successfully
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            // can't start again
            await expect(testUtil.startJob(JobContract, testUtil.JOB_ID_1)).to.be.revertedWith(
                'Method not available for job state'
            );
        });

        it('must have an engineer that is not the supplier', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            // supplier can't start job
            await expect(
                testUtil.startJob(JobContract, testUtil.JOB_ID_1, null, supplier)
            ).to.be.revertedWith('Address may not be job poster');
        });

        it('increases dao escrow when accepting the job', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.cancelJob(JobContract, testUtil.JOB_ID_1);

            // dao escrow is now zero
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // supplier was refunded
            expect(await getBalanceOf(TestToken, supplier.address)).to.equal(
                testUtil.ONE_THOUS_TOKENS
            );

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_FinalCanceledBySupplier);
        });

        it('may only be canceled when in the available state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            // trying to cancel an accepted job reverts
            await expect(testUtil.cancelJob(JobContract, testUtil.JOB_ID_1)).to.be.revertedWith(
                'Method not available for job state'
            );
        });

        it('may only be canceled by the supplier', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            // trying to cancel by other address reverts
            await expect(
                testUtil.cancelJob(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.cancelJob(JobContract, testUtil.JOB_ID_1, engineer)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.cancelJob(JobContract, testUtil.JOB_ID_1, owner)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobCanceled event when canceled', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_Completed);
        });

        it('requires started state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.completeJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by engineer', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.completeJob(JobContract, testUtil.JOB_ID_1, supplier)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.completeJob(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.completeJob(JobContract, testUtil.JOB_ID_1, owner)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobCompleted event when completed', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            const engineerInitialAmount = await getBalanceOf(TestToken, engineer.address);
            await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);
            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            const { forEngineer, forDao } = await testUtil.getJobPayouts(JobContract, testUtil.JOB_ID_1);
            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_FinalApproved);

            // Job has 0 tokens
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // engineer received
            const engineerAmount = await getBalanceOf(TestToken, engineer.address);
            expect(engineerAmount.sub(engineerInitialAmount)).to.equal(forEngineer);

            // daoTreasury received
            const daoTreasuryAmount = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(daoTreasuryAmount).to.equal(forDao);
        });

        it('requires completed state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.approveJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by supplier', async function() {

            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.approveJob(JobContract, testUtil.JOB_ID_1, engineer)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.approveJob(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobApproved event when approved', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);

            const engineerBalance = await getBalanceOf(TestToken,
                engineer.address
            );
            expect(engineerBalance).to.equal(testUtil.toBigNum(1090));

            const supplierBalance = await getBalanceOf(TestToken,
                supplier.address
            );
            expect(supplierBalance).to.equal(testUtil.toBigNum(900));
        });

        it('sends DAO_FEE to treasury', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.approveJob(JobContract, testUtil.JOB_ID_1);

            const DAO_FEE = await JobContract.DAO_FEE();

            const job = await JobContract.jobs(testUtil.JOB_ID_1);
            const expectedAmount = job.bounty.mul(DAO_FEE).div(10000);

            const daoBalance = await getBalanceOf(TestToken,
                DaoTreasury.address
            );
            expect(daoBalance).to.equal(expectedAmount);
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A closeable job', function() {
        it('may be closed', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_FinalMutualClose);

            // updates escrow
            const jobValue = await getBalanceOf(TestToken, JobContract.address);
            expect(jobValue).to.equal(0);

            // updates funds
            const daoValue = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(daoValue).to.equal(0);
        });

        it('requires started state', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.closeJob(JobContract, testUtil.JOB_ID_1, owner)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.closeJob(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.closeJob(JobContract, testUtil.JOB_ID_1, addr2)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('may only be called by supplier once', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Close request already received');
        });

        it('may only be called by engineer once', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Close request already received');
        });

        it('emits JobClosed event when closed by engineer', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobClosed')
                .withArgs(testUtil.JOB_ID_1);
        });

        it('emits JobClosedBySupplier and JobClosedByEngineer events when closed', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobClosed')
                .withArgs(testUtil.JOB_ID_1);
        });

        it('refunds bounty and deposit when closed', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            const startingSupplierBalance = await getBalanceOf(TestToken,
                supplier.address
            );
            expect(startingSupplierBalance).to.equal(testUtil.toBigNum(900));

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            const startingEngineerBalance = await getBalanceOf(TestToken,
                engineer.address
            );
            expect(startingEngineerBalance).to.equal(testUtil.toBigNum(990));

            await testUtil.closeBySupplier(JobContract, testUtil.JOB_ID_1);
            await testUtil.closeByEngineer(JobContract, testUtil.JOB_ID_1);

            const engineerBalance = await getBalanceOf(TestToken,
                engineer.address
            );
            expect(engineerBalance).to.equal(testUtil.ONE_THOUS_TOKENS);

            const supplierBalance = await getBalanceOf(TestToken,
                supplier.address
            );
            expect(supplierBalance).to.equal(testUtil.ONE_THOUS_TOKENS);
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A timed-out job', function() {
        it('may be finalized', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            const engineerInitialAmount = await getBalanceOf(TestToken, engineer.address);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            const TIMEOUT_PERIOD = await JobContract.COMPLETED_TIMEOUT_SECONDS();
            await hre.timeAndMine.setTimeIncrease(TIMEOUT_PERIOD);

            await testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_FinalNoResponse);

            const { forEngineer, forDao } = await testUtil.getJobPayouts(JobContract, testUtil.JOB_ID_1);
            // Job has 0 tokens
            const escrowValue = await getBalanceOf(TestToken, JobContract.address);
            expect(escrowValue).to.equal(0);

            // engineer received
            const engineerAmount = await getBalanceOf(TestToken, engineer.address);
            expect(engineerAmount.sub(engineerInitialAmount)).to.equal(forEngineer);

            // daoTreasury received
            const daoTreasuryAmount = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(daoTreasuryAmount).to.equal(forDao);
        });

        it('requires completed state', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Job still in approval time window');
        });

        it('may only be called by engineer', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            await hre.timeAndMine.setTimeIncrease(432001);

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1, owner)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1, supplier)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobTimeoutPayout event when timed out', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            const TIMEOUT_PERIOD = await JobContract.COMPLETED_TIMEOUT_SECONDS();
            await hre.timeAndMine.setTimeIncrease(TIMEOUT_PERIOD);

            const expectedPayoutAmount = testUtil.ONE_HUND_TOKENS;
            await expect(testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobTimeoutPayout')
                .withArgs(testUtil.JOB_ID_1, expectedPayoutAmount);
        });

        it('sends bounty and deposit to engineer', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            const TIMEOUT_PERIOD = await JobContract.COMPLETED_TIMEOUT_SECONDS();
            await hre.timeAndMine.setTimeIncrease(TIMEOUT_PERIOD);

            await testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1);

            const engineerBalance = await getBalanceOf(TestToken,
                engineer.address
            );
            expect(engineerBalance).to.equal(testUtil.toBigNum(1090));

            const supplierBalance = await getBalanceOf(TestToken,
                supplier.address
            );
            expect(supplierBalance).to.equal(testUtil.toBigNum(900));
        });

        it('sends DAO_FEE to treasury', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            // time-out
            const TIMEOUT_PERIOD = await JobContract.COMPLETED_TIMEOUT_SECONDS();
            await hre.timeAndMine.setTimeIncrease(TIMEOUT_PERIOD);

            await testUtil.completeTimedOutJob(JobContract, testUtil.JOB_ID_1);

            const DAO_FEE = await JobContract.DAO_FEE();

            const job = await JobContract.jobs(testUtil.JOB_ID_1);
            const expectedAmount = job.bounty.mul(DAO_FEE).div(10000);

            const daoBalance = await getBalanceOf(TestToken,
                DaoTreasury.address
            );
            expect(daoBalance).to.equal(expectedAmount);
        });

    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A disputable job', function() {
        it('may be disputed when started', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(testUtil.STATE_Disputed);
        });

        it('may be disputed when completed', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.disputeJob(JobContract, testUtil.JOB_ID_1, owner)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.disputeJob(JobContract, testUtil.JOB_ID_1, engineer)
            ).to.be.revertedWith('Method not available for this caller');

            await expect(
                testUtil.disputeJob(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Method not available for this caller');
        });

        it('emits JobDisputed event when disputed', async function() {
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

        it('may only be called by resolver', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForSupplier(
                    JobContract,
                    testUtil.JOB_ID_1,
                    supplier
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.resolveDisputeForSupplier(
                    JobContract,
                    testUtil.JOB_ID_1,
                    engineer
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1, owner)
            ).to.be.revertedWith('Not Authorized !');
        });

        it('emits JobDisputeResolved event when resolved', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1);

            // check contract
            const jobValue = await getBalanceOf(TestToken, JobContract.address);
            expect(jobValue).to.equal(0);

            // check supplier (+)
            expect(await getBalanceOf(TestToken, supplier.address)).to.equal(
                testUtil.toBigNum(1000 + 103.4 - 100)
            );

            // check engineer (-)
            expect(await getBalanceOf(TestToken, engineer.address)).to.equal(
                testUtil.toBigNum(1000 - 10)
            );

            // check Dao funds
            const fundsValue = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(fundsValue).to.equal(testUtil.toBigNum(6.6));
        });

        it('sends funds and updates balances when resolved (with getter)', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            const engineerInitialAmount = await getBalanceOf(TestToken, engineer.address);
            const supplierInitialAmount = await getBalanceOf(TestToken, supplier.address);

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForSupplier(JobContract, testUtil.JOB_ID_1);

            const { forWinner, forDao } = await testUtil.getDisputePayouts(JobContract, testUtil.JOB_ID_1);

            // check contract
            const jobValue = await getBalanceOf(TestToken, JobContract.address);
            expect(jobValue).to.equal(0);

            // check supplier (+)
            const supplierAmount = await getBalanceOf(TestToken, supplier.address);
            expect(supplierAmount).to.equal(supplierInitialAmount.add(forWinner));

            // check engineer (-)
            expect(await getBalanceOf(TestToken, engineer.address))
                .to.equal(engineerInitialAmount.sub(testUtil.TEN_TOKENS));

            // check Dao funds
            const fundsValue = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(fundsValue).to.equal(forDao);
        });

    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A disputed job that will be resolved for the engineer', function() {
        it('may be resolved for engineer', async function() {
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

        it('may only be called by resolver', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeForEngineer(
                    JobContract,
                    testUtil.JOB_ID_1,
                    owner
                )
            ).to.be.revertedWith('Not Authorized !');


            await expect(
                testUtil.resolveDisputeForEngineer(
                    JobContract,
                    testUtil.JOB_ID_1,
                    supplier
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.resolveDisputeForEngineer(
                    JobContract,
                    testUtil.JOB_ID_1,
                    engineer
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Not Authorized !');
        });

        it('emits JobDisputeResolved event when resolved', async function() {
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
            await testUtil.postSampleJob()(JobContract, TestToken);

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1);

            // JobContract 0
            const contractValue = await getBalanceOf(TestToken, JobContract.address);
            expect(contractValue).to.equal(0);

            // check supplier funds  (-)
            expect(await getBalanceOf(TestToken, supplier.address)).to.equal(
                testUtil.toBigNum(1000 - 100)
            );

            // check engineer funds (+)
            expect(await getBalanceOf(TestToken, engineer.address)).to.equal(
                testUtil.toBigNum(1000 - 10 + 103.4)
            );

            // Dao % fee
            const daoValue = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(daoValue).to.equal(testUtil.toBigNum(6.6));
        });

        it('sends funds and updates balances when resolved (with getter)', async function() {
            const supplierInitialAmount = await getBalanceOf(TestToken, supplier.address);

            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            const engineerInitialAmount = await getBalanceOf(TestToken, engineer.address);

            await testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1);

            const { forWinner, forDao } = await testUtil.getDisputePayouts(JobContract, testUtil.JOB_ID_1);

            // JobContract 0
            const contractValue = await getBalanceOf(TestToken, JobContract.address);
            expect(contractValue).to.equal(0);

            // check supplier (-)
            expect(await getBalanceOf(TestToken, supplier.address)).to.equal(supplierInitialAmount.sub(ONE_HUND_TOKENS));

            // check engineer (-)
            const engineerAmount = await getBalanceOf(TestToken, engineer.address);
            expect(engineerAmount).to.equal(engineerInitialAmount.add(forWinner));

            // check Dao funds
            const daoValue = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(daoValue).to.equal(forDao);
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A disputed job that will be resolved with custom split', function() {
        it('may be resolved', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 5000);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(
                testUtil.STATE_FinalDisputeResolvedWithSplit
            );
        });

        it('requires disputed state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 1000)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 2000)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 3000)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 4000);

            await expect(
                testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 10000)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by resolver', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.resolveDisputeWithCustomSplit(
                    JobContract,
                    testUtil.JOB_ID_1,
                    200,
                    owner
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.resolveDisputeWithCustomSplit(
                    JobContract,
                    testUtil.JOB_ID_1,
                    200,
                    supplier
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.resolveDisputeWithCustomSplit(
                    JobContract,
                    testUtil.JOB_ID_1,
                    300,
                    engineer
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 9999, addr1)
            ).to.be.revertedWith('Not Authorized !');
        });

        it('emits JobDisputeResolved event when resolved', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 2000))
                .to.emit(JobContract, 'JobDisputeResolved')
                .withArgs(
                    testUtil.JOB_ID_1,
                    testUtil.STATE_FinalDisputeResolvedWithSplit
                );
        });

        it('sends funds and updates balances when resolved 50%', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 5000);

            // JobContract 0
            const contractValue = await getBalanceOf(TestToken, JobContract.address);
            expect(contractValue).to.equal(0);

            // check supplier funds  (-)
            expect(await getBalanceOf(TestToken, supplier.address)).to.equal(
                testUtil.toBigNum(1000 - 100 + 51.7)
            );

            // check engineer funds (+)
            expect(await getBalanceOf(TestToken, engineer.address)).to.equal(
                testUtil.toBigNum(1000 - 10 + 51.7)
            );

            // Dao % fee
            const daoValue = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(daoValue).to.equal(testUtil.toBigNum(6.6));
        });

        it('sends funds and updates balances when resolved (with getter) 50%', async function() {
            const supplierInitialAmount = await getBalanceOf(TestToken, supplier.address);

            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            const engineerInitialAmount = await getBalanceOf(TestToken, engineer.address);

            await testUtil.resolveDisputeWithCustomSplit(JobContract, testUtil.JOB_ID_1, 5000);

            const { forWinner, forDao } = await testUtil.getDisputePayouts(JobContract, testUtil.JOB_ID_1);

            // JobContract 0
            const contractValue = await getBalanceOf(TestToken, JobContract.address);
            expect(contractValue).to.equal(0);

            // check supplier (+)
            expect(await getBalanceOf(TestToken, supplier.address)).to.equal(supplierInitialAmount.sub(ONE_HUND_TOKENS).add(forWinner.div(2)));

            // check engineer (+)
            const engineerAmount = await getBalanceOf(TestToken, engineer.address);
            expect(engineerAmount).to.equal(engineerInitialAmount.add(forWinner.div(2)));

            // check Dao funds
            const daoValue = await getBalanceOf(TestToken, DaoTreasury.address);
            expect(daoValue).to.equal(forDao);
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A reportable job', function() {
        it('can be reported', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1, addr1)

            // get the job & report
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);
            const reportOne = await JobContract.reports(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(
                testUtil.STATE_Available
            );
            expect(jobOne.isReported).to.equal(true);

            expect(reportOne.reporter).to.equal(addr1.address);
            expect(reportOne.metadata).to.equal(testUtil.DEFAULT_REPORT_META);
        });

        it('may not reported in Disputed state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.reportJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.reportJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may not be reported in Final state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.completeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.reportJob(JobContract, testUtil.JOB_ID_1)
            ).to.be.revertedWith('Method not available for job state');
        });

        it('emits JobReported event', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(testUtil.reportJob(JobContract, testUtil.JOB_ID_1, addr1))
                .to.emit(JobContract, 'JobReported')
                .withArgs(
                    testUtil.JOB_ID_1,
                    addr1.address,
                    testUtil.DEFAULT_REPORT_META
                );
        });

        it('sends deposit', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            const depositAmount = await JobContract.REPORT_DEPOSIT();
            const depositToken = await JobContract.REPORT_TOKEN();
            const reporterInitialBalance = await getBalanceOf(depositToken, reporter.address);
            const contractInitialBalance = await getBalanceOf(depositToken, JobContract.address);

            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1);

            // Check reporter
            const reporterBalance = await getBalanceOf(depositToken, reporter.address);
            expect(reporterBalance).to.equal(reporterInitialBalance.sub(depositAmount));

            // Check contract
            const contractBalance = await getBalanceOf(depositToken, JobContract.address);
            expect(contractBalance).to.equal(contractInitialBalance.add(depositAmount));
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A reportable job that will have the report accepted', function() {
        it('can be accepted', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1, addr1)
            await testUtil.acceptReport(JobContract, testUtil.JOB_ID_1)

            // get the job & report
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(
                testUtil.STATE_DoesntExist
            );
        });

        it('may only be called in Reported state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.acceptReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                )
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.acceptReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                )
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.acceptReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                )
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1)

            await expect(
                testUtil.acceptReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                )
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by resolver', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.acceptReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                    owner
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.acceptReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                    engineer
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.acceptReport(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.acceptReport(JobContract, testUtil.JOB_ID_1, supplier)
            ).to.be.revertedWith('Not Authorized !');
        });

        it('emits JobDelisted event', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1)

            await expect(testUtil.acceptReport(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobDelisted')
                .withArgs(
                    testUtil.JOB_ID_1,
                    reporter.address,
                    testUtil.DEFAULT_REPORT_RESOLVE_REASON
                );
        });

        it('sends funds and updates balances when accepted', async function() {
            const depositAmount = await JobContract.REPORT_DEPOSIT();
            const depositToken = await JobContract.REPORT_TOKEN();
            const rewardPecent = await JobContract.REPORT_REWARD_PERCENT();

            const daoInitialBalance = await getBalanceOf(depositToken, DaoTreasury.address);
            const contractInitialBalance = await getBalanceOf(depositToken, JobContract.address);

            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            // === REPORT ===
            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            const engineerInitialAmount = await getBalanceOf(TestToken, engineer.address);
            const supplierInitialAmount = await getBalanceOf(TestToken, supplier.address);
            const reporterInitialAmount = await getBalanceOf(TestToken, reporter.address);

            // === ACCEPT ===
            await testUtil.acceptReport(JobContract, testUtil.JOB_ID_1);

            // check contract (no change "")
            const contractBalance = await getBalanceOf(depositToken, JobContract.address);
            expect(contractBalance).to.equal(contractInitialBalance);

            // check Dao funds (+ deposit)
            const daoBalance = await getBalanceOf(depositToken, DaoTreasury.address);
            expect(daoBalance).to.equal(daoInitialBalance.add(depositAmount));

            const reward = jobOne.bounty.mul(rewardPecent).div(10000);
            const refund = jobOne.bounty.sub(reward);

            // check reporter (+reward)
            expect(await getBalanceOf(TestToken, reporter.address))
                .to.equal(reporterInitialAmount.add(reward));

            // check supplier (+bounty - reward)
            const supplierAmount = await getBalanceOf(TestToken, supplier.address);
            expect(supplierAmount).to.equal(supplierInitialAmount.add(refund));

            // check engineer (+deposit)
            expect(await getBalanceOf(TestToken, engineer.address))
                .to.equal(engineerInitialAmount.add(jobOne.deposit));
        });

        it('sends funds and updates balances when accepted & not started', async function() {
            const depositAmount = await JobContract.REPORT_DEPOSIT();
            const depositToken = await JobContract.REPORT_TOKEN();
            const rewardPecent = await JobContract.REPORT_REWARD_PERCENT();

            const daoInitialBalance = await getBalanceOf(depositToken, DaoTreasury.address);
            const contractInitialBalance = await getBalanceOf(depositToken, JobContract.address);

            await testUtil.postSampleJob()(JobContract, TestToken);

            // === REPORT ===
            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1);

            // get the job
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            const engineerInitialAmount = await getBalanceOf(TestToken, engineer.address);
            const supplierInitialAmount = await getBalanceOf(TestToken, supplier.address);
            const reporterInitialAmount = await getBalanceOf(TestToken, reporter.address);

            // === ACCEPT ===
            await testUtil.acceptReport(JobContract, testUtil.JOB_ID_1);

            // check contract (no change "")
            const contractBalance = await getBalanceOf(depositToken, JobContract.address);
            expect(contractBalance).to.equal(contractInitialBalance);

            // check Dao funds (+ deposit)
            const daoBalance = await getBalanceOf(depositToken, DaoTreasury.address);
            expect(daoBalance).to.equal(daoInitialBalance.add(depositAmount));

            const reward = jobOne.bounty.mul(rewardPecent).div(10000);
            const refund = jobOne.bounty.sub(reward);

            // check reporter (+reward)
            expect(await getBalanceOf(TestToken, reporter.address))
                .to.equal(reporterInitialAmount.add(reward));

            // check supplier (+bounty - reward)
            const supplierAmount = await getBalanceOf(TestToken, supplier.address);
            expect(supplierAmount).to.equal(supplierInitialAmount.add(refund));

            // check engineer (+deposit)
            expect(await getBalanceOf(TestToken, engineer.address))
                .to.equal(engineerInitialAmount);
        });
    });

    ///////////////////////////////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////

    describe('A reportable job that will have the report declined', function() {
        it('can be declined', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1, addr1)
            await testUtil.declineReport(JobContract, testUtil.JOB_ID_1)

            // get the job & report
            const jobOne = await JobContract.jobs(testUtil.JOB_ID_1);

            // check state
            expect(jobOne.state).to.equal(
                testUtil.STATE_Available
            );
        });

        it('may only be called in Reported state', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.declineReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                )
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.declineReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                )
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.disputeJob(JobContract, testUtil.JOB_ID_1);

            await expect(
                testUtil.declineReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                )
            ).to.be.revertedWith('Method not available for job state');

            await testUtil.resolveDisputeForEngineer(JobContract, testUtil.JOB_ID_1)

            await expect(
                testUtil.declineReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                )
            ).to.be.revertedWith('Method not available for job state');
        });

        it('may only be called by resolver', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);

            await expect(
                testUtil.declineReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                    owner
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.declineReport(
                    JobContract,
                    testUtil.JOB_ID_1,
                    engineer
                )
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.declineReport(JobContract, testUtil.JOB_ID_1, addr1)
            ).to.be.revertedWith('Not Authorized !');

            await expect(
                testUtil.declineReport(JobContract, testUtil.JOB_ID_1, supplier)
            ).to.be.revertedWith('Not Authorized !');
        });

        it('emits JobReportDeclined event', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1)

            await expect(testUtil.declineReport(JobContract, testUtil.JOB_ID_1))
                .to.emit(JobContract, 'JobReportDeclined')
                .withArgs(
                    testUtil.JOB_ID_1,
                    reporter.address,
                    testUtil.DEFAULT_REPORT_RESOLVE_REASON
                );
        });

        it('sends deposit to Dao', async function() {
            await testUtil.postSampleJob()(JobContract, TestToken);
            await testUtil.startJob(JobContract, testUtil.JOB_ID_1);

            const depositAmount = await JobContract.REPORT_DEPOSIT();
            const depositToken = await JobContract.REPORT_TOKEN();
            const daoInitialBalance = await getBalanceOf(depositToken, DaoTreasury.address);

            await testUtil.reportJob(JobContract, testUtil.JOB_ID_1);
            await testUtil.declineReport(JobContract, testUtil.JOB_ID_1);

            // Check Dao (+deposit)
            const daoBalance = await getBalanceOf(depositToken, DaoTreasury.address);
            expect(daoBalance).to.equal(daoInitialBalance.add(depositAmount));
        });
    });


    describe("The multiple ERC20 token support", function() {
        it("should be able to add tokens", async function() {
            const Token = await deployERC20Token();
            await updatePaymentTokens(JobContract, Token.address, true);

            const tokens = await testUtil.getAllowedTokens(JobContract);

            expect(tokens).to.contain(Token.address);
        })

        it("should be able to remove tokens", async function() {
            const Token = await deployERC20Token();
            await updatePaymentTokens(JobContract, Token.address, true);

            const tokens = await testUtil.getAllowedTokens(JobContract);
            expect(tokens).to.contain(Token.address);

            await updatePaymentTokens(JobContract, Token.address, false);

            const tokensAfter = await testUtil.getAllowedTokens(JobContract);
            expect(tokensAfter).to.not.contain(Token.address);
        })

        it("should not be able to add the same token twice", async function() {
            const startingTokensCount = (await testUtil.getAllowedTokens(JobContract)).length;

            const Token = await deployERC20Token();
            await updatePaymentTokens(JobContract, Token.address, true);

            const tokens = await testUtil.getAllowedTokens(JobContract);
            expect(tokens.length).to.equal(startingTokensCount + 1);
            expect(tokens).to.contain(Token.address);

            await expect(updatePaymentTokens(JobContract, Token.address, true)).to.be.revertedWith("Already added !");
        })
    })

    describe('Setter Functions', function() {
        // TODO
    });

})
