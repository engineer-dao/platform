import ContractItem from './ContractItem';

const ContractsContainer = () => {
  const contracts = [
    {
      id: '123',
      title: 'Create a website',
      bounty: 3.4,
      bounty_suffix: 'ETH',
      buy_in: 0.3,
      buy_in_suffix: 'ETH',
      availability: 'Available',
      timeframe: '30 Days',
      technologies: ['HTML', 'CSS', 'React'],
      testing_type: ['Automated', 'Manual'],
      anon_type: ['Anon', 'Semi-Anon', 'Traditional'],
    },
    {
      id: '456',
      title: 'Build a Solidity contract',
      bounty: 2.4,
      bounty_suffix: 'ETH',
      buy_in: 0.3,
      buy_in_suffix: 'ETH',
      availability: 'Available',
      timeframe: '30 Days',
      technologies: ['HTML', 'CSS', 'React'],
      testing_type: ['Automated', 'Manual'],
      anon_type: ['Anon', 'Semi-Anon', 'Traditional'],
    },
    {
      id: '678',
      title: 'Fix a bug with Django application',
      bounty: 5,
      bounty_suffix: 'ETH',
      buy_in: 0.3,
      buy_in_suffix: 'ETH',
      availability: 'Available',
      timeframe: '30 Days',
      technologies: ['HTML', 'CSS', 'React'],
      testing_type: ['Automated', 'Manual'],
      anon_type: ['Anon', 'Semi-Anon', 'Traditional'],
    },
  ];

  return (
    <ul className="grid grid-cols-1 gap-6">
      {contracts.map((item) => (
        <ContractItem contract={item} />
      ))}
    </ul>
  );
};

export default ContractsContainer;
