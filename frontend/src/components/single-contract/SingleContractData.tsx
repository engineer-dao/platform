import DataTable from '../data-table/DataTable';
import { IJobData } from 'interfaces/IJobData';

interface ISingleContractDataProps {
  contract: IJobData;
}

const SingleContractData: React.FC<ISingleContractDataProps> = (props) => {
  const { contract } = props;
  return <DataTable contract={contract} />;
};

export default SingleContractData;
