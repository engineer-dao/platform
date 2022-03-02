import React from 'react';
import { Field } from 'formik';

interface ICurrencyProps {
  id: string;
  label: string;
  tokenName?: string;
  placeholder?: string;
  prefix?: string;
}

const Currency: React.FC<ICurrencyProps> = (props) => {
  const { id, label, tokenName, placeholder, prefix = '$' } = props;

  const token = tokenName || process.env.REACT_APP_PAYMENT_TOKEN_NAME || '';

  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">{prefix}</span>
        </div>

        <Field
          type="number"
          min="1"
          label={label}
          name={id}
          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder || '0'}
          aria-describedby="price-currency"
        />

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {token}
          </span>
        </div>
      </div>
    </label>
  );
};

export default Currency;
