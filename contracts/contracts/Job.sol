//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Job {

    struct JobData {
        address supplier;
        uint bounty;
        address engineer;
        uint deposit;

        uint startTime;
        uint completedTime;

        bool closedBySupplier;
        bool closedByEngineer;

        States state;
    }

    uint public jobCount;
    mapping(uint => JobData) public jobs;

    address public owner;
    address public paymentToken;

    uint public daoEscrow;
    uint public daoFunds;

    enum States {
        DoesNotExist,
        Available,
        Started,
        Completed,
        Disputed,
        FinalApproved,
        FinalCanceledBySupplier,
        FinalMutualClose,
        FinalNoResponse,
        FinalDisputeResolvedForSupplier,
        FinalDisputeResolvedForEngineer,
        FinalDisputeResolvedWithSplit
    }

    uint constant MINIMUM_BOUNTY = 50000000000000000000; // 50 paymentTokens ($50)

    uint constant BASE_PERCENTAGE = 10000; // for integer percentage math
    uint constant DEPOSIT_PERCENTAGE = 1000; // out of 10000
    uint constant PAYOUT_PERCENTAGE = 9000; // (10000 - <platform fee>) out of 10000
    uint constant RESOLUTION_FEE_PERCENTAGE = 600; // out of 10000
    uint constant MINIMUM_SPLIT_CHUNK_PERCENTAGE = 100; // out of 10000

    uint constant COMPLETED_TIMEOUT_SECONDS = 432000; // Number of seconds after job is completed before job is awarded to engineer

    ////////////////////////////////////////
    // events

    event JobPosted(uint indexed jobId, string jobMetaData);
    event JobSupplied(address indexed supplier, uint indexed jobId);
    event JobStarted(address indexed engineer, uint indexed jobId);
    event JobCompleted(uint indexed jobId);
    event JobApproved(uint indexed jobId, uint payoutAmount);
    event JobTimeoutPayout(uint indexed jobId, uint payoutAmount);
    event JobCanceled(uint indexed jobId);
    event JobClosedBySupplier(uint indexed jobId);
    event JobClosedByEngineer(uint indexed jobId);
    event JobClosed(uint indexed jobId);
    event JobDisputed(uint indexed jobId);
    event JobDisputeResolved(uint indexed jobId, States finalState);

    ////////////////////////////////////////
    // modifiers

    modifier requiresAmount(uint amount, uint minimumPaymentAmount) {
        require(amount >= minimumPaymentAmount, "Minimum payment not provided");
        _;
    }

    modifier requiresApproval(uint amount) {
        IERC20 _paymentToken = IERC20(paymentToken);
        require(_paymentToken.allowance(msg.sender, address(this)) >= amount, "Spending approval is required");
        _;
    }

    modifier requiresJobState(uint jobId, States requiredState) {
        require(jobs[jobId].state == requiredState, "Method not available for job state");
        _;
    }

    modifier requiresOneOfJobStates(uint jobId, States requiredState1, States requiredState2) {
        require(jobs[jobId].state == requiredState1 || jobs[jobId].state == requiredState2, "Method not available for job state");
        _;
    }

    modifier requiresSupplier(uint jobId) {
        require(jobs[jobId].supplier == msg.sender, "Method not available for this caller");
        _;
    }

    modifier requiresEngineer(uint jobId) {
        require(jobs[jobId].engineer == msg.sender, "Method not available for this caller");
        _;
    }

    modifier requiresResolver() {
        require(owner == msg.sender, "Method not available for this caller");
        _;
    }

    modifier requiresFundManager() {
        require(owner == msg.sender, "Method not available for this caller");
        _;
    }

    ////////////////////////////////////////
    // public functions

    constructor(address _paymentToken) {
        owner = msg.sender;
        paymentToken = _paymentToken;
        jobCount = 0;
        daoEscrow = 0;
        daoFunds = 0;
    }

    // supplier posts a new job
    function postJob(uint bountyValue, string memory jobMetaData) public requiresApproval(bountyValue) requiresAmount(bountyValue, MINIMUM_BOUNTY) {
        // receive funds
        receiveFunds(msg.sender, bountyValue);

        // assign newJobId from state
        ++jobCount;
        uint newJobId = jobCount;

        // update state
        jobs[newJobId] = JobData({
            supplier: msg.sender,
            bounty: bountyValue,
            engineer: address(0),
            deposit: 0,
            startTime: 0,
            completedTime: 0,
            closedBySupplier: false,
            closedByEngineer: false,
            state: States.Available
        });

        daoEscrow += bountyValue;

        // save the job meta data
        emit JobPosted(newJobId, jobMetaData);
        
        // emit JobSupplied to map the supplier to the job
        emit JobSupplied(msg.sender, newJobId);
    }

    // engineer starts a posted job
    function startJob(uint jobId, uint deposit) public requiresJobState(jobId, States.Available) {
        // require deposit payment
        uint requiredBuyIn = jobs[jobId].bounty * DEPOSIT_PERCENTAGE / BASE_PERCENTAGE;
        require(deposit >= requiredBuyIn, "Minimum payment not provided");

        receiveFunds(msg.sender, deposit);

        // can't accept your own job
        require(msg.sender != jobs[jobId].supplier, "Address may not be job poster");

        // update state
        jobs[jobId].engineer = msg.sender;
        jobs[jobId].deposit = deposit;
        jobs[jobId].startTime = block.timestamp;
        jobs[jobId].state = States.Started;

        daoEscrow += deposit;
    }

    // engineer marks a job as completed
    function completeJob(uint jobId) public requiresJobState(jobId, States.Started) requiresEngineer(jobId) {
        jobs[jobId].state = States.Completed;
        jobs[jobId].completedTime = block.timestamp;

        emit JobCompleted(jobId);
    }

    // job is approved by the supplier and paid out
    function approveJob(uint jobId) public requiresJobState(jobId, States.Completed) requiresSupplier(jobId) {
        jobs[jobId].state = States.FinalApproved;

        (uint payoutAmount, uint daoTakeAmount) = calculatePayout(jobs[jobId].bounty, jobs[jobId].deposit);
        sendJobPayout(payoutAmount, daoTakeAmount, address(jobs[jobId].engineer));

        emit JobApproved(jobId, payoutAmount);
    }


    // job is canceled by supplier before it was started
    function cancelJob(uint jobId) public requiresJobState(jobId, States.Available) requiresSupplier(jobId) {
        jobs[jobId].state = States.FinalCanceledBySupplier;

        sendJobRefund(jobId);

        emit JobCanceled(jobId);
    }

    // job is closed if both supplier and engineer agree to cancel the job after it was started
    function closeJob(uint jobId) public requiresJobState(jobId, States.Started) {
        // must be supplier or engineer
        if (msg.sender == address(jobs[jobId].supplier)) {
            closeJobBySupplier(jobId);
        } else if (msg.sender == address(jobs[jobId].engineer)) {
            closeJobByEngineer(jobId);
        } else {
            revert("Method not available for this caller");
        }

        // if closed by both parties, then change state and refund
        if (jobs[jobId].closedBySupplier && jobs[jobId].closedByEngineer) {
            jobs[jobId].state = States.FinalMutualClose;
            sendJobRefund(jobId);

            emit JobClosed(jobId);
        }
    }

    function completeTimedOutJob(uint jobId) public requiresJobState(jobId, States.Completed) requiresEngineer(jobId) {
        require(block.timestamp - jobs[jobId].completedTime >= COMPLETED_TIMEOUT_SECONDS, "Job still in approval time window");

        jobs[jobId].state = States.FinalNoResponse;

        (uint payoutAmount, uint daoTakeAmount) = calculatePayout(jobs[jobId].bounty, jobs[jobId].deposit);
        sendJobPayout(payoutAmount, daoTakeAmount, address(jobs[jobId].engineer));

        emit JobTimeoutPayout(jobId, payoutAmount);
    }

    function disputeJob(uint jobId) public requiresOneOfJobStates(jobId, States.Started, States.Completed) requiresSupplier(jobId) {
        jobs[jobId].state = States.Disputed;

        emit JobDisputed(jobId);
    }

    function resolveDisputeForSupplier(uint jobId) public requiresJobState(jobId, States.Disputed) requiresResolver() {
        jobs[jobId].state = States.FinalDisputeResolvedForSupplier;

        (uint payoutAmount, uint daoTakeAmount) = calculateFullDisputeResolutionPayout(jobs[jobId].bounty, jobs[jobId].deposit);
        sendJobPayout(payoutAmount, daoTakeAmount, address(jobs[jobId].supplier));

        emit JobDisputeResolved(jobId, States.FinalDisputeResolvedForSupplier);
    }

    function resolveDisputeForEngineer(uint jobId) public requiresJobState(jobId, States.Disputed) requiresResolver() {
        jobs[jobId].state = States.FinalDisputeResolvedForEngineer;

        (uint payoutAmount, uint daoTakeAmount) = calculateFullDisputeResolutionPayout(jobs[jobId].bounty, jobs[jobId].deposit);
        sendJobPayout(payoutAmount, daoTakeAmount, address(jobs[jobId].engineer));

        emit JobDisputeResolved(jobId, States.FinalDisputeResolvedForEngineer);
    }

    function resolveDisputeWithCustomSplit(uint jobId, uint engineerAmountPct) public requiresJobState(jobId, States.Disputed) requiresResolver() {
        require(engineerAmountPct >= MINIMUM_SPLIT_CHUNK_PERCENTAGE, "Percentage too low");
        require(engineerAmountPct <= BASE_PERCENTAGE - MINIMUM_SPLIT_CHUNK_PERCENTAGE, "Percentage too high");

        jobs[jobId].state = States.FinalDisputeResolvedWithSplit;

        (uint supplierPayoutAmount, uint engineerPayoutAmount, uint daoTakeAmount) = calculateSplitDisputeResolutionPayout(jobs[jobId].bounty, jobs[jobId].deposit, engineerAmountPct);
        sendSplitJobPayout(jobId, supplierPayoutAmount, engineerPayoutAmount, daoTakeAmount);

        emit JobDisputeResolved(jobId, States.FinalDisputeResolvedWithSplit);
    }

    ////////////////////////////////////////
    // DAO management functions

    function withdrawDaoFunds(address recipient, uint amount) public requiresFundManager() {
        require(amount <= daoFunds, "Insufficient funds");

        daoFunds = daoFunds - amount;
        sendFunds(recipient, amount);
    }

    ////////////////////////////////////////
    // internal functions

    function closeJobBySupplier(uint jobId) internal {
        require(jobs[jobId].closedBySupplier == false, "Close request already received");
        jobs[jobId].closedBySupplier = true;

        emit JobClosedBySupplier(jobId);
    }

    function closeJobByEngineer(uint jobId) internal {
        require(jobs[jobId].closedByEngineer == false, "Close request already received");
        jobs[jobId].closedByEngineer = true;

        emit JobClosedByEngineer(jobId);
    }

    function sendJobRefund(uint jobId) internal {
        sendFunds(address(jobs[jobId].supplier), jobs[jobId].bounty);
        daoEscrow = daoEscrow - jobs[jobId].bounty;

        if (jobs[jobId].deposit > 0) {
            sendFunds(address(jobs[jobId].engineer), jobs[jobId].deposit);
            daoEscrow = daoEscrow - jobs[jobId].deposit;
        }
    }

    function calculatePayout(uint bounty, uint deposit) internal pure returns (uint payoutAmount, uint daoTakeAmount) {
        uint bountyPayout = bounty * PAYOUT_PERCENTAGE / BASE_PERCENTAGE;

        daoTakeAmount = bounty - bountyPayout;
        payoutAmount = bountyPayout + deposit;
    }

    function calculateFullDisputeResolutionPayout(uint bounty, uint deposit) internal pure returns (uint payoutAmount, uint daoTakeAmount) {
        uint resolutionPayout = bounty + deposit;

        daoTakeAmount = resolutionPayout * RESOLUTION_FEE_PERCENTAGE / BASE_PERCENTAGE;
        payoutAmount = resolutionPayout - daoTakeAmount;
    }

    function sendJobPayout(uint payoutAmount, uint daoTakeAmount, address destination) internal {
        daoEscrow = daoEscrow - payoutAmount - daoTakeAmount;
        daoFunds += daoTakeAmount;

        sendFunds(destination, payoutAmount);
    }

    function calculateSplitDisputeResolutionPayout(uint bounty, uint deposit, uint engineerAmountPct) internal pure returns (uint supplierPayoutAmount, uint engineerPayoutAmount, uint daoTakeAmount) {
        uint resolutionPayout = bounty + deposit;

        daoTakeAmount = resolutionPayout * RESOLUTION_FEE_PERCENTAGE / BASE_PERCENTAGE;

        uint totalPayoutAmount = resolutionPayout - daoTakeAmount;
        engineerPayoutAmount = totalPayoutAmount * engineerAmountPct / BASE_PERCENTAGE;
        supplierPayoutAmount = totalPayoutAmount - engineerPayoutAmount;
    }

    function sendSplitJobPayout(uint jobId, uint supplierPayoutAmount, uint engineerPayoutAmount, uint daoTakeAmount) internal {
        daoEscrow = daoEscrow - supplierPayoutAmount - engineerPayoutAmount - daoTakeAmount;
        daoFunds += daoTakeAmount;

        sendFunds(address(jobs[jobId].supplier), supplierPayoutAmount);
        sendFunds(address(jobs[jobId].engineer), engineerPayoutAmount);
    }

    function receiveFunds(address _from, uint amount) internal {
        IERC20 _paymentToken = IERC20(paymentToken);
        require(_paymentToken.transferFrom(_from, address(this), amount), "Transfer Failed");
    }

    function sendFunds(address _to, uint amount) internal {
        IERC20 _paymentToken = IERC20(paymentToken);
        require(_paymentToken.transfer(_to, amount), "Transfer Failed");
    }

}
