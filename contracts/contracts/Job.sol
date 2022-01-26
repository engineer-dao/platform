//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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

    uint public jobCount;
    mapping(uint => JobData) public jobs;

    uint public daoEscrow;

    enum States {
        DoesNotExist,
        Available,
        Started
    }

    uint constant MINIMUM_BOUNTY = 0.1 ether;
    uint constant BUY_IN_PERCENTAGE = 1000; // out of 10000
    uint constant BASE_PERCENTAGE = 10000; // for integer percentage math

    event JobPosted(uint indexed jobId, string jobMetaData);
    event JobSupplied(address indexed supplier, uint jobId);
    event JobStarted(address indexed engineer, uint jobId);

    constructor() {
        jobCount = 0;
        daoEscrow = 0;
    }

    // modifiers

    modifier requiresPayment(uint minimumPaymentAmount) {
        require(msg.value >= minimumPaymentAmount, "Minimum payment not provided");
        _;
    }

    modifier requiresJobState(uint jobId, States requiredState) {
        require(jobs[jobId].state == requiredState, "Method not available for this job");
        _;
    }

    // public functions

    function postJob(string memory jobMetaData) public payable requiresPayment(MINIMUM_BOUNTY) {
        // assign newJobId from state
        ++jobCount;
        uint newJobId = jobCount;

        // update state
        jobs[newJobId] = JobData({
            supplier: msg.sender,
            bounty: msg.value,
            engineer: address(0),
            buyIn: 0,
            postTime: block.timestamp,
            startTime: 0,
            state: States.Available
        });

        daoEscrow += msg.value;

        // save the job meta data
        emit JobPosted(newJobId, jobMetaData);
        
        // emit JobSupplied to map the supplier to the job
        emit JobSupplied(msg.sender, newJobId);
    }

    function startJob(uint jobId) public payable requiresJobState(jobId, States.Available) {
        // require buy-in payment
        uint requiredBuyIn = jobs[jobId].bounty * BUY_IN_PERCENTAGE / BASE_PERCENTAGE;
        require(msg.value >= requiredBuyIn, "Minimum payment not provided");

        // can't accept your own job
        require(msg.sender != jobs[jobId].supplier, "Address may not be job poster");

        // update state
        jobs[jobId].engineer = msg.sender;
        jobs[jobId].buyIn = msg.value;
        jobs[jobId].startTime = block.timestamp;
        jobs[jobId].state = States.Started;

        daoEscrow += msg.value;
    }
}
