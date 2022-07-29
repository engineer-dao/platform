import { TypedEvent } from '../contracts-typechain/common';
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
} from '../contracts-typechain/Job';
import crypto from 'crypto';
import { IBlockchainEventRef } from '../interfaces/IBlockchainEventRef';
import { loadAllEvents } from '../services/contract';
import { contractDatabaseRef } from '../services/db';
import { shouldNotifyAboutEvent, notifyEvent } from '../services/discord';
import { getBlockTimestamp, getLatestBlockHeight } from '../services/ethereum';
import { blockNumberToBlockEpoch, groupBlocksByEpoch } from './blockEpoch';
import { getLock } from './lock';

// after this many blocks, assume finality on the blockchain
const FINALITY_BLOCK_COUNT = parseInt(process.env.FINALITY_BLOCK_COUNT || '25');

interface IContractEvent {
  blockNumber: number;
  blockHash: string;
  transactionHash: string;
  logIndex: number;
  event: string;
  jobId: string;
  args?: any;
}

interface INotificationRef {
  uuid: string;
  messageParameters: IContractEvent;
}

export const syncContractEvents = async () => {
  if (!(await getLock('sync-timestamp'))) {
    return;
  }

  let { lastSyncedBlock, latestBlockHeight } = await getPendingSyncRange();

  // sync as long as is needed
  while (latestBlockHeight > lastSyncedBlock) {
    // sync all blocks in this epoch
    await syncContractEventsInBlockRange(
      lastSyncedBlock - FINALITY_BLOCK_COUNT,
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
  const epochBlocks = groupBlocksByEpoch(fromBlock, toBlock);
  for (let [epochBlock, epochEndBlock] of epochBlocks) {
    // track all found blockchain events
    const blockchainEventRefs: IBlockchainEventRef[] = [];
    const notificationEventRefs: INotificationRef[] = [];

    // load all events in this epoch from the blockchain
    //   1-1000, 1001-2000, etc...
    for (const event of await loadAllEvents(epochBlock + 1, epochEndBlock)) {
      const messageParameters = buildEventMessageParameters(event);
      if (messageParameters) {
        const uuid = await addEventToFirebase(messageParameters, epochBlock);
        if (uuid) {
          // save the event notificatoin
          notificationEventRefs.push({ uuid, messageParameters });

          blockchainEventRefs.push({
            uuid,
            id: messageParameters.jobId,
            epoch: blockNumberToBlockEpoch(messageParameters.blockNumber),
          });
        }
      }
    }

    // notify all events in Discord
    await notifyAllEventsOnce(notificationEventRefs);

    // remove all events that were not found
    await removeMissingBlockchainEvents(
      epochBlock,
      epochEndBlock,
      blockchainEventRefs
    );

    // remember the last synced block
    await storeLatestSyncedBlock(epochEndBlock);
  }
};

export const removeMissingBlockchainEvents = async (
  epochBlock: number,
  epochEndBlock: number,
  blockchainEventRefs: IBlockchainEventRef[]
) => {
  // load db uuids
  const allDbEpochBlockRefs = contractDatabaseRef(`epochs/${epochBlock}`);
  const allDbEpochBlockEventReferences = (
    await allDbEpochBlockRefs.get()
  ).val();
  const dbUuids = Object.keys(allDbEpochBlockEventReferences || {});

  // uuids in the blockchain
  const blockchainUuids = blockchainEventRefs.map(
    (event: IBlockchainEventRef) => {
      return event.uuid;
    }
  );

  // find any db events that are not in the blockchain
  const invalidDbUuids = dbUuids.filter(
    (uuid) => !blockchainUuids.includes(uuid)
  );

  // remove all invalid uuids
  for (const invalidUuid of invalidDbUuids) {
    // remove the event first
    const jobId = allDbEpochBlockEventReferences[invalidUuid].id || undefined;
    if (jobId) {
      const eventRef = contractDatabaseRef(`${jobId}/events/${invalidUuid}`);
      await eventRef.remove();
    }

    // now remove the reference
    const epochBlockRef = contractDatabaseRef(
      `epochs/${epochBlock}/${invalidUuid}`
    );
    await epochBlockRef.remove();
  }
};

const getLatestSyncedBlock = async () => {
  const syncedBlockRef = contractDatabaseRef(`latest-synced-block`);

  const snapshot = await syncedBlockRef.get();
  return (
    snapshot.val() ||
    parseInt(process.env.JOB_CONTRACT_STARTING_BLOCK_HEIGHT || '1') - 1
  );
};

const storeLatestSyncedBlock = async (blockNumber: number) => {
  const syncedBlockRef = contractDatabaseRef(`latest-synced-block`);
  await syncedBlockRef.set(blockNumber);
  return blockNumber;
};

const buildEventMessageParameters = (untypedEvent: TypedEvent<any>) => {
  switch (untypedEvent.event) {
    case 'JobPosted':
      const jobPostedEvent = untypedEvent as JobPostedEvent;
      return buildContractEvent(
        untypedEvent,
        jobPostedEvent.args.jobId.toString(),
        {
          metadataCid: jobPostedEvent.args.metadataCid,
        }
      );

    case 'JobStarted':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobStartedEvent).args.jobId.toString()
      );

    case 'JobCompleted':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobCompletedEvent).args.jobId.toString()
      );

    case 'JobApproved':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobApprovedEvent).args.jobId.toString()
      );

    case 'JobCanceled':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobCanceledEvent).args.jobId.toString()
      );

    case 'JobClosed':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobClosedEvent).args.jobId.toString()
      );

    case 'JobClosedByEngineer':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobClosedByEngineerEvent).args.jobId.toString()
      );

    case 'JobClosedBySupplier':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobClosedBySupplierEvent).args.jobId.toString()
      );

    case 'JobDelisted':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobDelistedEvent).args.jobId.toString()
      );

    case 'JobDisputeResolved':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobDisputeResolvedEvent).args.jobId.toString(),
        {
          engineerAmountPct: (untypedEvent as JobDisputeResolvedEvent).args
            .engineerAmountPct,
        }
      );

    case 'JobDisputed':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobDisputedEvent).args.jobId.toString()
      );

    case 'JobReported':
      const jobReportedEvent = untypedEvent as JobReportedEvent;
      return buildContractEvent(
        untypedEvent,
        jobReportedEvent.args.jobId.toString(),
        {
          metadataCid: jobReportedEvent.args.metadataCid,
          reporter: jobReportedEvent.args.reporter,
        }
      );

    case 'JobReportDeclined':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobReportDeclinedEvent).args.jobId.toString()
      );

    case 'JobTimeoutPayout':
      return buildContractEvent(
        untypedEvent,
        (untypedEvent as JobTimeoutPayoutEvent).args.jobId.toString()
      );
  }
};

