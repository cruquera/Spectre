export type TaxReport = {
  id: string;
  year: number;
  reportType: string;
  data: string;
};

export type TaxPreview = {
  message: string;
  sellCount: number;
  year: number;
};
