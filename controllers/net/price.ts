import { QueryFunctionContext, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { PRICES_URL } from '../apiURLs';
import * as gState from '../data/states';
import * as gType from '../data/types';
import { getTimestamp } from '../datetime';

export const useGetPrices = (req: gType.PriceRequest) => {
  const { code, type } = req;
  return useQuery({
    queryKey: ['prices', code, type],
    queryFn: getPrices,
    enabled: !!code && !!type,
    staleTime: Infinity,
  });
};

export const useGetPricesPrefetching = () => {
  const tabs = useAtomValue(gState.companyTabs);
  const queryClient = useQueryClient();

  useEffect(() => {
    for (const tab of tabs) {
      const code = tab.company.code;
      const type = tab.mainType;
      queryClient.prefetchQuery({
        queryKey: ['prices', code, type],
        queryFn: getPrices,
        staleTime: Infinity,
      });
    }
  }, [tabs, queryClient]);
};

export const useGetPricesLatest = (req: gType.PriceRequest) => {
  const { code, type } = req;
  return useQuery({
    queryKey: ['prices', code, type],
    queryFn: getPricesLatest,
    enabled: !!code && !!type,
    staleTime: 60000, // 60s
  });
};

export const useGetPricesLatestAll = () => {
  return useQuery({
    queryKey: ['prices', 'latestAll'],
    queryFn: getPricesLatestAll,
    staleTime: 60000, // 60s
  });
};

const getPrices = async ({ queryKey }: QueryFunctionContext<string[]>) => {
  const [_key, code, _t] = queryKey;
  const t = _t as gType.PriceRequestType;

  const url = `${PRICES_URL}/${code}/${t}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: gType.MyError = await res.json();
    throw Error(err.message);
  }

  const prices: any[] | undefined = (await res.json())?.prices;
  if (typeof prices === 'undefined') throw Error(`failed to GET ${url}`);
  if (!prices.length) throw Error(`received an empty response for GET ${url}`);

  // At this moment latest data is at [0] b/c data from backend is in descending order
  const base = parseInt(prices[0].base_stock_cnt);

  // parse numeric string to number
  const data: gType.PriceVolumeRaw[] = prices
    .filter((v) => v.open) // This filters out no trading days (e.g. no trading for stock split)
    .reverse() // This makes ascending order
    .map((v) => {
      const base_stock_cnt = parseInt(v.base_stock_cnt);
      const scaler = base_stock_cnt / base;
      const r = {
        date: t === 'weekly' ? ({ year: v.year, week: v.week } as gType.IDWeek) : new Date(v.date),
        open: Math.round((t === 'weekly' ? parseInt(v.open) : v.open) * scaler),
        close: Math.round((t === 'weekly' ? parseInt(v.close) : v.close) * scaler),
        high: Math.round((t === 'weekly' ? parseInt(v.high) : v.high) * scaler),
        low: Math.round((t === 'weekly' ? parseInt(v.low) : v.low) * scaler),
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
  const t = _t as gType.PriceRequestType;

  const url = `${PRICES_URL}/${code}/${t}`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: gType.MyError = await res.json();
    throw Error(err.message);
  }

  const data: gType.KRXRaw = await res.json();
  const prices = data?.prices ?? [];

  // Validate data
  if (typeof data !== 'object') throw Error(`failed to GET ${url}`);
  if (typeof data?.current_datetime !== 'string') throw Error(`failed to parce data from ${url}`);
  if (prices.length === 0) throw Error(`failed to parce data from ${url}`);

  const r: gType.PriceVolumeRaw[] = [];
  for (let i = 0; i < prices.length; i++) {
    const {
      tdd_opnprc = '0',
      tdd_hgprc = '0',
      tdd_lwprc = '0',
      tdd_clsprc = '0',
      acc_trdvol = '0',
      acc_trdval = '0',
      list_shrs = '0',
    } = prices[i];
    const date = new Date(data.current_datetime);
    const open = parseInt(tdd_opnprc.replaceAll(',', ''));
    const close = parseInt(tdd_clsprc.replaceAll(',', ''));
    const high = parseInt(tdd_hgprc.replaceAll(',', ''));
    const low = parseInt(tdd_lwprc.replaceAll(',', ''));
    const volume = parseInt(acc_trdvol.replaceAll(',', ''));
    const trading_value = parseInt(acc_trdval.replaceAll(',', ''));
    const base_stock_cnt = parseInt(list_shrs.replaceAll(',', ''));
    r.push({ date, open, close, high, low, volume, trading_value, base_stock_cnt });
  }

  r.sort((a, b) => getTimestamp(b.date) - getTimestamp(a.date));
  return r[0];
};

const getPricesLatestAll = async () => {
  const url = `${PRICES_URL}/snapshot`;
  const res = await fetch(url, { method: 'GET' });

  if (res.status >= 400) {
    const err: gType.MyError = await res.json();
    throw Error(err.message);
  }

  const data: gType.KRXRaw = await res.json();
  const prices = data?.prices ?? [];

  // Validate data
  if (typeof data !== 'object') throw Error(`failed to GET ${url}`);
  if (typeof data?.current_datetime !== 'string') throw Error(`failed to parce data from ${url}`);
  if (prices.length === 0) throw Error(`failed to parce data from ${url}`);
  // Use the global isNaN(), not Number.isNaN()
  // b/c Number.isNaN() doesn't attempt to convert the parameter to a number
  // whereas the global isNaN() coerces its parameter to a number
  if (isNaN(Number(prices[0].tdd_clsprc?.replaceAll(',', ''))))
    throw Error(`data from ${url} is NaN`);

  const r: gType.TreemapData = {
    current_datetime: new Date(data.current_datetime),
    treemap: { name: 'KRX', children: [] },
  };
  for (let i = 0; i < prices.length; i++) {
    const { tdd_clsprc = '0', fluc_rt = '0', mktcap = '0', isu_abbrv = '' } = prices[i];
    const close = parseInt(tdd_clsprc.replaceAll(',', ''));
    const change_percentage = parseFloat(fluc_rt.replaceAll(',', ''));
    const marketcap = parseInt(mktcap.replaceAll(',', ''));
    const p: gType.TreemapPrice = {
      name: isu_abbrv,
      value: marketcap,
      close,
      change_percentage,
    };
    r.treemap.children?.push(p);
  }

  return r;
};
