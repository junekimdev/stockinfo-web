import * as d3 from 'd3';
import { MouseEvent, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { StateChartOverlays } from './data/states';
import {
  TypeChart,
  TypeChartOverlay,
  TypeDate,
  TypeIDWeek,
  TypeMovingAvg,
  TypeParabolicSAR,
} from './data/types';

export const getCandleColor = (d: TypePrice) => {
  if (d.open === d.close) return 'gray';
  return d.open > d.close ? 'blue' : 'red';
};

export const getDateString = (d: TypeDate) => {
  if (d.date?.year === undefined) {
    const year = d.date.getFullYear();
    const month = d.date.getMonth() + 1;
    const day = d.date.getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  } else {
    const { year, week } = d.date as TypeIDWeek;
    return `${year}-w${(week + 1).toString().padStart(2, '0')}`;
  }
};

export const getXCentered = (d: TypeDate, x: d3.ScaleBand<string>) =>
  x(getDateString(d)) + x.bandwidth() / 2;

export const drawSAR = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear,
  data: TypeParabolicSAR[],
) => {
  chart
    .append('g')
    .attr('class', 'sar')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('r', 2)
    .attr('cx', (d) => getXCentered(d, x))
    .attr('cy', (d) => y(d.sar))
    .attr('stroke', (d) => (d.isUpTrend ? 'red' : 'blue'))
    .attr('fill', 'none');
};

export const drawMA = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear,
  data: TypeMovingAvg[],
  color: string,
) => {
  const group = chart
    .append('g')
    .attr('class', 'avg')
    .attr('fill', 'none')
    .attr('stroke', color)
    .attr('stroke-width', 1);
  group
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypeMovingAvg>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.avg)),
    );
};

export const drawBollingerBands = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear,
  data: PriceDailyTypeBollingerBands[],
) => {
  const bbGroup = chart
    .append('g')
    .attr('class', 'bands')
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-width', 1);
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<PriceTypeBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.middle)),
    );
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<PriceTypeBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.upper)),
    );
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<PriceTypeBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.lower)),
    );
};

export const getMarginLeft = (data: TypePrice[] | undefined) => {
  if (data && data.length) {
    const size = 8;
    const maxChar = data
      .reduce((p, v) => Math.max(p, v.high, v.volume), -Infinity)
      .toString().length;
    return (maxChar + Math.floor(maxChar / 3)) * size;
  }
  return 0;
};

export const useCheckboxChange = (code: string, type: TypeChart, overlay: TypeChartOverlay) => {
  const setState = useSetRecoilState(StateChartOverlays({ code, type }));

  return useCallback(
    (e: MouseEvent<HTMLInputElement>) => {
      setState((prev) => ({ ...prev, [overlay]: e.currentTarget.checked }));
    },
    [code, type, overlay],
  );
};
