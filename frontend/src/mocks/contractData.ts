import { currencyFormatter } from '../utils/currency';

export const contractData = [
  { label: 'Supplier', value: '0x753a5842789f953D702f46Fd7805EDf23E0564E2' },
  {
    label: 'Description',
    value:
      'Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. ',
  },
  {
    label: 'Acceptance Criteria',
    value:
      'Fugiat ipsum ipsum deserunt culpa aute sint do nostrud anim incididunt cillum culpa consequat. Excepteur qui ipsum aliquip consequat sint. Sit id mollit nulla mollit nostrud in ea officia proident. Irure nostrud pariatur mollit ad adipisicing reprehenderit deserunt qui eu. ',
  },
  {
    label: 'Contact Information',
    value: 'cryptoanon1337@0x.com',
  },
  { label: 'Timeframe', value: '30 Days' },
  {
    label: 'Labels',
    value: ['React', 'Frontend', 'UI', 'Figma', 'HTML', 'CSS'],
  },
  {
    label: 'Identity',
    value: ['Anon', 'Partial Anon', 'Optional Anon', 'Traditional'],
  },
  {
    label: 'Acceptance Testing',
    value: ['Manual', 'Manual Approval', 'Automated', 'Incremental Review'],
  },
  {
    label: 'Attachments',
    value: [
      { filename: 'test.zip', link: 'http://google.com' },
      { filename: 'requirements.zip', link: 'http://google.com' },
    ],
  },
  {
    label: 'Bounty',
    value: {
      crypto_value: 3,
      crypto_suffix: 'ETH',
      fiat_value: currencyFormatter(16942.0),
      fiat_suffix: 'USD',
    },
  },
  {
    label: 'Buy-In',
    value: {
      crypto_value: 0.3,
      crypto_suffix: 'ETH',
      fiat_value: currencyFormatter(1003.42),
      fiat_suffix: 'USD',
    },
  },
  {
    label: 'Total Payout',
    value: {
      crypto_value: 3.3,
      crypto_suffix: 'ETH',
      fiat_value: currencyFormatter(17945.42),
      fiat_suffix: 'USD',
    },
  },
];
