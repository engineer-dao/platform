import { contracts } from '../../mocks/contracts';
import ContractItem from './ContractItem';

const ContractsContainer = () => {
  return (
    <ul className="grid grid-cols-1 gap-6">
      {contracts.map((item) => (
        <ContractItem contract={item} />
      ))}
    </ul>
  );
};

export default ContractsContainer;
