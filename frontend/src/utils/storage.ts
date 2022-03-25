import { CacheKeys } from '../enums/CacheKeys';
import { IJobCacheEntry } from '../interfaces/IJobCacheEntry';
import { IJobMetaData } from '../interfaces/IJobData';

export const CACHE_VERSION = 1;

export const buildJobCacheKey = (jobId: string) => {
  return `job:${jobId}`;
};

export const loadJobMetaDataFromCache = (jobId: string) => {
  let cachedJobMetaData: IJobMetaData | undefined = undefined;
  const storage = window.localStorage;
  const jobCacheKey = buildJobCacheKey(jobId);
  const cachedJobString = storage.getItem(jobCacheKey);
  if (cachedJobString !== null) {
    const cachedJobEntry: IJobCacheEntry = JSON.parse(cachedJobString);
    cachedJobMetaData = cachedJobEntry[CacheKeys.JOB_META];
  }
  return cachedJobMetaData;
};

export const saveJobToCache = (
  jobId: string,
  newCachedJobEntry: IJobCacheEntry
) => {
  const storage = window.localStorage;
  const jobCacheKey = buildJobCacheKey(jobId);
  storage.setItem(jobCacheKey, JSON.stringify(newCachedJobEntry));
};

export const clearJobFromCache = (jobId: string) => {
  const storage = window.localStorage;
  const jobCacheKey = buildJobCacheKey(jobId);
  storage.removeItem(jobCacheKey);
};

export const clearLocalStorage = () => {
  window.localStorage.clear();
};
