import { ChangeEvent, useCallback, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { smaStep } from '../../controllers/avg';
import { StateStochastic, StateStochasticDisplay } from '../../controllers/data/states';
import {
  TypePrice,
  TypePriceRequest,
  TypePriceValue,
  TypeStochastic,
  TypeStochasticDisplayItem,
} from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const useDisplayCheckboxChange = (what: TypeStochasticDisplayItem) => {
  const setState = useSetRecoilState(StateStochasticDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({ ...prev, [what]: e.currentTarget.checked }));
    },
    [what],
  );
};

export const useStochastic = (
  req: TypePriceRequest,
  period = [14, 3, 3],
  over: TypePriceValue = 'close',
) => {
  const { data } = useGetPrices(req);
  const [dataStochastic, setState] = useRecoilState(StateStochastic(req));
  const [p1, p2, p3] = period;

  useEffect(() => {
    if (data && data.length && !dataStochastic.length) {
      const result: TypeStochastic[] = [];
      const kStore: number[] = [];
      const fullKStore: number[] = [];

      for (let i = 0; i < data.length; i++) {
        const k = getK(data, p1, i, over);
        kStore.push(k);
        const fullK = smaStep<number>(kStore, p2, i, (d) => d);
        fullKStore.push(fullK);
        const fullD = smaStep<number>(fullKStore, p3, i, (d) => d);

        const { date } = data[i];
        result.push({ date, fullK, fullD });
      }
      setState(result);
    }
  }, [p1, p2, p3, over, data, dataStochastic]);
};

export const getHighestHigh = (data: TypePrice[], period: number, i: number) => {
  if (i === 0) return data[i].high;
  if (i < period) return data.slice(0, i + 1).reduce((p, v) => Math.max(p, v.high), -Infinity);
  return data.slice(i + 1 - period, i + 1).reduce((p, v) => Math.max(p, v.high), -Infinity);
};

export const getLowestLow = (data: TypePrice[], period: number, i: number) => {
  if (i === 0) return data[i].low;
  if (i < period) return data.slice(0, i + 1).reduce((p, v) => Math.min(p, v.low), Infinity);
  return data.slice(i + 1 - period, i + 1).reduce((p, v) => Math.min(p, v.low), Infinity);
};

export const getK = (data: TypePrice[], period: number, i: number, over: TypePriceValue) => {
  const hh = getHighestHigh(data, period, i);
  const ll = getLowestLow(data, period, i);
  return hh === ll ? 100 : ((data[i][over] - ll) / (hh - ll)) * 100;
};