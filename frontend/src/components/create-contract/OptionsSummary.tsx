import { CreateFormValues } from 'components/forms/types';

import {
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  KeyIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';
import React from 'react';

const OptionsSummary = ({ data }: { data: CreateFormValues }) => {
  return (
    <>
      <div className="flex">
        <CheckCircleIcon
          className="mr-1 h-5 w-5 text-green-400"
          aria-hidden="true"
        />
        <p className="text-sm font-normal leading-5">Available</p>
      </div>
      <div className="mt-2 flex">
        <ClockIcon className="mr-1 h-5 w-5 text-green-400" aria-hidden="true" />
        <p className="text-sm font-normal leading-5">30 Days</p>
      </div>
      <div className="mt-2 flex">
        <CubeIcon className="mr-1 h-5 w-5 text-green-400" aria-hidden="true" />
        <p className="text-sm font-normal leading-5">
          Frontend, React, MaterialUI, HTML, CSS
        </p>
      </div>
      <div className="mt-2 flex">
        <KeyIcon className="mr-1 h-5 w-5 text-green-400" aria-hidden="true" />
        <p className="text-sm font-normal leading-5">
          Manual Testing, Manual Approval, Incremental Review
        </p>
      </div>
      <div className="mt-2 flex">
        <UserGroupIcon
          className="mr-1 h-5 w-5 text-green-400"
          aria-hidden="true"
        />
        <p className="text-sm font-normal leading-5">
          Anon-First, Partially Anon, Optionally Anon
        </p>
      </div>
    </>
  );
};

export default OptionsSummary;
