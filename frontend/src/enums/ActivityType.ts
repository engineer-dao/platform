export enum ActivityType {
  Message = 1,
  StatusChange = 2,
  ContractUpdate = 3,
}

export const ActivityTypeLabels = {
  [ActivityType.Message]: 'Message',
  [ActivityType.StatusChange]: 'Status Changed',
  [ActivityType.ContractUpdate]: 'Contract Updated',
};
