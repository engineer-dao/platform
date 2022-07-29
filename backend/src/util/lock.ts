import { contractDatabaseRef } from '../services/db';

const THROTTLE_DELAY = parseInt(process.env.THROTTLE_DELAY || '3000');

interface ISettings {
  throttleDelay?: number;
}

export const getLock = async (lockName: string, settings?: ISettings) => {
  const waitStart = Date.now();

  const throttleDelay = settings?.throttleDelay || THROTTLE_DELAY;

  const processTsRef = contractDatabaseRef(lockName);

    while (Date.now() - waitStart < throttleDelay) {
    const snapshot = await processTsRef.get();

    const lastProcessTimestamp = snapshot.val() as number;
    if (isTimedOut(lastProcessTimestamp, throttleDelay)) {
      // get lock and return
      return await acquireLock(lockName, throttleDelay);
    } else {
      // sleep and try again
      const sleepTime = 350;
      await new Promise((r) => setTimeout(r, sleepTime));
    }
  }

  return false;
};

const isTimedOut = (lastProcessTimestamp: number, throttleDelay: number) => {
  return (
    !Number.isFinite(lastProcessTimestamp) ||
    Date.now() - lastProcessTimestamp >= throttleDelay
  );
};

const acquireLock = async (lockName: string, throttleDelay: number) => {
  const processTsRef = contractDatabaseRef(lockName);

  const txResult = await processTsRef.transaction(
    (lastProcessTimestamp) => {
      if (isTimedOut(lastProcessTimestamp, throttleDelay)) {
        lastProcessTimestamp = Date.now();
        return lastProcessTimestamp;
      } else {
        return undefined;
      }
    }
  );

  return txResult.committed;
};
