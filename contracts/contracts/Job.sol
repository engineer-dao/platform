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

    // 10%
    uint256 public DEFAULT_DEPOSIT_PERCENTAGE = 1000;
    // TODO: yet to be decided
    // 10%
    uint256 public DAO_FEE = 1000;
    // 6%
    uint256 public RESOLUTION_FEE_PERCENTAGE = 600;
    // 1%
    uint256 public MINIMUM_SPLIT_CHUNK_PERCENTAGE = 100;
    // Number of seconds after job is completed before job is awarded to engineer
    uint256 public COMPLETED_TIMEOUT_SECONDS = 7 days;

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

        // Min % of bounty that an engineer needs to deposit to start the job
        uint256 depositPct;
        uint256 deposit;
        uint256 bounty;
        uint256 startTime;
        uint256 completedTime;
    }

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

    uint256 public jobCount;
    mapping(uint256 => JobData) public jobs;

    /**********
     * Events *
     **********/

    event JobPosted(uint256 indexed jobId, string jobMetaData);
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
    event JobDisputeResolved(uint256 indexed jobId, States finalState);
    event PaymentTokensUpdated(IERC20 indexed token, bool indexed value);

    /***************
     * Constructor *
     ***************/

    constructor(IERC20 _initialPaymentToken) {
        paymentTokens[_initialPaymentToken] = true;
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

    // TODO: Do we really need this ?
    modifier requiresApproval(IERC20 _paymentToken, uint256 amount) {
        require(_paymentToken.allowance(msg.sender, address(this)) >= amount, "Spending approval is required");
        _;
    }

    modifier requiresJobState(uint256 jobId, States requiredState) {
        require(jobs[jobId].state == requiredState, "Method not available for job state");
        _;
    }

    modifier requiresOneOfJobStates(
        uint256 jobId,
        States requiredState1,
        States requiredState2
    ) {
        require(
            jobs[jobId].state == requiredState1 || jobs[jobId].state == requiredState2,
            "Method not available for job state"
        );
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
     * @param depositPct min % of bountyValue that an engineer needs to deposit to start the job
     * @param jobMetaData ifps url with job description & extra data.
     */
    function postJob(
        IERC20 paymentToken,
        uint256 bountyValue,
        uint256 depositPct,
        string memory jobMetaData
    ) external onlyWhitelisted(paymentToken) requiresApproval(paymentToken, bountyValue) {
        // TODO: add jobMetaData length check after ipfs integration is ready.
        require(bountyValue >= MINIMUM_BOUNTY, "Minimum bounty not provided");
        require(depositPct < BASE_PERCENTAGE, "Deposit percent is too high");

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
        if (depositPct == 0) {
            jobs[newJobId].depositPct = DEFAULT_DEPOSIT_PERCENTAGE;
        } else {
            jobs[newJobId].depositPct = depositPct;
        }

        // save the job meta data
        emit JobPosted(newJobId, jobMetaData);

        // emit JobSupplied to map the supplier to the job
        emit JobSupplied(msg.sender, newJobId);
    }

    // engineer starts a posted job
    function startJob(uint256 jobId, uint256 deposit) external requiresJobState(jobId, States.Available) {
        // require deposit payment
        uint256 minBuyIn = (jobs[jobId].bounty * jobs[jobId].depositPct) / BASE_PERCENTAGE;
        require(deposit >= minBuyIn, "Minimum payment not provided");
        // can't accept your own job
        require(msg.sender != jobs[jobId].supplier, "Address may not be job poster");

        receiveFunds(jobs[jobId].token, msg.sender, deposit);

        // update state
        jobs[jobId].engineer = msg.sender;
        jobs[jobId].deposit = deposit;
        jobs[jobId].startTime = block.timestamp;
        jobs[jobId].state = States.Started;
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

        // TODO: delete jobs[jobId] first ? Do we need to store all the data ??
        // TODO: How would the supplier-reopen flow work  ?
        // TODO: Should the metadata be stored in events ?
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

    function disputeJob(uint256 jobId)
    external
    requiresOneOfJobStates(jobId, States.Started, States.Completed)
    onlySupplier(jobId)
    {
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

        emit JobDisputeResolved(jobId, States.FinalDisputeResolvedForSupplier);
    }

    function resolveDisputeForEngineer(uint256 jobId) external onlyResolver requiresJobState(jobId, States.Disputed) {
        jobs[jobId].state = States.FinalDisputeResolvedForEngineer;

        (uint256 payoutAmount, uint256 daoTakeAmount) = calculateFullDisputeResolutionPayout(
            jobs[jobId].bounty,
            jobs[jobId].deposit
        );
        sendJobPayout(jobs[jobId].token, payoutAmount, daoTakeAmount, jobs[jobId].engineer);

        emit JobDisputeResolved(jobId, States.FinalDisputeResolvedForEngineer);
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

        emit JobDisputeResolved(jobId, States.FinalDisputeResolvedWithSplit);
    }

    // TODO: Do we need any other convenient getters ?

    function getAllPaymentTokens() external view returns (IERC20[] memory tokens){
        uint l = tokensList.length;
        tokens = new IERC20[](l);
        for (uint i = 0; i < l; i++) {
            tokens[i] = tokensList[i];
        }
    }

    /****************************
     * DAO Management Functions *
     ****************************/

    // TODO: what if someone sends a token by mistake to this contract ?
    // TODO: function withdraw


    function updatePaymentTokens(IERC20 token, bool enable) external onlyOwner {
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

    function setDefaultDeposit(uint256 newValue) external onlyOwner {
        DEFAULT_DEPOSIT_PERCENTAGE = newValue;
    }

    function setDaoFee(uint256 newValue) external onlyOwner {
        DAO_FEE = newValue;
    }

    function setResolutionFee(uint256 newValue) external onlyOwner {
        RESOLUTION_FEE_PERCENTAGE = newValue;
    }

    function setMinChunk(uint256 newValue) external onlyOwner {
        MINIMUM_SPLIT_CHUNK_PERCENTAGE = newValue;
    }

    function setJobTimeout(uint256 newValue) external onlyOwner {
        require(newValue >= 3 days, "Constrains !");
        COMPLETED_TIMEOUT_SECONDS = newValue;
    }

    function setDaoTreasury(address addr) external onlyOwner {
        daoTreasury = addr;
    }

    function setResolver(address addr) external onlyOwner {
        disputeResolver = addr;
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
    returns (uint256 payoutAmount, uint256 daoTakeAmount)
    {
        // Take X% from provider bounty
        daoTakeAmount = bounty * DAO_FEE / BASE_PERCENTAGE;
        payoutAmount = (bounty - daoTakeAmount) + deposit;
    }

    function calculateFullDisputeResolutionPayout(uint256 bounty, uint256 deposit)
    internal
    returns (uint256 payoutAmount, uint256 daoTakeAmount)
    {
        uint256 resolutionPayout = bounty + deposit;

        daoTakeAmount = resolutionPayout * RESOLUTION_FEE_PERCENTAGE / BASE_PERCENTAGE;
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
    function removeToken(IERC20 tokenAddr) internal returns (bool){
        uint l = tokensList.length;

        if (l == 0) {
            return false;
        }

        if (tokensList[l - 1] == tokenAddr) {
            tokensList.pop();
            return true;
        }

        bool found = false;
        for (uint i = 0; i < l - 1; i++) {
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
        revert("Don't lock your MATIC !");
    }
}
