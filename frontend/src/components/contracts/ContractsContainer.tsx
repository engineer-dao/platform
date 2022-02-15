import { IJobData } from 'interfaces/IJobData';
import ContractItem from './ContractItem';

interface IContractsContainer {
  jobs: IJobData[];
}

const ContractsContainer: React.FC<IContractsContainer> = (props) => {
  const { jobs } = props;

  return (
    <ul className="grid grid-cols-1 gap-6">
      {jobs.map((item) => (
        <ContractItem key={item.id} job={item} />
      ))}
    </ul>
  );
};

export default ContractsContainer;
