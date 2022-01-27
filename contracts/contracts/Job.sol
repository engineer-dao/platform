//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Job {

    struct JobData {
        address supplier;
        uint bounty;
        address engineer;
        uint buyIn;

        uint postTime;
        uint startTime;

        States state;
    }

    address public paymentToken;

    uint public jobCount;
    mapping(uint => JobData) public jobs;

    uint public daoEscrow;

    enum States {
        DoesNotExist,
        Available,
        Started,
        FinalCanceledBySupplier
    }

    uint constant MINIMUM_BOUNTY = 50000000000000000000; // 50 paymentTokens ($50)
    uint constant BUY_IN_PERCENTAGE = 1000; // out of 10000
    uint constant BASE_PERCENTAGE = 10000; // for integer percentage math

    event JobPosted(uint indexed jobId, string jobMetaData);
    event JobSupplied(address indexed supplier, uint jobId);
    event JobStarted(address indexed engineer, uint jobId);

    constructor(address _paymentToken) {
        paymentToken = _paymentToken;
        jobCount = 0;
        daoEscrow = 0;
    }

    // modifiers

    modifier requiresPayment(uint amount, uint minimumPaymentAmount) {
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

    modifier requiresSupplier(uint jobId) {
        require(jobs[jobId].supplier == msg.sender, "Method not available for this caller");
        _;
    }

    // public functions

    function postJob(uint bountyValue, string memory jobMetaData) public requiresApproval(bountyValue) requiresPayment(bountyValue, MINIMUM_BOUNTY) {
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
            buyIn: 0,
            postTime: block.timestamp,
            startTime: 0,
            state: States.Available
        });

        daoEscrow += bountyValue;

        // save the job meta data
        emit JobPosted(newJobId, jobMetaData);
        
        // emit JobSupplied to map the supplier to the job
        emit JobSupplied(msg.sender, newJobId);
    }

    function startJob(uint jobId, uint buyIn) public requiresJobState(jobId, States.Available) {
        // require buy-in payment
        uint requiredBuyIn = jobs[jobId].bounty * BUY_IN_PERCENTAGE / BASE_PERCENTAGE;
        require(buyIn >= requiredBuyIn, "Minimum payment not provided");

        receiveFunds(msg.sender, buyIn);

        // can't accept your own job
        require(msg.sender != jobs[jobId].supplier, "Address may not be job poster");

        // update state
        jobs[jobId].engineer = msg.sender;
        jobs[jobId].buyIn = buyIn;
        jobs[jobId].startTime = block.timestamp;
        jobs[jobId].state = States.Started;

        daoEscrow += buyIn;
    }

    function cancelJob(uint jobId) public requiresJobState(jobId, States.Available) requiresSupplier(jobId) {
        jobs[jobId].state = States.FinalCanceledBySupplier;

        sendJobRefund(jobId);
    }

    //

    function sendJobRefund(uint jobId) internal {
        sendFunds(address(jobs[jobId].supplier), jobs[jobId].bounty);
        daoEscrow = daoEscrow - jobs[jobId].bounty;

        if (jobs[jobId].buyIn > 0) {
            sendFunds(address(jobs[jobId].engineer), jobs[jobId].buyIn);
            daoEscrow = daoEscrow - jobs[jobId].buyIn;
        }
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
