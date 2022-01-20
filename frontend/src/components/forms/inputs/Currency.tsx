interface ICurrencyProps {
  id: string;
  label: string;
  placeholder?: string;
  prefix?: string;
}

const Currency: React.FC<ICurrencyProps> = (props) => {
  const { id, label, placeholder, prefix = '$' } = props;

  return (
    <div className="mt-1 relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm">{prefix}</span>
      </div>
      <input
        type="text"
        id={id}
        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
        placeholder={placeholder || '0'}
        aria-describedby="price-currency"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <span className="text-gray-500 sm:text-sm" id="price-currency">
          {label}
        </span>
      </div>
    </div>
  );
};

export default Currency;