const buildContractEvent = (
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

const addEventToFirebase = async (
  contractEvent: IContractEvent,
  epochBlock: number
) => {
  const uuid = await createUuid(contractEvent);

  // add to events
  const blockNumber = contractEvent.blockNumber;
  const blockTimestamp = await getBlockTimestamp(blockNumber);

  const eventRef = contractDatabaseRef(`${contractEvent.jobId}/events/${uuid}`);
  const epochBlockRef = contractDatabaseRef(`epochs/${epochBlock}/${uuid}`);

  try {
    // add the id to the epoch
    await epochBlockRef.set({
      id: contractEvent.jobId,
    });

    // set the event by uuid
    await eventRef.set({
      type: contractEvent.event,
      created_at: new Date(blockTimestamp * 1000).toISOString(),
      args: contractEvent.args || null,
    });

    return uuid;
  } catch (e) {
    // an error occurred
    console.error('error: ', e);
  }
};

const notifyAllEventsOnce = async (
  notificationEventRefs: INotificationRef[]
) => {
  for (const notificationEventRef of notificationEventRefs) {
    await notifyEventOnce(
      notificationEventRef.uuid,
      notificationEventRef.messageParameters
    );
  }
};

const notifyEventOnce = async (
  uuid: string,
  messageParameters: IContractEvent
) => {
  if (shouldNotifyAboutEvent(messageParameters.event)) {
    const shortHash = messageParameters.transactionHash.substring(
      messageParameters.transactionHash.length - 20
    );
    const notifyUuid = `${shortHash}-${messageParameters.logIndex}`;
    const notifyRef = contractDatabaseRef(`notifications/${notifyUuid}`);
    const alreadyNotified = (await notifyRef.get()).val();
    if (!alreadyNotified) {
      // notify in Discord
      await notifyEvent(
        messageParameters.event,
        messageParameters.args,
        messageParameters.blockNumber,
        messageParameters.jobId
      );

      // remember that we notified
      notifyRef.set(true);
    }
  }
};

// hash the parameters to a uuid hex
//  this is a fast, non-cryptographically secure hash
const createUuid = async (contractEvent: IContractEvent) => {
  const input = Buffer.from(
    [
      contractEvent.blockHash,
      contractEvent.transactionHash,
      contractEvent.logIndex,
    ].join('/')
  );

  return crypto.createHash('md5').update(input).digest('hex');
};
