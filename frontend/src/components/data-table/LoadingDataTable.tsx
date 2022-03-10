import DataTableItemLoading from './row-types/DataTableItemLoading';

const LoadingDataTable = () => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <DataTableItemLoading />
          <DataTableItemLoading opacity="25" />
          <DataTableItemLoading opacity="5" />
        </dl>
      </div>
    </div>
  );
};

export default LoadingDataTable;
