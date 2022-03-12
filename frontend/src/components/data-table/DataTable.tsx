import DataTableItemChips from './row-types/DataTableItemChips';
import DataTableItemText from './row-types/DataTableItemText';
import { IJobData } from 'interfaces/IJobData';
import { contractData as mockContractData } from 'mocks/contractData';
import DataTableItemCurrency from './row-types/DataTableItemCurrency';
import DataTableItemActions from './row-types/DataTableItemActions';
import LoadingDataTable from './LoadingDataTable';

interface IDataTableProps {
  contract: IJobData;
  loading?: boolean;
}

const DataTable: React.FC<IDataTableProps> = (props) => {
  const { contract, loading } = props;
  const tokenName = process.env.REACT_APP_PAYMENT_TOKEN_NAME || '';

  return loading ? (
    <LoadingDataTable />
  ) : (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <DataTableItemText label="Supplier" value={contract?.supplier} />
          <DataTableItemText label="Engineer" value={contract?.engineer} />
          <DataTableItemText
            label="Description"
            value={contract?.description}
          />
          <DataTableItemText
            label="Acceptance Criteria"
            value={contract.acceptanceCriteria}
          />
          <DataTableItemText
            label="Contact Information"
            value={contract?.contactInformation}
          />
          <DataTableItemText
            label={mockContractData[4].label}
            value={mockContractData[4].value as string}
          />
          <DataTableItemChips label="Labels" value={contract.labels} />
          <DataTableItemChips
            label="Identity Options"
            value={contract.identity}
            chipColor="bg-yellow-200 text-yellow-800"
          />
          <DataTableItemChips
            label="Testing Methodology"
            value={contract.acceptanceTests}
            chipColor="bg-cyan-200 text-cyan-800"
          />
          <DataTableItemCurrency
            label="Bounty"
            value={{ crypto_value: contract.bounty, crypto_suffix: tokenName }}
          />
          <DataTableItemCurrency
            label="Buy-In"
            value={{
              crypto_value: contract.requiredDeposit,
              crypto_suffix: tokenName,
            }}
          />
          <DataTableItemActions
            label="Total Payout"
            value={{
              crypto_value: contract.bounty + contract.requiredDeposit,
              crypto_suffix: tokenName,
            }}
          />
        </dl>
      </div>
    </div>
  );
};

export default DataTable;
