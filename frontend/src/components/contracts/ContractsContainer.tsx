import { IContract } from '../../interfaces/IContract';
import ContractItem from './ContractItem';

interface IContractsContainer {
  contracts: IContract[];
}

const ContractsContainer: React.FC<IContractsContainer> = (props) => {
  const { contracts } = props;

  return (
    <ul className="grid grid-cols-1 gap-6">
      {contracts.map((item) => (
        <ContractItem key={item.id} contract={item} />
      ))}
    </ul>
  );
};

export default ContractsContainer;
