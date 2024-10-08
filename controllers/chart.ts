import * as d3 from 'd3';
import { ChangeEvent, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { StateChartOverlays } from './data/states';
import {
  TypeChart,
  TypeChartData,
  TypeChartOverlay,
  TypeDate,
  TypeIDWeek,
  TypeKRXPrice,
  TypeMovingAvg,
  TypeParabolicSAR,
  TypePrice,
  TypePriceBollingerBands,
  TypePriceVolume,
} from './data/types';

export const getCandleColor = (d: TypePrice) => {
  if (d.open === d.close) return 'gray';
  return d.open > d.close ? 'blue' : 'red';
};

export const getChangeColor = (d: number) => {
  if (d === 0) return 'gray';
  return d < 0 ? 'blue' : 'red';
};

export const getDateString = (d: TypeDate) => {
  if (Object.hasOwn(d.date, 'year')) {
    const { year, week } = d.date as TypeIDWeek;
    return `${year}-w${(week + 1).toString().padStart(2, '0')}`;
  } else {
    const dd = d.date as Date;
    const year = dd.getFullYear();
    const month = (dd.getMonth() + 1).toString().padStart(2, '0');
    const day = dd.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

export const getXCentered = (d: TypeDate, x: d3.ScaleBand<string>) =>
  (x(getDateString(d)) ?? 0) + x.bandwidth() / 2;

interface IChartArgs {
  id: string;
  yMin: number;
  yMax: number;
  data: TypeChartData[];
  margin?: { top: number; bottom: number; left: number; right: number };
  chartHeight?: number;
  dataWidth?: number;
  gridColor?: string;
  showYticks?: boolean;
  showXticks?: boolean;
  tickYCount?: number;
}
export const initChart = (
  args: IChartArgs,
): {
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  x: d3.ScaleBand<string>;
  y: d3.ScaleLinear<number, number, never>;
} => {
  const {
    id,
    yMin,
    yMax,
    data,
    margin = { top: 10, bottom: 10, left: 0, right: 0 },
    chartHeight = 250,
    dataWidth = 10,
    gridColor = '#D0D0D0',
    showYticks = true,
    showXticks = false,
    tickYCount = 10,
  } = args;
  const chartWidth = dataWidth * data.length;
  const height = chartHeight + margin.top + margin.bottom;
  const width = chartWidth + margin.left + margin.left;

  const svg = d3
    .select(`#${id}`)
    .attr('xmlns', d3.namespaces.svg)
    .attr('viewBox', [0, 0, width, height])
    .style('width', width)
    .style('height', height);

  // Clear SVG before redrawing
  svg.selectAll('*').remove();

  // Start a chart
  const chart = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Set scales
  const x = d3.scaleBand().range([0, chartWidth]).padding(0.2);
  const y = d3.scaleLinear().range([chartHeight, 0]);
  x.domain(data.map(getDateString));
  y.domain([yMin, yMax]).nice();

  // Draw the Y Axis
  if (showYticks) {
    chart
      .append('g')
      .attr('transform', `translate(${chartWidth},0)`)
      .call(d3.axisLeft(y).tickSize(chartWidth).ticks(tickYCount)); // tickSize(chartWidth) makes grid
    chart
      .append('g')
      .attr('transform', `translate(${chartWidth},0)`)
      .call(d3.axisRight(y).ticks(tickYCount));
  }

  // Draw the X Axis
  if (showXticks) {
    chart
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', `rotate(-90) translate(-10,-${(x.bandwidth() * 3) / 2})`)
      .style('text-anchor', 'end');
  }

  chart.selectAll('.domain').attr('stroke', gridColor);
  chart.selectAll('.tick line').attr('stroke', gridColor);

  return { chart, x, y };
};

export const drawCandle = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  data: TypePrice[],
) => {
  const candleGroup = chart.append('g').attr('class', 'candle');

  // Draw lines for candle wicks
  candleGroup
    .selectAll('line.wick')
    .data(data)
    .join('line')
    .attr('class', 'wick')
    .attr('x1', (d) => getXCentered(d, x))
    .attr('x2', (d) => getXCentered(d, x))
    .attr('y1', (d) => y(d.high))
    .attr('y2', (d) => y(d.low))
    .attr('stroke', getCandleColor);

  // Draw bars for candle body
  candleGroup
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => x(getDateString(d)) ?? 0)
    .attr('y', (d) => y(Math.max(d.open, d.close)))
    .attr('height', (d) =>
      d.open !== d.close ? y(Math.min(d.open, d.close)) - y(Math.max(d.open, d.close)) : 1,
    )
    .attr('width', x.bandwidth())
    .attr('fill', getCandleColor);
};

export const drawLatestPrice = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  start: TypeDate,
  end: TypeDate,
  data: TypeKRXPrice,
) => {
  const p1: [number, number] = [x(getDateString(start)) ?? 0, y(data.close)];
  const p2: [number, number] = [(x(getDateString(end)) ?? 0) + x.bandwidth(), y(data.close)];
  const group = chart.append('g').attr('class', 'latest');
  group
    .append('path')
    .attr('d', d3.line()([p1, p2]))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
};

export const drawLatestChange = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
  start: TypeDate,
  end: TypeDate,
  data: number,
) => {
  const p1: [number, number] = [x(getDateString(start)) ?? 0, y(data)];
  const p2: [number, number] = [(x(getDateString(end)) ?? 0) + x.bandwidth(), y(data)];
  const group = chart.append('g').attr('class', 'latest');
  group
    .append('path')
    .attr('d', d3.line()([p1, p2]))
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 1);
};

export const drawSAR = (
  chart: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
  x: d3.ScaleBand<string>,
  y: d3.ScaleLinear<number, number, never>,
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
  y: d3.ScaleLinear<number, number, never>,
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
  y: d3.ScaleLinear<number, number, never>,
  data: TypePriceBollingerBands[],
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
        .line<TypePriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.middle)),
    );
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypePriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.upper)),
    );
  bbGroup
    .append('path')
    .datum(data)
    .attr(
      'd',
      d3
        .line<TypePriceBollingerBands>()
        .x((d) => getXCentered(d, x))
        .y((d) => y(d.lower)),
    );
};

export const getMarginLeft = (data: TypePriceVolume[] | undefined) => {
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
    (e: ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({ ...prev, [overlay]: e.currentTarget.checked }));
    },
    [code, type, overlay],
  );
};
