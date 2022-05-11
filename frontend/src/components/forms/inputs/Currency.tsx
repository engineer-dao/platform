import React from 'react';
import { Field, useFormikContext } from 'formik';
import { SupportedTokens } from '../../../enums/SupportedTokens';

interface ICurrencyProps {
  id: string;
  label: string;
  min?: number;
  max?: number;
  placeholder?: string;
  prefix?: string;
}

const Currency: React.FC<ICurrencyProps> = (props) => {
  const { id, label, placeholder, prefix = '$', min, max } = props;
  const { setFieldValue } = useFormikContext();

  const handleSelectChange = (event: React.MouseEvent<HTMLSelectElement>) => {
    setFieldValue('token', (event.target as any).value);
  };

  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <Field
          type="number"
          min={String(min)}
          max={String(max)}
          label={label}
          name={id}
          className="block w-full appearance-none rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeholder || '0'}
          aria-describedby="price-currency"
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <label htmlFor="currency" className="sr-only">
            Token
          </label>
          <Field
            as="select"
            id="token"
            name="token"
            onChange={handleSelectChange}
            className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value={SupportedTokens.ENGI}>ENGI</option>
            <option value={SupportedTokens.USDC}>USDC</option>
          </Field>
        </div>
      </div>
    </div>
  );
};

export default Currency;
