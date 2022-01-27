import { IContract } from '../interfaces/IContract';

export const myContracts: IContract[] = [
  {
    id: '1',
    title: 'Create a website',
    bounty: 3.4,
    bounty_suffix: 'ETH',
    buy_in: 0.3,
    buy_in_suffix: 'ETH',
    status: 'active',
    timeframe: '30 Days',
    technologies: ['HTML', 'CSS', 'React'],
    testing_type: ['Automated', 'Manual'],
    anon_type: ['Anon', 'Semi-Anon', 'Traditional'],
    ownership: {
      supplier_address: '0xhiii',
      due_date: new Date('2/1/2022'),
      engineer_address: '0xOhHaiiii',
      started_at: new Date('1/15/2022'),
    },
  },
  {
    id: '2',
    title: 'Build a Solidity contract',
    bounty: 2.4,
    bounty_suffix: 'ETH',
    buy_in: 0.3,
    buy_in_suffix: 'ETH',
    timeframe: '30 Days',
    status: 'active',
    technologies: ['HTML', 'CSS', 'React'],
    testing_type: ['Automated', 'Manual'],
    anon_type: ['Anon', 'Semi-Anon', 'Traditional'],
    ownership: {
      supplier_address: '0xhiii',
      due_date: new Date('2/1/2022'),
      engineer_address: '0xOhHaiiii',
      started_at: new Date('1/15/2022'),
    },
  },
  {
    id: '3',
    title: 'Fix a bug with Django application',
    bounty: 5,
    bounty_suffix: 'ETH',
    buy_in: 0.3,
    buy_in_suffix: 'ETH',
    timeframe: '30 Days',
    status: 'active',
    technologies: ['HTML', 'CSS', 'React'],
    testing_type: ['Automated', 'Manual'],
    anon_type: ['Anon', 'Semi-Anon', 'Traditional'],
    ownership: {
      supplier_address: '0xhiii',
      due_date: new Date('2/1/2022'),
      engineer_address: '0xOhHaiiii',
      started_at: new Date('1/15/2022'),
    },
  },
];