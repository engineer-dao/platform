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
