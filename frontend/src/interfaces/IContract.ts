export interface IContract {
  id: string;
  title: string;
  bounty: number;
  bounty_suffix: string;
  buy_in: number;
  buy_in_suffix: string;
  availability: string;
  timeframe: string;
  technologies: string[];
  testing_type: string[];
  anon_type: string[];
}
