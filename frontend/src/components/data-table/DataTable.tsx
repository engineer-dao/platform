import DataTableItemChips from './row-types/DataTableItemChips';
// import DataTableItemCurrency from './row-types/DataTableItemCurrency';
import DataTableItemFiles from './row-types/DataTableItemFiles';
import DataTableItemText from './row-types/DataTableItemText';
import { IJobData } from 'interfaces/IJobData';
import { contractData as mockContractData } from 'mocks/contractData';

interface IDataTableProps {
  contract: IJobData;
}

interface IAttachment {
  filename: string;
  link: string;
}

// interface ICurrency {
//   crypto_value: number;
//   crypto_suffix: string;
//   fiat_value?: number;
//   fiat_suffix?: string;
// }

const DataTable: React.FC<IDataTableProps> = (props) => {
  const { contract } = props;

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <DataTableItemText label="Supplier" value={contract.supplier} />
          <DataTableItemText label="Description" value={contract.description} />
          <DataTableItemText
            label="Acceptance Criteria"
            value={contract.acceptanceCriteria}
          />
          <DataTableItemText label="Contact Information" value="-" />
          <DataTableItemText
            label={mockContractData[4].label}
            value={mockContractData[4].value as string}
          />
          <DataTableItemChips
            label={mockContractData[5].label}
            value={mockContractData[5].value as string[]}
          />
          <DataTableItemChips
            label={mockContractData[6].label}
            value={mockContractData[6].value as string[]}
            chipColor="bg-yellow-200 text-yellow-800"
          />
          <DataTableItemChips
            label={mockContractData[7].label}
            value={mockContractData[7].value as string[]}
            chipColor="bg-cyan-200 text-cyan-800"
          />
          <DataTableItemFiles
            label={mockContractData[8].label}
            value={mockContractData[8].value as IAttachment[]}
          />
          {/*          <DataTableItemCurrency
            label="Bounty"
            value={mockContractData[9].value as ICurrency}
          />
          <DataTableItemCurrency
            label={mockContractData[10].label}
            value={mockContractData[10].value as ICurrency}
          />
          <DataTableItemCurrency
            label={mockContractData[11].label}
            value={mockContractData[11].value as ICurrency}
            totalRow
          />
*/}
        </dl>
      </div>
    </div>
  );
};

export default DataTable;
