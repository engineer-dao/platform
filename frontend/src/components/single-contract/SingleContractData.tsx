import DataTable from '../data-table/DataTable';
import { IJobData } from 'interfaces/IJobData';
import { useJob } from '../smart-contracts/hooks/useJob';

interface ISingleContractDataProps {
  contract?: IJobData;
}

const SingleContractData: React.FC<ISingleContractDataProps> = (props) => {
  const { job } = useJob();
  const { contract = job } = props;

  return contract ? <DataTable contract={contract} /> : null;
};

export default SingleContractData;
