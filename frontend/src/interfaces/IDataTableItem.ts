interface IAttachment {
  filename: string;
  link: string;
}

interface ICurrency {
  crypto_value: number;
  crypto_suffix: string;
  fiat_value?: number;
  fiat_suffix?: string;
}

interface IDataTableItem {
  label: string;
}

export interface IDataTableItemText extends IDataTableItem {
  value: string;
}

export interface IDataTableItemChips extends IDataTableItem {
  value: string[];
  chipColor?: string;
}

export interface IDataTableItemFiles extends IDataTableItem {
  value: IAttachment[];
}

export interface IDataTableItemCurrency extends IDataTableItem {
  value: ICurrency;
  totalRow?: boolean;
}
