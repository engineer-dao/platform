//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IJob.sol";

contract Job is IJob, Ownable {
    using SafeERC20 for IERC20;

    /*************
     * Constants *
     *************/

    // Used for math
    uint256 constant BASE_PERCENTAGE = 10_000;

    /*************
     * Variables *
     *************/

    // 50 paymentTokens ($50)
    uint256 public MINIMUM_BOUNTY = 50e18;
    // 50 paymentTokens ($50) - TODO: Should we make this a pct with a hard floor?
    uint256 public MINIMUM_DEPOSIT = 50e18;

    // 10%
    uint256 public DAO_FEE = 1000;
    uint256 constant MAX_DAO_FEE = 2500;
    // 6%
    uint256 public RESOLUTION_FEE_PERCENTAGE = 600;
    uint256 constant MAX_RESOLUTION_FEE_PERCENTAGE = 2500;
    // 1% - this is not configurable
    uint256 constant MINIMUM_SPLIT_CHUNK_PERCENTAGE = 100;
    // Number of seconds after job is completed before job is awarded to engineer
    uint256 public COMPLETED_TIMEOUT_SECONDS = 7 days;
    uint256 constant MAX_COMPLETED_TIMEOUT_SECONDS = 3 days;


    uint256 public REPORT_DEPOSIT = 50e18;
    uint256 constant MIN_REPORT_DEPOSIT = 10e18;
    uint256 constant MAX_REPORT_DEPOSIT = 200e18;
    IERC20 public REPORT_TOKEN;
    uint256 public REPORT_REWARD_PERCENT = 1000;
    uint256 constant MAX_REPORT_REWARD_PERCENT = 2500;

    // @notice DAO_FEE send to this address
    address public daoTreasury;
    address public disputeResolver;

    mapping(IERC20 => bool) public paymentTokens;
    IERC20[] public tokensList;

    /***************
     * Job State *
     ***************/

    struct JobData {
        bool closedBySupplier;
        bool closedByEngineer;
        States state;
        address supplier;
        address engineer;
        IERC20 token;
        // Amount that an engineer needs to deposit to start the job
        uint256 requiredDeposit;
        // Amount that the engineer deposited
        uint256 deposit;
        uint256 bounty;
        uint256 startTime;
        uint256 completedTime;
    }

    struct Report {
        address reporter;
        States previousState;
    }

    enum States {
        DoesNotExist,
        Available,
        Started,
        Completed,
        Disputed,
        Reported,
        FinalApproved,
        FinalCanceledBySupplier,
        FinalMutualClose,
        FinalNoResponse,
        FinalDisputeResolvedForSupplier,
        FinalDisputeResolvedForEngineer,
        FinalDisputeResolvedWithSplit,
        FinalDelisted
    }

    uint256 public jobCount;
    mapping(uint256 => JobData) public jobs;
    mapping(uint256 => Report) public reports;

    /**********
     * Events *
     **********/

    event JobPosted(uint256 indexed jobId, string metadataCid);
    event JobSupplied(address indexed supplier, uint256 indexed jobId);
    event JobStarted(address indexed engineer, uint256 indexed jobId);
    event JobCompleted(uint256 indexed jobId);
    event JobApproved(uint256 indexed jobId, uint256 payoutAmount);
    event JobTimeoutPayout(uint256 indexed jobId, uint256 payoutAmount);
    event JobCanceled(uint256 indexed jobId);
    event JobClosedBySupplier(uint256 indexed jobId);
    event JobClosedByEngineer(uint256 indexed jobId);
    event JobClosed(uint256 indexed jobId);
    event JobDisputed(uint256 indexed jobId);
    event JobDisputeResolved(uint256 indexed jobId, uint256 engineerAmountPct);
    event PaymentTokensUpdated(IERC20 indexed token, bool indexed value);

    event JobReported(uint256 indexed jobId, address reporter, string metadataCid);
    event JobReportDeclined(uint256 indexed jobId, address reporter, string metadataCid);
    event JobDelisted(uint256 indexed jobId, address reporter, string metadataCid);

    /***************
     * Constructor *
     ***************/

    constructor(
        IERC20 _initialToken,
        address _daoTreasury,
        address _resolver
    ) {
        paymentTokens[_initialToken] = true;
        tokensList.push(_initialToken);
        REPORT_TOKEN = _initialToken;
        daoTreasury = _daoTreasury;
        disputeResolver = _resolver;
    }

    /**********************
     * Function Modifiers *
     **********************/
    modifier onlyWhitelisted(IERC20 token) {
        require(paymentTokens[token], "Not Whitelisted !");
        _;
    }

    modifier onlyResolver() {
        require(disputeResolver == msg.sender, "Not Authorized !");
        _;
    }

    modifier requiresJobState(uint256 jobId, States requiredState) {
        require(jobs[jobId].state == requiredState, "Method not available for job state");
        _;
    }

    modifier onlySupplier(uint256 jobId) {
        require(jobs[jobId].supplier == msg.sender, "Method not available for this caller");
        _;
    }

    modifier onlyEngineer(uint256 jobId) {
        require(jobs[jobId].engineer == msg.sender, "Method not available for this caller");
        _;
    }

    /********************
     * Public Functions *
     ********************/

    /**
     * Supplier posts a new job
     * @param paymentToken ERC20 token from the whitelist.
     * @param bountyValue amount of paymentToken
     * @param requiredDeposit min % of bountyValue that an engineer needs to deposit to start the job
     * @param metadataCid IFPS CID with job description & extra data.
     */
    function postJob(
        IERC20 paymentToken,
        uint256 bountyValue,
        uint256 requiredDeposit,
        string memory metadataCid
    ) external onlyWhitelisted(paymentToken) {
        require(bountyValue >= MINIMUM_BOUNTY, "Minimum bounty not provided");
        require(requiredDeposit >= MINIMUM_DEPOSIT, "Minimum deposit not provided");
        require(requiredDeposit <= bountyValue, "Deposit too large");

        // receive funds
        receiveFunds(paymentToken, msg.sender, bountyValue);

        // assign newJobId from state
        ++jobCount;
        uint256 newJobId = jobCount;

        // update state
        jobs[newJobId].supplier = msg.sender;
        jobs[newJobId].token = paymentToken;
        jobs[newJobId].bounty = bountyValue;
        jobs[newJobId].state = States.Available;
        jobs[newJobId].requiredDeposit = requiredDeposit;

        // save the job meta data
        emit JobPosted(newJobId, metadataCid);

        // emit JobSupplied to map the supplier to the job
        emit JobSupplied(msg.sender, newJobId);
    }

    // engineer starts a posted job
    function startJob(uint256 jobId, uint256 deposit) external requiresJobState(jobId, States.Available) {
        // require deposit payment
        require(deposit >= jobs[jobId].requiredDeposit, "Minimum payment not provided");
        // can't accept your own job
        require(msg.sender != jobs[jobId].supplier, "Address may not be job poster");

        receiveFunds(jobs[jobId].token, msg.sender, deposit);

        // update state
        jobs[jobId].engineer = msg.sender;
        jobs[jobId].deposit = deposit;
        jobs[jobId].startTime = block.timestamp;
        jobs[jobId].state = States.Started;

        emit JobStarted(msg.sender, jobId);
    }

    // engineer marks a job as completed
    function completeJob(uint256 jobId) external requiresJobState(jobId, States.Started) onlyEngineer(jobId) {
        jobs[jobId].state = States.Completed;
        jobs[jobId].completedTime = block.timestamp;

        emit JobCompleted(jobId);
    }

    // job is approved by the supplier and paid out
    function approveJob(uint256 jobId) external requiresJobState(jobId, States.Completed) onlySupplier(jobId) {
        jobs[jobId].state = States.FinalApproved;

        (uint256 payoutAmount, uint256 daoTakeAmount) = calculatePayout(jobs[jobId].bounty, jobs[jobId].deposit);
        sendJobPayout(jobs[jobId].token, payoutAmount, daoTakeAmount, jobs[jobId].engineer);

        emit JobApproved(jobId, payoutAmount);
    }

    // job is canceled by supplier before it was started
    function cancelJob(uint256 jobId) public onlySupplier(jobId) requiresJobState(jobId, States.Available) {
        JobData memory job = jobs[jobId];

        jobs[jobId].state = States.FinalCanceledBySupplier;

        sendJobRefund(job);

        emit JobCanceled(jobId);
    }

    // @notice Job is closed if both supplier and engineer agree to cancel the job after it was started
    function closeJob(uint256 jobId) external requiresJobState(jobId, States.Started) {
        // must be supplier or engineer
        JobData memory job = jobs[jobId];

        if (msg.sender == job.supplier) {
            closeJobBySupplier(jobId);
        } else if (msg.sender == job.engineer) {
            closeJobByEngineer(jobId);
        } else {
            revert("Method not available for this caller");
        }

        // if closed by both parties, then change state and refund
        if (jobs[jobId].closedBySupplier && jobs[jobId].closedByEngineer) {
            jobs[jobId].state = States.FinalMutualClose;
            sendJobRefund(job);

            emit JobClosed(jobId);
        }
    }

    function completeTimedOutJob(uint256 jobId) external requiresJobState(jobId, States.Completed) onlyEngineer(jobId) {
        require(
            block.timestamp - jobs[jobId].completedTime >= COMPLETED_TIMEOUT_SECONDS,
            "Job still in approval time window"
        );

        jobs[jobId].state = States.FinalNoResponse;

        (uint256 payoutAmount, uint256 daoTakeAmount) = calculatePayout(jobs[jobId].bounty, jobs[jobId].deposit);
        sendJobPayout(jobs[jobId].token, payoutAmount, daoTakeAmount, jobs[jobId].engineer);

        emit JobTimeoutPayout(jobId, payoutAmount);
    }

    function disputeJob(uint256 jobId) external onlySupplier(jobId) {
        require(
            jobs[jobId].state == States.Started || jobs[jobId].state == States.Completed,
            "Method not available for job state"
        );

        jobs[jobId].state = States.Disputed;

        emit JobDisputed(jobId);
    }

    function resolveDisputeForSupplier(uint256 jobId) external onlyResolver requiresJobState(jobId, States.Disputed) {
        jobs[jobId].state = States.FinalDisputeResolvedForSupplier;

        (uint256 payoutAmount, uint256 daoTakeAmount) = calculateFullDisputeResolutionPayout(
            jobs[jobId].bounty,
            jobs[jobId].deposit
        );
        sendJobPayout(jobs[jobId].token, payoutAmount, daoTakeAmount, jobs[jobId].supplier);

        emit JobDisputeResolved(jobId, 0);
    }

    function resolveDisputeForEngineer(uint256 jobId) external onlyResolver requiresJobState(jobId, States.Disputed) {
        jobs[jobId].state = States.FinalDisputeResolvedForEngineer;

        (uint256 payoutAmount, uint256 daoTakeAmount) = calculateFullDisputeResolutionPayout(
            jobs[jobId].bounty,
            jobs[jobId].deposit
        );
        sendJobPayout(jobs[jobId].token, payoutAmount, daoTakeAmount, jobs[jobId].engineer);

        emit JobDisputeResolved(jobId, BASE_PERCENTAGE);
    }

    function resolveDisputeWithCustomSplit(uint256 jobId, uint256 engineerAmountPct)
        external
        onlyResolver
        requiresJobState(jobId, States.Disputed)
    {
        require(engineerAmountPct >= MINIMUM_SPLIT_CHUNK_PERCENTAGE, "Percentage too low");
        require(engineerAmountPct <= BASE_PERCENTAGE - MINIMUM_SPLIT_CHUNK_PERCENTAGE, "Percentage too high");

        jobs[jobId].state = States.FinalDisputeResolvedWithSplit;

        JobData memory job = jobs[jobId];

        (
            uint256 supplierPayoutAmount,
            uint256 engineerPayoutAmount,
            uint256 daoTakeAmount
        ) = calculateSplitDisputeResolutionPayout(job.bounty, job.deposit, engineerAmountPct);
        sendSplitJobPayout(job, supplierPayoutAmount, engineerPayoutAmount, daoTakeAmount);

        emit JobDisputeResolved(jobId, engineerAmountPct);
    }

    // Used to prevent illegal activity
    function reportJob(uint256 jobId, string memory metadataCid) external {
        JobData memory job = jobs[jobId];

        require(job.state == States.Available || job.state == States.Started, "Method not available for job state");

        reports[jobId].reporter = msg.sender;
        reports[jobId].previousState = job.state;

        jobs[jobId].state = States.Reported;

        receiveFunds(REPORT_TOKEN, msg.sender, REPORT_DEPOSIT);

        emit JobReported(jobId, msg.sender, metadataCid);
    }

    function declineReport(uint256 jobId, string memory metadataCid) external onlyResolver requiresJobState(jobId, States.Reported) {
        address reporter = reports[jobId].reporter;

        // move the job back to the previous state
        jobs[jobId].state = reports[jobId].previousState;

        sendFunds(REPORT_TOKEN, daoTreasury, REPORT_DEPOSIT);
        emit JobReportDeclined(jobId, reporter, metadataCid);
    }

    function acceptReport(uint256 jobId, string memory metadataCid) external onlyResolver requiresJobState(jobId, States.Reported) {
        JobData memory job = jobs[jobId];

        address reporter = reports[jobId].reporter;

        jobs[jobId].state = States.FinalDelisted;

        uint256 rewardAmount = (job.bounty * REPORT_REWARD_PERCENT) / BASE_PERCENTAGE;
        uint256 refundAmount = job.bounty - rewardAmount;

        sendFunds(job.token, reporter, REPORT_DEPOSIT + rewardAmount);
        sendFunds(job.token, job.supplier, refundAmount);

        if (job.deposit > 0) {
            sendFunds(job.token, job.engineer, job.deposit);
        }

        emit JobDelisted(jobId, reporter, metadataCid);
    }

    function getAllPaymentTokens() external view returns (IERC20[] memory tokens) {
        uint256 l = tokensList.length;
        tokens = new IERC20[](l);
        for (uint256 i = 0; i < l; i++) {
            tokens[i] = tokensList[i];
        }
    }

    /**
     * Calculates the amounts that the engineer & dao will receive after job completion
     * @param jobId of the job.
     */
    function getJobPayouts(uint256 jobId)
        external
        view
        returns (
            uint256 forEngineer,
            uint256 forEngineerNoDeposit,
            uint256 forDao
        )
    {
        (forEngineer, forDao) = calculatePayout(jobs[jobId].bounty, jobs[jobId].deposit);
        forEngineerNoDeposit = forEngineer - jobs[jobId].deposit;
    }

    /**
     * Calculates the amounts that the engineer & dao will receive after job completion
     * @param jobId of the job.
     */
    function getDisputePayouts(uint256 jobId) external view returns (uint256 forWinner, uint256 forDao) {
        (forWinner, forDao) = calculateFullDisputeResolutionPayout(jobs[jobId].bounty, jobs[jobId].deposit);
    }

    /****************************
     * DAO Management Functions *
     ****************************/
    // TODO: what if someone sends a token by mistake to this contract ?
    // TODO: function withdraw

    function updatePaymentTokens(IERC20 token, bool enable) external onlyOwner {
        require(!enable || paymentTokens[token] != true, "Already added !");
        paymentTokens[token] = enable;
        if (enable) {
            tokensList.push(token);
        } else {
            removeToken(token);
        }
        emit PaymentTokensUpdated(token, enable);
    }

    // TODO: all these functions can either be with a Timelocker or with constrained values (see setJobTimeout).
    // TODO: So that people don't have to trust us
    function setMinBounty(uint256 newValue) external onlyOwner {
        MINIMUM_BOUNTY = newValue;
    }

    function setDaoFee(uint256 newValue) external onlyOwner {
        require(newValue <= MAX_DAO_FEE, "Value is too high");
        DAO_FEE = newValue;
    }

    function setResolutionFee(uint256 newValue) external onlyOwner {
        require(newValue <= MAX_RESOLUTION_FEE_PERCENTAGE, "Value is too high");
        RESOLUTION_FEE_PERCENTAGE = newValue;
    }

    function setJobTimeout(uint256 newValue) external onlyOwner {
        require(newValue >= MAX_COMPLETED_TIMEOUT_SECONDS, "Value is too low");
        COMPLETED_TIMEOUT_SECONDS = newValue;
    }

    function setDaoTreasury(address addr) external onlyOwner {
        daoTreasury = addr;
    }

    function setResolver(address addr) external onlyOwner {
        disputeResolver = addr;
    }

    function setReportDeposit(uint256 newValue) external onlyOwner {
        require(newValue <= MAX_REPORT_DEPOSIT, "Value is too high");
        REPORT_DEPOSIT = newValue;
    }

    function setReportToken(IERC20 newToken) external onlyOwner {
        REPORT_TOKEN = newToken;
    }

    function setReportReward(uint256 newPercent) external onlyOwner {
        require(newPercent <= MAX_REPORT_REWARD_PERCENT, "Value is too high");
        REPORT_REWARD_PERCENT = newPercent;
    }

    /**********************
     * Internal Functions *
     **********************/

    function closeJobBySupplier(uint256 jobId) internal {
        require(jobs[jobId].closedBySupplier == false, "Close request already received");
        jobs[jobId].closedBySupplier = true;

        emit JobClosedBySupplier(jobId);
    }

    function closeJobByEngineer(uint256 jobId) internal {
        require(jobs[jobId].closedByEngineer == false, "Close request already received");
        jobs[jobId].closedByEngineer = true;

        emit JobClosedByEngineer(jobId);
    }

    function sendJobRefund(JobData memory job) internal {
        sendFunds(job.token, job.supplier, job.bounty);

        if (job.deposit > 0) {
            sendFunds(job.token, job.engineer, job.deposit);
        }
    }

    function calculatePayout(uint256 bounty, uint256 deposit)
        internal
        view
        returns (uint256 payoutAmount, uint256 daoTakeAmount)
    {
        // Take X% from provider bounty
        daoTakeAmount = (bounty * DAO_FEE) / BASE_PERCENTAGE;
        payoutAmount = (bounty - daoTakeAmount) + deposit;
    }

    function calculateFullDisputeResolutionPayout(uint256 bounty, uint256 deposit)
        internal
        view
        returns (uint256 payoutAmount, uint256 daoTakeAmount)
    {
        uint256 resolutionPayout = bounty + deposit;

        daoTakeAmount = (resolutionPayout * RESOLUTION_FEE_PERCENTAGE) / BASE_PERCENTAGE;
        payoutAmount = resolutionPayout - daoTakeAmount;
    }

    function sendJobPayout(
        IERC20 token,
        uint256 payoutAmount,
        uint256 daoTakeAmount,
        address destination
    ) internal {
        sendFunds(token, destination, payoutAmount);
        sendFunds(token, daoTreasury, daoTakeAmount);
    }

    function calculateSplitDisputeResolutionPayout(
        uint256 bounty,
        uint256 deposit,
        uint256 engineerAmountPct
    )
        internal
        view
        returns (
            uint256 supplierPayoutAmount,
            uint256 engineerPayoutAmount,
            uint256 daoTakeAmount
        )
    {
        uint256 resolutionPayout = bounty + deposit;

        daoTakeAmount = (resolutionPayout * RESOLUTION_FEE_PERCENTAGE) / BASE_PERCENTAGE;

        uint256 totalPayoutAmount = resolutionPayout - daoTakeAmount;
        engineerPayoutAmount = (totalPayoutAmount * engineerAmountPct) / BASE_PERCENTAGE;
        supplierPayoutAmount = totalPayoutAmount - engineerPayoutAmount;
    }

    function sendSplitJobPayout(
        JobData memory job,
        uint256 supplierPayoutAmount,
        uint256 engineerPayoutAmount,
        uint256 daoTakeAmount
    ) internal {
        sendFunds(job.token, job.supplier, supplierPayoutAmount);
        sendFunds(job.token, job.engineer, engineerPayoutAmount);
        sendFunds(job.token, daoTreasury, daoTakeAmount);
    }

    function receiveFunds(
        IERC20 _paymentToken,
        address _from,
        uint256 amount
    ) internal {
        _paymentToken.safeTransferFrom(_from, address(this), amount);
    }

    function sendFunds(
        IERC20 _paymentToken,
        address _to,
        uint256 amount
    ) internal {
        _paymentToken.safeTransfer(_to, amount);
    }

    // removes an item from the list & changes the length of the array
    function removeToken(IERC20 tokenAddr) internal returns (bool) {
        uint256 l = tokensList.length;

        if (l == 0) {
            return false;
        }

        if (tokensList[l - 1] == tokenAddr) {
            tokensList.pop();
            return true;
        }

        bool found = false;
        for (uint256 i = 0; i < l - 1; i++) {
            if (tokensList[i] == tokenAddr) {
                found = true;
            }
            if (found) {
                tokensList[i] = tokensList[i + 1];
            }
        }
        if (found) {
            tokensList.pop();
        }
        return found;
    }

    receive() external payable {
        revert("Native token not accepted");
    }
}
