export enum JobState {
  Available = 1,
  Started = 2,
  Completed = 3,
  Disputed = 4,
  Reported = 5,
  FinalApproved = 6,
  FinalCanceledBySupplier = 7,
  FinalMutualClose = 8,
  FinalNoResponse = 9,
  FinalDisputeResolvedForSupplier = 10,
  FinalDisputeResolvedForEngineer = 11,
  FinalDisputeResolvedWithSplit = 12,
  FinalDelisted = 13,
}

export const JobStateLabels = {
  [JobState.Available]: 'Available',
  [JobState.Started]: 'Started',
  [JobState.Completed]: 'Completed',
  [JobState.Disputed]: 'Disputed',
  [JobState.Reported]: 'Reported',
  [JobState.FinalApproved]: 'Paid',
  [JobState.FinalCanceledBySupplier]: 'Canceled',
  [JobState.FinalMutualClose]: 'Closed',
  [JobState.FinalNoResponse]: 'Paid',
  [JobState.FinalDisputeResolvedForSupplier]: 'Dispute Resolved',
  [JobState.FinalDisputeResolvedForEngineer]: 'Dispute Resolved',
  [JobState.FinalDisputeResolvedWithSplit]: 'Dispute Resolved',
  [JobState.FinalDelisted]: 'Delisted',
};
