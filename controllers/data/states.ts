import { atom, atomFamily } from 'recoil';
import {
  TypeChartDisplay,
  TypeChartRequest,
  TypeCompanyTab,
  TypeIDPriceMA,
  TypeMovingAvg,
  TypeParabolicSAR,
  TypePrice,
  TypePriceRequest,
} from './types';

export const StateChartOverlays = atomFamily<TypeChartDisplay, TypeChartRequest>({
  key: 'StateChartOverlays',
  default: { ParabolicSAR: true, BollingerBands: true },
});

export const StatePriceHeikinAshi = atomFamily<TypePrice[], TypePriceRequest>({
  key: 'StatePriceHeikinAshi',
  default: [],
});

export const StatePriceHeikinAshiSmoothed = atomFamily<TypePrice[], TypePriceRequest>({
  key: 'StatePriceHeikinAshiSmoothed',
  default: [],
});

export const StatePriceSAR = atomFamily<TypeParabolicSAR[], TypePriceRequest>({
  key: 'StatePriceSAR',
  default: [],
});

export const StatePriceBollingerBands = atomFamily<PriceTypeBollingerBands[], TypePriceRequest>({
  key: 'StatePriceBollingerBands',
  default: [],
});

export const StatePriceMA = atomFamily<TypeMovingAvg[], TypeIDPriceMA>({
  key: 'StatePriceMA',
  default: [],
});

export const StateSearchInput = atom<string>({
  key: 'StateSearchInput',
  default: '',
});

export const StateCompanyTabs = atom<TypeCompanyTab[]>({
  key: 'StateCompanyTabs',
  default: [],
});

export const StateCurrentTab = atom<TypeCompanyTab>({
  key: 'StateCurrentTab',
  default: {
    uuid: '',
    company: { itmsNm: '', srtnCd: '', isinCd: '', mrktCtg: '', crno: '', corpNm: '' },
    mainType: 'daily',
  },
});

export const StateRecentSearchTabs = atom<TypeCompanyTab[]>({
  key: 'StateRecentSearchTabs',
  default: [],
});

export const StateDetailsOpened = atom<boolean>({
  key: 'StateDetailsOpened',
  default: false,
});
