export type TypeError = { code: number; message: string };

export type TypePriceRequestType = 'daily' | 'weekly';
export type TypeAvgMethod = 'simple' | 'exponential' | 'weighted';
export type TypeAvgValue = 'close' | 'open' | 'high' | 'low';
export type TypeChart = 'price' | 'heikin-aski' | 'heikin-aski-smoothed';
export type TypeDartReportCode = '11011' | '11012' | '11013' | '11014';
export type TypeDartIndexCode = 'M210000' | 'M220000' | 'M230000' | 'M240000';
export type TypeDartStatementType = 'OFS' | 'CFS';

export type TypeIDWeek = { year: number; week: number };
export type TypeDate = { date: Date | TypeIDWeek };

export type TypePriceRequest = { code: string; type: TypePriceRequestType };
export type TypeChartRequest = { code: string; type: TypeChart };
export type TypeIDPriceMA = TypePriceRequest & { method: TypeAvgMethod; period: number };

export type TypePrice = TypeDate & {
  open: number;
  close: number;
  high: number;
  low: number;
};

export type TypeVolume = TypePrice & { volume: number };

export type TypePriceRaw = TypeVolume & {
  trading_value: number;
  base_stock_cnt: number;
};

export type TypeParabolicSAR = TypeDate & { sar: number; isUpTrend: boolean };

export type TypeMovingAvg = TypeDate & { avg: number };

export type TypePriceBollingerBands = TypeDate & {
  upper: number;
  middle: number;
  lower: number;
};

export type TypeCompany = {
  itmsNm: string;
  srtnCd: string;
  isinCd: string;
  mrktCtg: string;
  crno: string;
  corpNm: string;
};

export type TypeCompanyTab = {
  uuid: string;
  company: TypeCompany;
  mainType: TypePriceRequestType;
};

export type TypeChartOverlay = 'ParabolicSAR' | 'BollingerBands';
export type TypeChartDisplay = {
  ParabolicSAR: boolean;
  BollingerBands: boolean;
};

export type TypeDartRes = {
  status: string;
  message: string;
  list?: TypeDartIndexItem[];
};

export type TypeDartIndexItem = {
  bsns_year: string;
  corp_code: string;
  stock_code: string;
  reprt_code: string;
  idx_cl_code: string;
  idx_cl_nm: string;
  idx_code: string;
  idx_nm: string;
  idx_val?: string;
};

export type TypeDartStatementRes = {
  status: string;
  message: string;
  list?: TypeDartStatementItem[];
};

export type TypeDartStatementItem = {
  rcept_no: string;
  reprt_code: string;
  bsns_year: string;
  corp_code: string;
  sj_div: string;
  sj_nm: string;
  account_id: string;
  account_nm: string;
  account_detail: string;
  thstrm_nm: string;
  thstrm_amount: string;
  thstrm_add_amount?: string;
  frmtrm_nm?: string;
  frmtrm_amount?: string;
  frmtrm_q_nm?: string;
  frmtrm_q_amount?: string;
  frmtrm_add_amount?: string;
  bfefrmtrm_nm?: string;
  bfefrmtrm_amount?: string;
  ord: string;
  currency: string;
};
