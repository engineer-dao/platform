import { CacheKeys } from '../enums/CacheKeys';
import { IJobMetaData } from './IJobData';

export interface IJobCacheEntry {
  [CacheKeys.JOB_META]: IJobMetaData;
  [CacheKeys.VERSION]: number;
  [CacheKeys.TIMESTAMP]: number;
}
