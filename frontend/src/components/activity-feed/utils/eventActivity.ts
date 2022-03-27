import { IActivityFeedById } from 'components/activity-feed/interfaces/IActivityFeedById';
import { ActivityType } from 'enums/ActivityType';
import { JobState } from 'enums/JobState';
import { DataSnapshot } from 'firebase/database';
import { IActivityFeedItem } from 'interfaces/IActivityFeedItem';
import { IJobData } from 'interfaces/IJobData';
import { formatDateTime } from 'utils/date';

export interface IEventActivity {
  type: string;
  created_at: string;
  args?: any;
}

export const applyEventsToActivityFeedById = (
  activityFeedById: IActivityFeedById,
  job: IJobData,
  eventSnapshots: DataSnapshot[]
) => {
  eventSnapshots.forEach((snapshot) => {
    const uuid = snapshot.key;
    if (uuid) {
      const entry = buildEventActivityFeedEntry(
        job,
        uuid,
        snapshot.val() as IEventActivity
      );
      if (entry) {
        activityFeedById[uuid] = entry;
      }
    }
  });
  return activityFeedById;
};

const buildEventActivityFeedEntry = (
  job: IJobData,
  uuid: string,
  eventActivityItem: IEventActivity
): IActivityFeedItem | undefined => {
  // see if this is a status change
  const { newState, contractUpdateMessage } =
    buildStatusChangeOrContractUpdate(eventActivityItem);

  // if this state, build a StatusChange event entry
  if (newState) {
    return buildStatusChangeActivityFeedEntry(
      job,
      uuid,
      eventActivityItem,
      newState,
      contractUpdateMessage
    );
  }

  // if this is a contract update (e.g. JobClosedBySupplier), return a ContractUpdate event entry
  if (contractUpdateMessage) {
    return buildContractUpdateActivityFeedEntry(
      job,
      uuid,
      eventActivityItem,
      contractUpdateMessage
    );
  }

  return undefined;
};

const buildStatusChangeOrContractUpdate = (
  eventActivityItem: IEventActivity
) => {
  const eventType = eventActivityItem.type;

  let newState: JobState | undefined;
  let contractUpdateMessage: string | undefined;

  switch (eventType) {
    case 'JobPosted':
      newState = JobState.Available;
      break;
    case 'JobStarted':
      newState = JobState.Started;
      break;
    case 'JobCompleted':
      newState = JobState.Completed;
      break;
    case 'JobDisputed':
      newState = JobState.Disputed;
      break;
    case 'JobApproved':
      newState = JobState.FinalApproved;
      break;
    case 'JobCanceled':
      newState = JobState.FinalCanceledBySupplier;
      break;

    case 'JobTimeoutPayout':
      contractUpdateMessage = 'Engineer requested timed out job payment.';
      newState = JobState.FinalNoResponse;
      break;

    case 'JobClosedBySupplier':
      contractUpdateMessage = 'Supplier requested close.';
      break;

    case 'JobClosedByEngineer':
      contractUpdateMessage = 'Engineer requested close.';
      break;

    case 'JobClosed':
      newState = JobState.FinalMutualClose;
      break;

    case 'JobDisputeResolved':
      switch (eventActivityItem.args?.engineerAmountPct) {
        case 0:
          contractUpdateMessage = 'Dispute was resolved for the supplier.';
          break;
        case 10000:
          contractUpdateMessage = 'Dispute was resolved for the engineer.';
          break;
        default:
          contractUpdateMessage = 'Dispute was resolved with a split amount.';
          break;
      }
      newState = JobState.FinalDisputeResolvedForSupplier;
      break;

    case 'JobReportDeclined':
      contractUpdateMessage = 'Report was declined.';
      break;
    case 'JobReported':
      newState = JobState.Reported;
      break;
    case 'JobDelisted':
      newState = JobState.FinalDelisted;
      break;

    default:
      break;
  }

  return { newState, contractUpdateMessage };
};

const buildStatusChangeActivityFeedEntry = (
  job: IJobData,
  uuid: string,
  eventActivityItem: IEventActivity,
  newJobState: JobState,
  contractUpdateMessage?: string
): IActivityFeedItem | undefined => {
  const date = new Date(eventActivityItem.created_at);

  return {
    id: uuid,
    type: ActivityType.StatusChange,
    status: newJobState,
    message: contractUpdateMessage,
    created_at: eventActivityItem.created_at,
    date: formatDateTime(date),
    address: buildAddressFromJobEvent(
      eventActivityItem.type,
      job,
      eventActivityItem
    ),
  };
};

const buildContractUpdateActivityFeedEntry = (
  job: IJobData,
  uuid: string,
  eventActivityItem: IEventActivity,
  contractUpdateMessage: string
): IActivityFeedItem | undefined => {
  const date = new Date(eventActivityItem.created_at);

  return {
    id: uuid,
    type: ActivityType.ContractUpdate,
    message: contractUpdateMessage,
    created_at: eventActivityItem.created_at,
    date: formatDateTime(date),
    address: buildAddressFromJobEvent(
      eventActivityItem.type,
      job,
      eventActivityItem
    ),
  };
};

const buildAddressFromJobEvent = (
  type: string,
  job: IJobData,
  eventActivityItem: IEventActivity
): string | undefined => {
  switch (type) {
    case 'JobPosted':
    case 'JobApproved':
    case 'JobDisputed':
    case 'JobCanceled':
    case 'JobClosedBySupplier':
      return job.supplier;

    case 'JobStarted':
    case 'JobCompleted':
    case 'JobClosedByEngineer':
    case 'JobTimeoutPayout':
      return job.engineer;

    case 'JobReported':
      return job.reporter;
  }

  return undefined;
};
