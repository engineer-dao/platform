import { JobState } from 'enums/JobState';

export interface IJobFilter {
  fields: {
    id?: string;
    supplier?: string;
    engineer?: string;
    state?: JobState;
    paymentTokenName?: string;
  };
}
