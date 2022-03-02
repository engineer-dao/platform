import {
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  KeyIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { ICreateContractForm } from './form/ICreateContractForm';

const OptionsSummary = ({ data }: { data: ICreateContractForm }) => {
  dayjs.extend(duration);

  const endDate = dayjs(data?.endDate);
  const now = dayjs();
  const days = dayjs.duration(endDate.diff(now)).asDays().toFixed(0);

  return (
    <>
      <div className="flex">
        <CheckCircleIcon
          className="mr-1 h-5 w-5 text-green-400"
          aria-hidden="true"
        />
        <p className="text-sm font-normal leading-5">Available</p>
      </div>
      {data.endDate && (
        <div className="mt-2 flex">
          <ClockIcon
            className="mr-1 h-5 w-5 text-green-400"
            aria-hidden="true"
          />
          <p className="text-sm font-normal leading-5">{days} Days</p>
        </div>
      )}
      {!!data?.labels?.length && (
        <div className="mt-2 flex">
          <CubeIcon
            className="mr-1 h-5 w-5 text-green-400"
            aria-hidden="true"
          />
          <p className="text-sm font-normal leading-5">
            {data.labels.map((item) => item.name).join(', ')}
          </p>
        </div>
      )}
      {!!data?.acceptanceTests?.length && (
        <div className="mt-2 flex">
          <KeyIcon className="mr-1 h-5 w-5 text-green-400" aria-hidden="true" />
          <p className="text-sm font-normal leading-5">
            {data.acceptanceTests.map((item) => item.name).join(', ')}
          </p>
        </div>
      )}
      {!!data?.identity?.length && (
        <div className="mt-2 flex">
          <UserGroupIcon
            className="mr-1 h-5 w-5 text-green-400"
            aria-hidden="true"
          />
          <p className="text-sm font-normal leading-5">
            {data.identity.map((item) => item.name).join(', ')}
          </p>
        </div>
      )}
    </>
  );
};

export default OptionsSummary;
