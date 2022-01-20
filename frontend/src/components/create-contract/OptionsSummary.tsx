import {
  CheckCircleIcon,
  ClockIcon,
  CubeIcon,
  KeyIcon,
  UserGroupIcon,
} from '@heroicons/react/outline';
import React from 'react';

const OptionsSummary = () => {
  return (
    <>
      <div className="flex">
        <CheckCircleIcon
          className="h-5 w-5 mr-1 text-green-400"
          aria-hidden="true"
        />
        <p className="text-sm leading-5 font-normal">Available</p>
      </div>
      <div className="flex mt-2">
        <ClockIcon className="h-5 w-5 mr-1 text-green-400" aria-hidden="true" />
        <p className="text-sm leading-5 font-normal">30 Days</p>
      </div>
      <div className="flex mt-2">
        <CubeIcon className="h-5 w-5 mr-1 text-green-400" aria-hidden="true" />
        <p className="text-sm leading-5 font-normal">
          Frontend, React, MaterialUI, HTML, CSS
        </p>
      </div>
      <div className="flex mt-2">
        <KeyIcon className="h-5 w-5 mr-1 text-green-400" aria-hidden="true" />
        <p className="text-sm leading-5 font-normal">
          Manual Testing, Manual Approval, Incremental Review
        </p>
      </div>
      <div className="flex mt-2">
        <UserGroupIcon
          className="h-5 w-5 mr-1 text-green-400"
          aria-hidden="true"
        />
        <p className="text-sm leading-5 font-normal">
          Anon-First, Partially Anon, Optionally Anon
        </p>
      </div>
    </>
  );
};

export default OptionsSummary;
