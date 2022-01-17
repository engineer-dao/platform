import DataTableItemChips from './row-types/DataTableItemChips';
import DataTableItemCurrency from './row-types/DataTableItemCurrency';
import DataTableItemFiles from './row-types/DataTableItemFiles';
import DataTableItemText from './row-types/DataTableItemText';

interface IDataTableProps {
  data: any[];
}

const DataTable: React.FC<IDataTableProps> = (props) => {
  const { data } = props;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <DataTableItemText label={data[0].label} value={data[0].value} />
          <DataTableItemText label={data[1].label} value={data[1].value} />
          <DataTableItemText label={data[2].label} value={data[2].value} />
          <DataTableItemText label={data[3].label} value={data[3].value} />
          <DataTableItemText label={data[4].label} value={data[4].value} />
          <DataTableItemChips label={data[5].label} value={data[5].value} />
          <DataTableItemChips
            label={data[6].label}
            value={data[6].value}
            chipColor="bg-yellow-200 text-yellow-800"
          />
          <DataTableItemChips
            label={data[7].label}
            value={data[7].value}
            chipColor="bg-cyan-200 text-cyan-800"
          />
          <DataTableItemFiles label={data[8].label} value={data[8].value} />
          <DataTableItemCurrency label={data[9].label} value={data[9].value} />
          <DataTableItemCurrency
            label={data[10].label}
            value={data[10].value}
          />
          <DataTableItemCurrency
            label={data[11].label}
            value={data[11].value}
            totalRow
          />
        </dl>
      </div>
    </div>
  );
};

export default DataTable;
