import { IDataTableItem } from '../interfaces/IDataTableItem';
import DataTableItem from './DataTableItem';

interface IDataTableProps {
  data: IDataTableItem[];
}

const DataTable: React.FC<IDataTableProps> = (props) => {
  const { data } = props;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          {data.map((item) => (
            <DataTableItem item={item} />
          ))}
        </dl>
      </div>
    </div>
  );
};

export default DataTable;
