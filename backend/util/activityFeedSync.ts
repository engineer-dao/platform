import { TypedEvent } from 'contracts-typechain/common';
import {
  JobApprovedEvent,
  JobCanceledEvent,
  JobClosedByEngineerEvent,
  JobClosedBySupplierEvent,
  JobClosedEvent,
  JobCompletedEvent,
  JobDelistedEvent,
  JobDisputedEvent,
  JobDisputeResolvedEvent,
  JobPostedEvent,
  JobReportDeclinedEvent,
  JobReportedEvent,
  JobStartedEvent,
  JobTimeoutPayoutEvent,
} from 'contracts-typechain/Job';
import crypto from 'crypto';
import { get, set } from 'firebase/database';
import { loadAllEvents } from 'services/contract';
import { contractDatabaseRef } from 'services/db';
import { getBlockTimestamp, getLatestBlockHeight } from 'services/ethereum';
import { getLock } from 'util/lock';

// after this many blocks, assume finality on the blockchain
const FINALITY_BLOCK_COUNT = parseInt(process.env.FINALITY_BLOCK_COUNT || '25');

// Sync this many blocks at a time
const SYNC_BLOCK_CHUNK_SIZE = parseInt(
  process.env.SYNC_BLOCK_CHUNK_SIZE || '1000'
);

interface IContractEvent {
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  logIndex: number;
  event: string;
  jobId: string;
  args?: any;
}

export const syncContractEvents = async () => {
  if (!(await getLock('sync-timestamp'))) {
    return;
  }

  // sync as long as is needed
  let { lastSyncedBlock, latestBlockHeight } = await getPendingSyncRange();

  while (latestBlockHeight > lastSyncedBlock) {
    await syncContractEventsInBlockRange(
      Math.max(0, lastSyncedBlock - FINALITY_BLOCK_COUNT),
      latestBlockHeight
    );

    // update the from and to blocks
    lastSyncedBlock = latestBlockHeight;
    latestBlockHeight = await getLatestBlockHeight();
  }
};

const getPendingSyncRange = async () => {
  const lastSyncedBlock = await getLatestSyncedBlock();
  const latestBlockHeight = await getLatestBlockHeight();

  return { lastSyncedBlock, latestBlockHeight };
};

const syncContractEventsInBlockRange = async (
  fromBlock: number,
  toBlock: number
) => {
  let startingBlock = fromBlock + 1;

  // process events in chunks
  while (startingBlock <= toBlock) {
    const chunkSize = Math.min(
      toBlock - startingBlock + 1,
      SYNC_BLOCK_CHUNK_SIZE
    );
    const endingBlock = startingBlock + chunkSize - 1;

    const allEvents = await loadAllEvents(startingBlock, endingBlock);
    allEvents.forEach(async (event) => {
      const messageParameters = buildEventMessageParameters(event);
      if (messageParameters) {
        addEvent(messageParameters);
      }
    });

    // remember the last synced block
    await storeLatestSyncedBlock(endingBlock);

    // update the starting block for the next chunk
    startingBlock = endingBlock + 1;
  }
};
const getLatestSyncedBlock = async () => {
  const syncedBlockRef = contractDatabaseRef(`latest-synced-block`);

  const snapshot = await get(syncedBlockRef);
  return parseInt(
    snapshot.val() || process.env.JOB_CONTRACT_STARTING_BLOCK_HEIGHT || '0'
  );
};

const storeLatestSyncedBlock = async (blockNumber: number) => {
  const syncedBlockRef = contractDatabaseRef(`latest-synced-block`);
  await set(syncedBlockRef, blockNumber);
  return blockNumber;
};

const buildEventMessageParameters = (untypedEvent: TypedEvent<any>) => {
  switch (untypedEvent.event) {
    case 'JobPosted':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobPostedEvent).args.jobId.toString()
      );

    case 'JobStarted':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobStartedEvent).args.jobId.toString()
      );

    case 'JobCompleted':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobCompletedEvent).args.jobId.toString()
      );

    case 'JobApproved':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobApprovedEvent).args.jobId.toString()
      );

    case 'JobCanceled':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobCanceledEvent).args.jobId.toString()
      );

    case 'JobClosed':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobClosedEvent).args.jobId.toString()
      );

    case 'JobClosedByEngineer':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobClosedByEngineerEvent).args.jobId.toString()
      );

    case 'JobClosedBySupplier':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobClosedBySupplierEvent).args.jobId.toString()
      );

    case 'JobDelisted':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobDelistedEvent).args.jobId.toString()
      );

    case 'JobDisputeResolved':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobDisputeResolvedEvent).args.jobId.toString(),
        {
          finalState: (untypedEvent as JobDisputeResolvedEvent).args.finalState,
        }
      );

    case 'JobDisputed':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobDisputedEvent).args.jobId.toString()
      );

    case 'JobReported':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobReportedEvent).args.jobId.toString()
      );

    case 'JobReportDeclined':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobReportDeclinedEvent).args.jobId.toString()
      );

    case 'JobTimeoutPayout':
      return eventParameters(
        untypedEvent,
        (untypedEvent as JobTimeoutPayoutEvent).args.jobId.toString()
      );
  }
};

const eventParameters = (
  genericEvent: TypedEvent<any>,
  jobId: string,
  eventArgs?: any
): IContractEvent => {
  return {
    blockNumber: genericEvent.blockNumber,
    blockHash: genericEvent.blockHash,
    transactionHash: genericEvent.transactionHash,
    logIndex: genericEvent.logIndex,
    event: genericEvent?.event || 'Unknown Event',
    args: eventArgs,
    jobId: jobId,
  };
};

const addEvent = async (contractEvent: IContractEvent) => {
  const uuid = await createUuid(contractEvent);

  // add to events
  const blockTimestmap = await getBlockTimestamp(contractEvent.blockNumber);

  const eventRef = contractDatabaseRef(`${contractEvent.jobId}/events/${uuid}`);

  try {
    // set the event by uuid
    await set(eventRef, {
      type: contractEvent.event,
      created_at: new Date(blockTimestmap * 1000).toISOString(),
      args: contractEvent.args || null,
    });
  } catch (e) {
    // an error occurred
    console.error('error: ', e);
  }
};

// hash the parameters to a uuid hex
//  this is a fast, non-cryptographically secure hash
const createUuid = async (messageParameters: IContractEvent) => {
  const input = Buffer.from(
    [
      messageParameters.blockHash,
      messageParameters.transactionHash,
      messageParameters.logIndex,
    ].join('/')
  );

  return crypto.createHash('md5').update(input).digest('hex');
};
