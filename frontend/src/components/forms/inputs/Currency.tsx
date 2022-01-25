interface ICurrencyProps {
  id: string;
  label: string;
  placeholder?: string;
  prefix?: string;
}

const Currency: React.FC<ICurrencyProps> = (props) => {
  const { id, label, placeholder, prefix = '$' } = props;

  return (
    <div className="relative mt-1 rounded-md shadow-sm">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 sm:text-sm">{prefix}</span>
      </div>
      <input
        type="text"
        id={id}
        className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        placeholder={placeholder || '0'}
        aria-describedby="price-currency"
      />
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <span className="text-gray-500 sm:text-sm" id="price-currency">
          {label}
        </span>
      </div>
    </div>
  );
};

export default Currency;
