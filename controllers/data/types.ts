export type MyError = { code: number; message: string };
export type RectCoordi = { x: number; y: number; w: number; h: number };

export type PriceRequestType = 'daily' | 'weekly' | 'latest';
export type AvgMethod = 'simple' | 'exponential' | 'weighted';
export type PriceValue = 'close' | 'open' | 'high' | 'low';
export type PriceVolumeValue = PriceValue | 'volume';
export type Chart =
  | 'price'
  | 'mini-price'
  | 'volume'
  | 'percent-change'
  | 'heikin-aski'
  | 'heikin-aski-smoothed'
  | 'adx'
  | 'rsi'
  | 'macd'
  | 'macd-v'
  | 'atrp'
  | 'co'
  | 'cmf'
  | 'so';
export type DartReportCode = '11011' | '11012' | '11013' | '11014';
export type DartIndexCode = 'M210000' | 'M220000' | 'M230000' | 'M240000';
export type DartStatementType = 'OFS' | 'CFS';

export type IDWeek = { year: number; week: number };
export type MyDate = { date: Date | IDWeek };
export type PriceRequest = { code: string; type: PriceRequestType };
export type IDPriceMA = PriceRequest & { method: AvgMethod; period: number };

export type ChartData =
  | Price
  | PriceVolume
  | PricePercentChange
  | ParabolicSAR
  | MovingAvg
  | PriceBollingerBands
  | Adx
  | Rsi
  | Macd
  | MacdV
  | Atrp
  | Chaikin
  | Stochastic;
export type Price = MyDate & {
  open: number;
  close: number;
  high: number;
  low: number;
};
export type PriceVolume = Price & { volume: number };
export type PriceVolumeRaw = PriceVolume & {
  trading_value: number;
  base_stock_cnt: number;
};
export type PricePercentChange = MyDate & { percent_change: number };
export type ParabolicSAR = MyDate & { sar: number; isUpTrend: boolean; distance: number };
export type MovingAvg = MyDate & { avg: number };
export type PriceBollingerBands = MyDate & {
  upper: number;
  middle: number;
  lower: number;
};
export type Adx = MyDate & { posDI: number; negDI: number; adx: number };
export type Rsi = MyDate & { rsi: number };
export type Macd = MyDate & { macd: number; signal: number; histogram: number };
export type MacdV = MyDate & { macdV: number; signal: number; histogram: number };
export type Atrp = MyDate & { atrp: number };
export type Chaikin = MyDate & { cmf: number; co: number };
export type Stochastic = MyDate & { fullK: number; fullD: number };

export type Company = {
  itmsNm: string;
  srtnCd: string;
  isinCd: string;
  mrktCtg: string;
  crno: string;
  corpNm: string;
};
export type CompanyTab = {
  uuid: string;
  company: Company;
  mainType: PriceRequestType;
};

export type KRXRaw = { current_datetime?: string; prices?: KRXPriceRaw[] };
export type KRXPriceRaw = {
  sect_tp_nm?: string;
  isu_srt_cd?: string;
  isu_cd?: string;
  isu_abbrv?: string;
  tdd_opnprc?: string;
  tdd_hgprc?: string;
  tdd_lwprc?: string;
  tdd_clsprc?: string;
  cmpprevdd_prc?: string;
  fluc_rt?: string;
  fluc_tp_cd?: string;
  acc_trdvol?: string;
  acc_trdval?: string;
  list_shrs?: string;
  mktcap?: string;
  mkt_id?: string;
  mkt_nm?: string;
};
export type TreemapData = { current_datetime?: Date; treemap: TreemapPrice };
export type TreemapPrice = {
  name: string;
  value?: number; // value === market cap
  close?: number;
  change_percentage?: number;
  children?: TreemapPrice[]; // Recursive
};

export type DartRes = {
  status: string;
  message: string;
  list?: DartIndexItem[];
};
export type DartIndexItem = {
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
export type DartStatementRes = {
  status: string;
  message: string;
  list?: DartStatementItem[];
};
export type DartStatementItem = {
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
