import DataTableItemLoading from './row-types/DataTableItemLoading';

const LoadingDataTable = () => {
  const opacityMap = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {opacityMap.map((opacity, index) => (
            <DataTableItemLoading
              key={`data-table-item-loading-${index}`}
              opacity={opacity}
            />
          ))}
        </dl>
      </div>
    </div>
  );
};

export default LoadingDataTable;
