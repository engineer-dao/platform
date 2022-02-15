export interface ITransactionModalProps {
  show: boolean;
  onFinish?: () => void;
  onConfirmed?: (arg0: string) => void;
  onError?: (arg0: string) => void;
}
