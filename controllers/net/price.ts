import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { PRICES_URL } from '../apiURLs';
import {
  TypeError,
  TypeIDWeek,
  TypeKRX,
  TypeKRXPrice,
  TypeKRXRaw,
  TypePriceRaw,
  TypePriceRequest,
  TypePriceRequestType,
} from '../data/types';

export const useGetPrices = (req: TypePriceRequest) => {
  const { code, type } = req;
  return useQuery({
    queryKey: ['prices', code, type],
    queryFn: getPrices,
    enabled: !!code && !!type,
    staleTime: Infinity,
    placeholderData: [],
  });
};

export const useGetPricesLatest = (req: TypePriceRequest) => {
  const { code, type } = req;
  return useQuery({
    queryKey: ['prices', code, type],
    queryFn: getPricesLatest,
    enabled: !!code && !!type,
    staleTime: 60000, // 1 minute
    placeholderData: { current_datetime: new Date(), prices: [] },
  });
};

const getPrices = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key, code, _t] = queryKey;
  const t = _t as TypePriceRequestType;

  const url = `${PRICES_URL}/${code}/${t}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const prices: any[] | undefined = (await res.json())?.prices;
  if (typeof prices === 'undefined') throw Error(`failed to GET ${url}`);
  if (!prices.length) throw Error(`received an empty response for GET ${url}`);

  // At this moment latest data is at [0] b/c data from backend is in descending order
  const base = parseInt(prices[0].base_stock_cnt);

  // parse numeric string to number
  const data: TypePriceRaw[] = prices
    .filter((v) => v.open) // This filters out no trading days (e.g. no trading for stock split)
    .reverse() // This makes ascending order
    .map((v) => {
      const base_stock_cnt = parseInt(v.base_stock_cnt);
      const scaler = base_stock_cnt / base;
      const r = {
        date: t === 'daily' ? new Date(v.date) : ({ year: v.year, week: v.week } as TypeIDWeek),
        open: Math.round((t === 'daily' ? v.open : parseInt(v.open)) * scaler),
        close: Math.round((t === 'daily' ? v.close : parseInt(v.close)) * scaler),
        high: Math.round((t === 'daily' ? v.high : parseInt(v.high)) * scaler),
        low: Math.round((t === 'daily' ? v.low : parseInt(v.low)) * scaler),
        volume: parseInt(v.volume),
        trading_value: parseInt(v.trading_value),
        base_stock_cnt,
      };
      return r;
    });

  return data;
};

const getPricesLatest = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key, code, _t] = queryKey;
  const t = _t as TypePriceRequestType;

  const url = `${PRICES_URL}/${code}/${t}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: TypeError = await res.json();
    throw Error(err.message);
  }

  const data: TypeKRXRaw = await res.json();
  const prices = data?.prices ?? [];

  // Validate data
  if (typeof data !== 'object') throw Error(`failed to GET ${url}`);
  if (typeof data?.current_datetime !== 'string') throw Error(`failed to parce data from ${url}`);
  if (prices.length === 0) throw Error(`failed to parce data from ${url}`);

  const r: TypeKRX = { current_datetime: new Date(data.current_datetime), prices: [] };
  for (let i = 0; i < prices.length; i++) {
    const { tdd_clsprc, fluc_rt, mktcap } = prices[i];
    const close = parseInt(tdd_clsprc?.replaceAll?.(',', ''));
    const change_percentage = parseFloat(fluc_rt?.replaceAll?.(',', ''));
    const marketcap = parseInt(mktcap?.replaceAll?.(',', ''));
    r.prices.push({ close, change_percentage, marketcap } as TypeKRXPrice);
  }

  return r;
};

// const getPricesSnapshot = async ({ queryKey }: QueryFunctionContext<string[]>) => {};
