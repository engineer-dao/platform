import classNames from 'classnames';

const DataTableItemLoading = (props: { opacity?: string | number }) => {
  const { opacity } = props || {};

  return (
    <div
      className={classNames(
        'w-full animate-pulse py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-6 sm:px-6',
        {
          [`opacity-${String(opacity)}`]: opacity,
        }
      )}
    >
      <dt className="h-5 rounded-sm bg-gray-200 text-sm font-medium text-gray-500" />
      <dd className="mt-1 h-5 rounded-sm bg-gray-200 text-sm text-gray-900 sm:col-span-2 sm:mt-0" />
    </div>
  );
};

export default DataTableItemLoading;
