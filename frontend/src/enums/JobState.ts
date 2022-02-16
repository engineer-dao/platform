export enum JobState {
  Available = 1,
  Started = 2,
  Completed = 3,
  Disputed = 4,
  FinalApproved = 5,
  FinalCanceledBySupplier = 6,
  FinalMutualClose = 7,
  FinalNoResponse = 8,
  FinalDisputeResolvedForSupplier = 9,
  FinalDisputeResolvedForEngineer = 10,
  FinalDisputeResolvedWithSplit = 11,
}

export const JobStateLabels = {
  [JobState.Available]: 'Available',
  [JobState.Started]: 'Started',
  [JobState.Completed]: 'Completed',
  [JobState.Disputed]: 'Disputed',
  [JobState.FinalApproved]: 'Accepted and Paid',
  [JobState.FinalCanceledBySupplier]: 'Canceled By Supplier',
  [JobState.FinalMutualClose]: 'Closed by Mutual Agreement',
  [JobState.FinalNoResponse]: 'Abandoned with no Response',
  [JobState.FinalDisputeResolvedForSupplier]: 'Dispute Resolved for Supplier',
  [JobState.FinalDisputeResolvedForEngineer]: 'Dispute Resolved for Engineer',
  [JobState.FinalDisputeResolvedWithSplit]: 'Dispute Resolved with Split',
};
